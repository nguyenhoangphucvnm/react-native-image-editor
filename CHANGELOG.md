# Changelog

All notable changes to **`@phucprime/react-native-image-editor`** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.4] — 2026-09-24

### Added

- **Yarn Workspaces monorepo**: Declared `"workspaces": ["Example"]` in the root `package.json` and set `nmHoistingLimits: workspaces` in `.yarnrc.yml`. `Example/` is now a proper workspace member — `yarn install` at the repo root installs all dependencies for both the library and the Example app, and creates the `@phucprime/react-native-image-editor` symlink inside `Example/node_modules/@phucprime/` so Metro and CocoaPods auto-linking find it correctly.
- **Documentation site** (`docs/`): Comprehensive Docusaurus 3.10.2 site deployed to GitHub Pages at `https://nguyenhoangphucvnm.github.io/react-native-image-editor/`. Includes Getting Started, full iOS/Android installation guides, API reference (`ImageEditor`, all TypeScript types), four usage guides (Stickers, Localization, Hidden Controls, File Paths), Architecture deep-dive, Troubleshooting, and Changelog pages.
- **GitHub Actions — docs deploy** (`.github/workflows/deploy-docs.yml`): Workflow that builds the Docusaurus site and pushes `docs/build/` to the `gh-pages` branch on every push to `master` that touches `docs/**`. GitHub Pages now serves the compiled HTML from `gh-pages` root rather than the raw source folder.
- **GitHub Actions — release publish** (`.github/workflows/release.yml`): Fixed malformed workflow (bare `steps:` block with no `name`/`on`/`jobs` wrapper). Now triggers on GitHub Release creation, sets up Node 20 with `registry-url: https://npm.pkg.github.com`, and publishes via `NODE_AUTH_TOKEN`.

### Changed

**TurboModule / New Architecture — JS layer**

- `src/NativeRNPhotoEditor.ts`: Replaced `Object` (rejected by strict codegen validator in RN 0.74+) with a locally-declared `UnsafeObject = {}` type. This is the only form the RN codegen AST parser recognises as a passthrough object type — `Record<string, any>` was also tried and rejected with `UnsupportedGenericParserError: Unrecognised generic type 'Record'`.
- `src/NativeRNPhotoEditor.ts`: Migrated from two `Callback` parameters to a single `Promise<string>` return value. The method is renamed from `Edit` to `edit` (camelCase, matching codegen conventions).
- `src/index.ts`: All JS logic now routes through a single `callNative()` helper that calls `NativeRNPhotoEditor.edit(props)`. The public API (`ImageEditor.open()`, `ImageEditor.edit()`) is unchanged.

**TurboModule / New Architecture — Android**

- `android/src/main/java/ui/photoeditor/RNPhotoEditorPackage.java`: Migrated from `ReactPackage` to `TurboReactPackage`. Without this, `TurboModuleRegistry.getEnforcing('RNPhotoEditor')` throws "No TurboModule found" on New Architecture because `ReactPackage.createNativeModules()` is never consulted by the TurboModule registry.
- `android/src/main/java/ui/photoeditor/RNPhotoEditorModule.java`: Replaced two `Callback` parameters with a `Promise`. Added `public static final String NAME = "RNPhotoEditor"`. Added `volatile` + `synchronized` guards on `mPendingPromise` to prevent race conditions between the JS thread (write) and the UI thread (`onActivityResult` read/null). Added guards for null `Activity`, null `Intent`, null `imagePath`, and a try/catch around `Color.parseColor()`. Added an `ALREADY_OPEN` rejection if a second call arrives while the editor is already open.
- `android/src/newarch/java/ui/photoeditor/RNPhotoEditorSpec.java`: Updated abstract method signature to `edit(ReadableMap props, Promise promise)`.
- `android/src/oldarch/java/ui/photoeditor/RNPhotoEditorSpec.java`: Updated abstract method signature to match New Arch — `edit(ReadableMap props, Promise promise)` — so `RNPhotoEditorModule.java` compiles identically on both architectures.
- `android/build.gradle`: Replaced `implementation 'com.facebook.react:react-native:+'` (open range, version skew risk) with `compileOnly 'com.facebook.react:react-android'` (RN 0.71+ artifact name, resolved from the host app at runtime).

**TurboModule / New Architecture — iOS**

- `ios/RNImageEditor.podspec`: Added `.swift` to `source_files` (was `**/*.{h,m,mm}` — `RNPhotoEditor.swift` was silently never compiled for pod consumers). Added `CLANG_CXX_LANGUAGE_STANDARD = c++17` and `OTHER_CPLUSPLUSFLAGS` to `pod_target_xcconfig`. Added full `install_modules_dependencies` / fallback guard for New Architecture pod dependencies.
- `ios/RNPhotoEditor.mm`: Changed `RCT_EXTERN_METHOD` selector from `Edit:onDone:onCancel:` (using deprecated `RCTResponseSenderBlock`) to `edit:resolve:reject:` (using `RCTPromiseResolveBlock` / `RCTPromiseRejectBlock`), matching the codegen-generated `NativeRNPhotoEditorSpec` protocol.
- `ios/RNPhotoEditor.swift`: Replaced `RCTResponseSenderBlock` instance fields with `RCTPromiseResolveBlock` / `RCTPromiseRejectBlock`. Replaced deprecated `UIApplication.shared.delegate?.window` (returns `nil` in scene-based apps since iOS 13) with a `topPresentingViewController()` helper that walks `UIApplication.shared.connectedScenes` to find the foreground-active `UIWindowScene` and its key window. Added `clearPending()` helper to atomically nil all stored state after each session. Added `ALREADY_OPEN` rejection guard.

### Fixed

- `Example/` `yarn install` failing with `Workspace not found (@phucprime/react-native-image-editor@workspace:*)`: Caused by `Example/yarn.lock`, `Example/.yarn/cache`, and `Example/.yarnrc.yml` all existing, which made Yarn treat `Example/` as a standalone project rather than a workspace member. All three were removed; the root workspace config now governs everything.
- `pod install` failing with `UnsupportedGenericParserError: Unrecognised generic type 'Record'`: The codegen parser rejected `Record<string, any>` in `NativeRNPhotoEditor.ts`. Fixed by declaring `type UnsafeObject = {}` — the exact form the RN codegen AST parser maps to `NSDictionary *` on iOS and `ReadableMap` on Android.

---

## [1.0.3] — 2026-09-17

### Fixed

**iOS**

- Removed duplicate `RNPhotoEditor.m` file. The podspec glob `*.{h,m,mm,swift}` was picking up both `.m` and `.mm` with identical content. Xcode compiled the `.m` as plain Objective-C (`-x objective-c`), which cannot include C++ standard-library headers (`<utility>`, `<vector>`, `<chrono>`) pulled in transitively by TurboModule/JSI headers. Keeping only the `.mm` (Objective-C++) resolves `ScanDependencies` build errors under New Architecture.
- Moved `CLANG_CXX_LANGUAGE_STANDARD = c++17` and `OTHER_CPLUSPLUSFLAGS` out of the `RCT_NEW_ARCH_ENABLED` conditional in the podspec so they always apply regardless of RN version — `install_modules_dependencies` (used with RN ≥ 0.71) bypasses that branch.
- Added a `post_install` per-target override in the Example `Podfile` to enforce C++17 on the `react-native-image-editor` pod as a belt-and-suspenders fix.

**Android**

- Patched `photo-editor-android.jar` bytecode — `PhotoEditorSDK` was compiled against `com.ahmedadeltito.photoeditorsdk.R$layout/R$id`, but the JAR was distributed without a bundled `R` class (it should have been an AAR). The constant pool was rewritten to reference `ui.photoeditor.R$layout/R$id` (the library's actual namespace), eliminating the `NoClassDefFoundError: com/ahmedadeltito/photoeditorsdk/R$layout` crash on sticker/text tap.
- Added missing layout resources `photo_editor_sdk_image_item_list.xml` and `photo_editor_sdk_text_item_list.xml` with the exact view IDs (`photo_editor_sdk_image_iv`, `photo_editor_sdk_text_tv`) that `PhotoEditorSDK.addImage()` and `PhotoEditorSDK.addText()` inflate at runtime.

---

## [1.0.2] — 2026-02-27

### Added

- **New Architecture Support**: Added full TurboModule and Codegen support (`RNPhotoEditorSpec`) for iOS and Android.
- **Dual-Arch Android Source Sets**: Configured `src/newarch` and `src/oldarch` specs in `android/build.gradle`.
- **TypeScript Codegen Spec**: Added `src/NativeRNPhotoEditor.ts` for type-safe native module integration via `TurboModuleRegistry`.

### Changed

- **Peer Dependencies**: Raised minimum supported versions to `react-native >= 0.73.0` and `react >= 18.2.0`.
- **Module Resolution**: Updated `src/index.ts` to export the module using `TurboModuleRegistry.getEnforcing()`.
- **Publish Workflow**: Updated release script in `package.json` to execute `npm run prepare` before publishing.

### Fixed

- **Android**: Cleaned up deprecated `createJSModules()` in `RNPhotoEditorPackage.java` and removed duplicate layout transform code in `SlidingUpPanelLayout.java`.
- **Sponsorship**: Updated funding configurations in `.github/FUNDING.yml`.

---

## [1.0.1] — 2026-02-27

### Added

- **React Native 0.78.2 Support**: Upgraded Metro and Babel presets (`module:@react-native/babel-preset`) across the project.
- **New Architecture by Default**: Set `newArchEnabled=true` in Example app `gradle.properties`.

### Changed

- **Android SDK & Tooling**: Upgraded `compileSdkVersion` and `targetSdkVersion` to 35, raised `minSdkVersion` to 24, updated NDK version to `27.1.12297006`, and AGP to `8.2.1`.
- **iOS Build Settings**: Upgraded C++ Language Standard to `c++20`.
- **Release Script**: Enhanced npm release script to support token authentication and custom registry settings.

### Removed

- **Flipper Integration**: Removed legacy `ReactNativeFlipper.java` debug/release files from the Android Example app.

---

## [1.0.0] — 2026-02-26

### Added

- **Initial Release**: Launched `@phucprime/react-native-image-editor`.
- **Native Modules**: Added iOS (`RNPhotoEditor.m` / Objective-C & Swift bridging) and Android (`RNPhotoEditorModule.java`) native photo editing implementations.
- **Editing Capabilities**:
  - Image cropping (via UCrop on Android, `iOSPhotoEditor` SDK on iOS).
  - Freehand drawing brush with color selection.
  - Text overlay with custom fonts and colors.
  - Sticker picker and placement support.
  - Interactive object scaling, rotation, and deletion.
- **Configurability**: Added props to customize visible tools (`hiddenControls`), custom stickers array (`stickers`), custom colors (`colors`), and UI string translations (`languages`).
- **Callbacks**: Added `onDone` and `onCancel` callbacks to handle editor events.
- **Promise API**: Added `ImageEditor.edit()` returning a `Promise<string>`.
- **TypeScript Types**: Exported `ImageEditorConfig`, `ImageEditorLanguage`, and `EditorControl` types with full JSDoc documentation.
- **Build System**: TypeScript compilation via `react-native-builder-bob`, outputting CJS, ESM, and `.d.ts` declarations.

### Deprecated

- `PhotoEditor` class — use `ImageEditor` instead.
- `PhotoEditor.Edit()` — use `ImageEditor.open()` or `ImageEditor.edit()` instead.
- `PhotoEditorProps` type — use `ImageEditorConfig` instead.
- `Language` type — use `ImageEditorLanguage` instead.

---

[1.0.4]: https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.4
[1.0.3]: https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.3
[1.0.2]: https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.2
[1.0.1]: https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.1
[1.0.0]: https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.0
