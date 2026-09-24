import Foundation
import UIKit
import iOSPhotoEditor

/**
 * Native implementation of the RNPhotoEditor TurboModule.
 *
 * Promise migration
 * ─────────────────
 * The previous implementation stored two `RCTResponseSenderBlock` references
 * as instance properties and invoked them from the `PhotoEditorDelegate`
 * callbacks.  On New Architecture, `RCTResponseSenderBlock` values are backed
 * by `CallbackHolder` objects tied to the active JS context.  If the JS context
 * reloads (Fast Refresh, error-boundary recovery) while the editor is open,
 * those stored blocks become dangling — invoking them is a no-op or a crash.
 *
 * `RCTPromiseResolveBlock` / `RCTPromiseRejectBlock` are designed for exactly
 * this single-shot async pattern and are safe across context reloads.
 *
 * UIApplication.shared.delegate?.window deprecation fix
 * ──────────────────────────────────────────────────────
 * `UIApplication.shared.delegate?.window` is deprecated in iOS 15.  Apps that
 * adopt `UIWindowScene` (the default since iOS 13 / Xcode 11) set their window
 * on the scene, not on the app delegate, so the delegate window is nil.
 * The fix enumerates `connectedScenes` and finds the foreground-active
 * `UIWindowScene`, then picks its key window.
 */
@objc(RNPhotoEditor)
class RNPhotoEditor: NSObject {

    // MARK: - Stored promise blocks

    /// Stored until the delegate fires.  Both are set together and cleared together.
    private var pendingResolve: RCTPromiseResolveBlock?
    private var pendingReject:  RCTPromiseRejectBlock?

    /// Path of the image currently being edited; needed by doneEditing to write the result.
    private var editImagePath: String?

    // MARK: - RN module config

    @objc static func requiresMainQueueSetup() -> Bool { true }

    @objc func methodQueue() -> DispatchQueue { .main }

    // MARK: - Native method (matches RCT_EXTERN_METHOD selector in .mm)

    /**
     * Opens the photo editor.
     *
     * Called by the JS bridge via RCT_EXTERN_METHOD.
     * Matches the codegen spec: `edit(props: UnsafeObject): Promise<string>`.
     *
     * - Parameters:
     *   - props:   Editor configuration dictionary (path, colors, stickers, hiddenControls).
     *   - resolve: Called with the saved image path on success.
     *   - reject:  Called with code "CANCELLED" when the user dismisses without saving.
     */
    @objc(edit:resolve:reject:)
    func edit(
        _ props: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject:  @escaping RCTPromiseRejectBlock
    ) {
        // Dispatch all UI work to main thread — methodQueue() returns .main, but
        // being explicit here guards against any future threading changes.
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }

            // Reject immediately if another edit is already in flight
            if self.pendingResolve != nil {
                reject("ALREADY_OPEN", "An editor session is already in progress", nil)
                return
            }

            self.pendingResolve = resolve
            self.pendingReject  = reject
            self.editImagePath  = props["path"] as? String

            // ── Build the PhotoEditorViewController ───────────────────────────
            let photoEditor = PhotoEditorViewController(
                nibName: "PhotoEditorViewController",
                bundle: Bundle(for: PhotoEditorViewController.self)
            )

            // ── Image ─────────────────────────────────────────────────────────
            if let path = self.editImagePath {
                var image = UIImage(contentsOfFile: path)
                if image == nil, let url = URL(string: path), let data = try? Data(contentsOf: url) {
                    image = UIImage(data: data)
                }
                photoEditor.image = image
            }

            // ── Stickers ──────────────────────────────────────────────────────
            if let stickers = props["stickers"] as? [String] {
                photoEditor.stickers = stickers.compactMap { UIImage(named: $0) }
            }

            // ── Hidden controls ───────────────────────────────────────────────
            if let hiddenControls = props["hiddenControls"] as? [String] {
                photoEditor.hiddenControls = hiddenControls.compactMap { name in
                    switch name.lowercased() {
                    case "crop":    return .crop
                    case "sticker": return .sticker
                    case "draw":    return .draw
                    case "text":    return .text
                    case "save":    return .save
                    case "share":   return .share
                    case "clear":   return .clear
                    default:        return nil
                    }
                }
            }

            // ── Colors ────────────────────────────────────────────────────────
            if let colors = props["colors"] as? [String] {
                photoEditor.colors = colors.compactMap { self.color(fromHexString: $0) }
            }

            // ── Present ───────────────────────────────────────────────────────
            photoEditor.photoEditorDelegate = self
            photoEditor.modalPresentationStyle = .fullScreen

            guard let presenter = self.topPresentingViewController() else {
                self.clearPending()
                reject("NO_VIEW_CONTROLLER", "Could not find a view controller to present from", nil)
                return
            }
            presenter.present(photoEditor, animated: true)
        }
    }

    // MARK: - Helpers

    /// Clears stored promise blocks and edit path after the session ends.
    private func clearPending() {
        pendingResolve = nil
        pendingReject  = nil
        editImagePath  = nil
    }

    /**
     * Returns the topmost view controller that can present modally.
     *
     * Uses `connectedScenes` instead of the deprecated
     * `UIApplication.shared.delegate?.window` API.  The delegate window is
     * `nil` in scene-based apps (UIWindowScene, the default since iOS 13).
     */
    private func topPresentingViewController() -> UIViewController? {
        // Find the foreground-active window scene
        let scene = UIApplication.shared.connectedScenes
            .first { $0.activationState == .foregroundActive } as? UIWindowScene

        // Pick the key window from that scene (or fall back to any window)
        let rootVC = scene?.windows.first(where: { $0.isKeyWindow })?.rootViewController
            ?? scene?.windows.first?.rootViewController

        guard let root = rootVC else { return nil }

        // Walk up the presentation chain to find the topmost presenter
        var top: UIViewController = root
        while let presented = top.presentedViewController {
            top = presented
        }
        return top
    }

    // MARK: - Hex color parser

    private func colorComponent(from string: String, start: Int, length: Int) -> CGFloat {
        let s = string.index(string.startIndex, offsetBy: start)
        let e = string.index(s, offsetBy: length)
        var sub = String(string[s..<e])
        if length == 1 { sub += sub }
        var hex: UInt64 = 0
        Scanner(string: sub).scanHexInt64(&hex)
        return CGFloat(hex) / 255.0
    }

    private func color(fromHexString hexString: String) -> UIColor? {
        let s = hexString.replacingOccurrences(of: "#", with: "").uppercased()
        switch s.count {
        case 3:
            return UIColor(
                red:   colorComponent(from: s, start: 0, length: 1),
                green: colorComponent(from: s, start: 1, length: 1),
                blue:  colorComponent(from: s, start: 2, length: 1),
                alpha: 1)
        case 4:
            return UIColor(
                red:   colorComponent(from: s, start: 1, length: 1),
                green: colorComponent(from: s, start: 2, length: 1),
                blue:  colorComponent(from: s, start: 3, length: 1),
                alpha: colorComponent(from: s, start: 0, length: 1))
        case 6:
            return UIColor(
                red:   colorComponent(from: s, start: 0, length: 2),
                green: colorComponent(from: s, start: 2, length: 2),
                blue:  colorComponent(from: s, start: 4, length: 2),
                alpha: 1)
        case 8:
            return UIColor(
                red:   colorComponent(from: s, start: 2, length: 2),
                green: colorComponent(from: s, start: 4, length: 2),
                blue:  colorComponent(from: s, start: 6, length: 2),
                alpha: colorComponent(from: s, start: 0, length: 2))
        default:
            return nil
        }
    }
}

// MARK: - PhotoEditorDelegate

extension RNPhotoEditor: PhotoEditorDelegate {

    func doneEditing(image: UIImage) {
        guard let resolve = pendingResolve,
              let path    = editImagePath else {
            clearPending()
            return
        }
        defer { clearPending() }

        // Determine output format from the file extension
        let isPNG = (path as NSString).pathExtension.lowercased() == "png"

        // Normalise file:// URI → bare POSIX path before writing
        var writePath = path
        if writePath.hasPrefix("file://"), let url = URL(string: path) {
            writePath = url.path
        }

        let data = isPNG ? image.pngData() : image.jpegData(compressionQuality: 0.8)
        do {
            try data?.write(to: URL(fileURLWithPath: writePath), options: .atomic)
            resolve(writePath)
        } catch {
            // Resolve with original path even on write error so the JS side
            // is not left hanging — the error is logged for diagnostics.
            NSLog("[RNPhotoEditor] write error: %@", error.localizedDescription)
            resolve(writePath)
        }
    }

    func canceledEditing() {
        defer { clearPending() }
        pendingReject?("CANCELLED", "User cancelled the editor", nil)
    }
}
