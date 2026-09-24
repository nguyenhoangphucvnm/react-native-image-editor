#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNPhotoEditorSpec/RNPhotoEditorSpec.h>
#endif

/**
 * Objective-C++ bridge that exposes the Swift `RNPhotoEditor` class to
 * React Native.
 *
 * Method selector change
 * ──────────────────────
 * The TurboModule codegen spec defines `edit(props: UnsafeObject): Promise<string>`.
 * Codegen maps a Promise-returning method to two extra parameters on the native
 * side — a resolve block and a reject block — using the naming convention:
 *
 *   edit:(NSDictionary *)props
 *   resolve:(RCTPromiseResolveBlock)resolve
 *   reject:(RCTPromiseRejectBlock)reject
 *
 * The previous selector `Edit:onDone:onCancel:` used `RCTResponseSenderBlock`
 * which is not recognised by the TurboModule codegen validator and is unsafe
 * across JS context reloads.
 *
 * requiresMainQueueSetup / methodQueue
 * ─────────────────────────────────────
 * Returning YES from +requiresMainQueueSetup ensures the module is initialised
 * on the main thread.  The Swift side also overrides methodQueue to return
 * DispatchQueue.main, so UI work happens synchronously without dispatch_async.
 */
@interface RCT_EXTERN_MODULE(RNPhotoEditor, NSObject)

RCT_EXTERN_METHOD(
    edit:(NSDictionary *)props
    resolve:(RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
// Declare that the Swift class satisfies the codegen-generated protocol.
// The actual implementation is in RNPhotoEditor.swift; this forward
// declaration makes the compiler verify conformance at build time.
@interface RNPhotoEditor () <NativeRNPhotoEditorSpec>
@end
#endif
