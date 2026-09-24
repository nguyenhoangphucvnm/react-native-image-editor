import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * `UnsafeObject` is the codegen-recognised passthrough type for an untyped JS
 * object parameter.  The React Native codegen AST parser matches on the name
 * "UnsafeObject" in the source and maps it to NSDictionary* (iOS) /
 * ReadableMap (Android).
 *
 * It must be declared as an empty object type `{}` — NOT as `Record<string, any>`,
 * which the codegen parser rejects with "Unrecognised generic type 'Record'".
 * The tsc compiler accepts `{}` fine for this purpose.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type UnsafeObject = {};

/**
 * TurboModule codegen spec for RNPhotoEditor.
 *
 * Design notes
 * ────────────
 * • `props` is typed as `UnsafeObject` — the correct codegen-recognised alias
 *   for an untyped JS object. Using plain `Object` is rejected by the strict
 *   codegen validator in React Native 0.74+.
 *
 * • The method returns `Promise<string>` instead of accepting two `Callback`
 *   parameters. `Callback` parameters are unsafe on New Architecture because
 *   they are backed by a `CallbackHolder` tied to the current JS context; if
 *   the JS context reloads while the native Activity / ViewController is open
 *   (Fast Refresh, error boundary recovery) the stored block/lambda becomes
 *   dangling. A `Promise` is resolved or rejected by the native side exactly
 *   once and is safe across context reloads.
 *
 * • On Old Architecture `TurboModuleRegistry.getEnforcing` falls through to
 *   the `NativeModules` bridge automatically (RN ≥ 0.73), so no separate
 *   bridge registration is needed.
 */
export interface Spec extends TurboModule {
  /**
   * Open the native photo editor.
   *
   * @param props - Editor configuration object (path, colors, stickers, …).
   * @returns Promise that resolves with the saved image path, or rejects with
   *          code "CANCELLED" when the user dismisses without saving.
   */
  edit(props: UnsafeObject): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNPhotoEditor');
