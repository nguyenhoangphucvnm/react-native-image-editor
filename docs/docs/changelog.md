---
id: changelog
title: Changelog
sidebar_label: 📝 Changelog
---

# Changelog

All notable changes to `@phucprime/react-native-image-editor` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.4](https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.4) — 2026-09-24

### Added

- **Yarn Workspaces monorepo**: Declared `"workspaces": ["Example"]` in the root `package.json` and set `nmHoistingLimits: workspaces` in `.yarnrc.yml`. Running `yarn install` from the repo root now installs everything for both the library and the Example app, and creates the `@phucprime/react-native-image-editor` symlink that Metro and CocoaPods auto-linking require.
- **Documentation site** (`docs/`): Full Docusaurus 3.10.2 site deployed to GitHub Pages at `https://nguyenhoangphucvnm.github.io/react-native-image-editor/`. Covers Getting Started, iOS/Android installation, API reference, four usage guides, Architecture, Troubleshooting, and Changelog.
- **GitHub Actions — docs deploy** (`.github/workflows/deploy-docs.yml`): Builds Docusaurus on every `master` push touching `docs/**` and deploys compiled output to the `gh-pages` branch.
- **GitHub Actions — release publish** (`.github/workflows/release.yml`): Fixed malformed workflow file (was a bare `steps:` block with no `name`/`on`/`jobs` wrapper). Triggers on GitHub Release creation, publishes to GitHub Packages via `NODE_AUTH_TOKEN`.

### Changed

**TurboModule / New Architecture — JS**

- `src/NativeRNPhotoEditor.ts`: Replaced `Object` (rejected by strict codegen validator in RN 0.74+) with `type UnsafeObject = {}`. This is the exact form the RN codegen AST parser maps to `NSDictionary *` (iOS) / `ReadableMap` (Android). `Record<string, any>` was also tried and rejected with `UnsupportedGenericParserError: Unrecognised generic type 'Record'`.
- `src/NativeRNPhotoEditor.ts`: Migrated from two `Callback` parameters to a single `Promise<string>` return. Method renamed from `Edit` → `edit` (camelCase, codegen convention). `Callback` objects stored across `onActivityResult` / delegate boundaries become dangling if the JS context reloads; `Promise` is the correct single-shot async contract.
- `src/index.ts`: All native calls route through a single `callNative()` helper. Public API (`ImageEditor.open()`, `ImageEditor.edit()`) is unchanged.

**TurboModule / New Architecture — Android**

- `RNPhotoEditorPackage.java`: Migrated from `ReactPackage` → `TurboReactPackage` with `getModule()` + `getReactModuleInfoProvider()`. Without `TurboReactPackage`, `TurboModuleRegistry.getEnforcing('RNPhotoEditor')` throws "No TurboModule found" on New Architecture because `ReactPackage.createNativeModules()` is never consulted by the TurboModule registry.
- `RNPhotoEditorModule.java`: Replaced two `Callback` parameters with `Promise`. Added `public static final String NAME`. Added `volatile` + `synchronized` guards on `mPendingPromise` for cross-thread safety (JS thread writes, UI thread reads in `onActivityResult`). Added `ALREADY_OPEN` guard. Added null checks for `Activity`, `Intent`, `imagePath`. Wrapped `Color.parseColor()` in try/catch.
- `newarch/RNPhotoEditorSpec.java` + `oldarch/RNPhotoEditorSpec.java`: Updated abstract method to `edit(ReadableMap, Promise)` on both paths so `RNPhotoEditorModule.java` compiles identically regardless of architecture.
- `android/build.gradle`: `implementation 'com.facebook.react:react-native:+'` → `compileOnly 'com.facebook.react:react-android'`. The open `+` range can cause version skew between codegen output and the runtime; `compileOnly` avoids bundling a second copy of React Native.

**TurboModule / New Architecture — iOS**

- `ios/RNImageEditor.podspec`: Added `.swift` to `source_files` (previously `**/*.{h,m,mm}` — `RNPhotoEditor.swift` was silently never compiled for pod consumers). Added `CLANG_CXX_LANGUAGE_STANDARD = c++17` + `OTHER_CPLUSPLUSFLAGS` to `pod_target_xcconfig`. Added `install_modules_dependencies` guard.
- `ios/RNPhotoEditor.mm`: Changed `RCT_EXTERN_METHOD` selector from `Edit:onDone:onCancel:` (`RCTResponseSenderBlock`) to `edit:resolve:reject:` (`RCTPromiseResolveBlock` / `RCTPromiseRejectBlock`), matching the codegen-generated protocol.
- `ios/RNPhotoEditor.swift`: Replaced `RCTResponseSenderBlock` fields with Promise blocks. Replaced deprecated `UIApplication.shared.delegate?.window` (returns `nil` in scene-based apps since iOS 13) with a `topPresentingViewController()` helper that walks `connectedScenes` for the foreground-active `UIWindowScene`. Added `clearPending()` and `ALREADY_OPEN` guard.

### Fixed

- `Example/` `yarn install` failing with `Workspace not found (@phucprime/react-native-image-editor@workspace:*)`: `Example/yarn.lock`, `Example/.yarn/cache`, and `Example/.yarnrc.yml` caused Yarn to treat `Example/` as a standalone project. All three removed; root workspace config now governs everything.
- `pod install` failing with `UnsupportedGenericParserError: Unrecognised generic type 'Record'`: Fixed by changing `type UnsafeObject = Record<string, any>` to `type UnsafeObject = {}` in `src/NativeRNPhotoEditor.ts`.

---

## [1.0.3](https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.3) — 2026-09-17

### Fixed

**iOS**

- Removed duplicate `RNPhotoEditor.m` file. The podspec glob `*.{h,m,mm,swift}` was picking up both `.m` and `.mm` with identical content. Xcode compiled the `.m` as plain Objective-C (`-x objective-c`), which cannot include C++ standard-library headers (`<utility>`, `<vector>`, `<chrono>`) pulled in transitively by TurboModule/JSI headers. Keeping only the `.mm` (Objective-C++) resolves `ScanDependencies` build errors under New Architecture.
- Moved `CLANG_CXX_LANGUAGE_STANDARD = c++17` and `OTHER_CPLUSPLUSFLAGS` out of the `RCT_NEW_ARCH_ENABLED` conditional in the podspec so they always apply regardless of RN version — `install_modules_dependencies` (used with RN ≥ 0.71) bypasses that branch.
- Added a `post_install` per-target override in the Example `Podfile` to enforce C++17 on the `react-native-image-editor` pod as a belt-and-suspenders fix.

**Android**

- Patched `photo-editor-android.jar` bytecode — `PhotoEditorSDK` was compiled against `com.ahmedadeltito.photoeditorsdk.R$layout/R$id`, but the JAR was distributed without a bundled `R` class (it should have been an AAR). The constant pool was rewritten to reference `ui.photoeditor.R$layout/R$id` (the library's actual namespace), eliminating the `NoClassDefFoundError: com/ahmedadeltito/photoeditorsdk/R$layout` crash on sticker/text tap.
- Added missing layout resources `photo_editor_sdk_image_item_list.xml` and `photo_editor_sdk_text_item_list.xml` with the exact view IDs (`photo_editor_sdk_image_iv`, `photo_editor_sdk_text_tv`) that `PhotoEditorSDK.addImage()` and `PhotoEditorSDK.addText()` inflate at runtime.

---

## [1.0.2](https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.2) — 2026-02-27

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

## [1.0.1](https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.1) — 2026-02-27

### Added

- **React Native 0.78.2 Support**: Upgraded Metro and Babel presets (`module:@react-native/babel-preset`) across the project.
- **New Architecture by Default**: Set `newArchEnabled=true` in Example app `gradle.properties`.

### Changed

- **Android SDK & Tooling**: Upgraded `compileSdkVersion` and `targetSdkVersion` to 35, raised `minSdkVersion` to 24, updated NDK version to `27.1.12297006`, and AGP to `8.2.1`.
- **iOS Build Settings**: Upgraded C++ Language Standard to `c++20`.
- **Release Script**: Enhanced npm release script to support token authentication and custom registry settings.

### Removed

- **Flipper Integration**: Removed legacy `ReactNativeFlipper.java` debug/release files from the Android Example app.

### Contributors

- First contribution by [@nguyenhoangphucvnm](https://github.com/nguyenhoangphucvnm) in [#2](https://github.com/nguyenhoangphucvnm/react-native-image-editor/pull/2).

---

## [1.0.0](https://github.com/nguyenhoangphucvnm/react-native-image-editor/releases/tag/1.0.0) — 2026-02-26

### Added

- **Initial Release**: Launched `@phucprime/react-native-image-editor`.
- **Native Modules**: iOS (`RNPhotoEditor.m` / Objective-C & Swift bridging) and Android (`RNPhotoEditorModule.java`) native photo editing implementations.
- **Editing Capabilities**: Image cropping (UCrop / iOSPhotoEditor), freehand drawing, text overlays, sticker picker, interactive object scaling/rotation/deletion.
- **Configurability**: `hiddenControls`, `stickers`, `colors`, `languages` props.
- **Callbacks**: `onDone` and `onCancel`.
- **Promise API**: `ImageEditor.edit()` returning `Promise<string>`.
- **TypeScript Types**: `ImageEditorConfig`, `ImageEditorLanguage`, `EditorControl` with full JSDoc.
- **Build System**: `react-native-builder-bob` outputting CJS, ESM, and `.d.ts`.

### Deprecated

- `PhotoEditor` class → use `ImageEditor`.
- `PhotoEditor.Edit()` → use `ImageEditor.open()` or `ImageEditor.edit()`.
- `PhotoEditorProps` type → use `ImageEditorConfig`.
- `Language` type → use `ImageEditorLanguage`.
