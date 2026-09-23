---
id: changelog
title: Changelog
sidebar_label: 📝 Changelog
---

# Changelog

All notable changes to `@phucprime/react-native-image-editor` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
