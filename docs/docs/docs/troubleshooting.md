---
id: troubleshooting
title: Troubleshooting
sidebar_label: 🔧 Troubleshooting
---

# Troubleshooting

## iOS

---

### `'utility' file not found` / `'vector' file not found` / `'chrono' file not found`

**Symptom:** Xcode build fails during `ScanDependencies` for the `react-native-image-editor` target with errors like:

```
error: 'utility' file not found (in target 'react-native-image-editor' from project 'Pods')
error: 'vector' file not found
error: 'chrono' file not found
```

**Cause:** The pod target is being compiled as plain Objective-C (`-x objective-c`), which cannot include C++ standard-library headers pulled in transitively by TurboModule/JSI headers. This happens when `CLANG_CXX_LANGUAGE_STANDARD` is not set on the pod target.

**Fix:** Add the following to your Podfile's `post_install` block:

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == "react-native-image-editor"
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] =
          '$(inherited) -DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1'
      end
    end
  end
  # ... rest of your post_install
end
```

Then re-run `pod install` and rebuild.

---

### `Swift is not supported for static frameworks`

**Symptom:** Pod install or build fails with a message about Swift and static frameworks.

**Cause:** The `iOSPhotoEditor` dependency is a Swift framework and requires `use_frameworks! :linkage => :static` in the Podfile.

**Fix:** Add this line near the top of your Podfile (before the `target` block):

```ruby
use_frameworks! :linkage => :static
```

---

### Editor presents as a sheet instead of fullscreen

**Symptom:** On iOS 13+ the editor appears as a card/sheet, not fullscreen.

**Cause:** iOS 13 changed the default modal presentation style to `.pageSheet`.

**Status:** The library explicitly sets `modalPresentationStyle = .fullScreen` — this should not happen with v1.0.3+. If you see it, check that you're on the latest pod version.

---

### Image is `nil` / blank editor opens

**Symptom:** The editor opens but shows a blank canvas.

**Cause:** The image at `path` could not be loaded.

**Fix:**
1. Verify the file exists with `RNFS.exists(path)` before calling `ImageEditor.open()`.
2. If you're using a `file://` URI, that's fine — the library strips the scheme internally.
3. `content://` URIs are not supported — copy the file to the app sandbox first (see [File Paths guide](./guides/file-paths)).

---

## Android

---

### `NoClassDefFoundError: com/ahmedadeltito/photoeditorsdk/R$layout`

**Symptom:** App crashes immediately when tapping the sticker button or text button with:

```
java.lang.NoClassDefFoundError: Failed resolution of: Lcom/ahmedadeltito/photoeditorsdk/R$layout;
```

**Cause:** A pre-1.0.3 version of the bundled `photo-editor-android.jar` referenced `com.ahmedadeltito.photoeditorsdk.R$layout`, which was never generated as a class in the final APK.

**Fix:** Update to **v1.0.3** or later. The JAR's bytecode has been patched to reference `ui.photoeditor.R$layout` (the correct library namespace), and the two required layout XML files have been added.

---

### `ActivityNotFoundException` when opening the editor

**Symptom:** App crashes with `ActivityNotFoundException` the moment the editor tries to open.

**Cause:** The editor activities are not declared in `AndroidManifest.xml`.

**Fix:** Add both activities to `android/app/src/main/AndroidManifest.xml`:

```xml
<activity android:name="com.ahmedadeltito.photoeditor.PhotoEditorActivity" />
<activity android:name="com.yalantis.ucrop.UCropActivity" />
```

---

### `Could not resolve com.github.yalantis:ucrop`

**Symptom:** Gradle sync or build fails with a dependency resolution error for UCrop.

**Cause:** JitPack is not in the repository list.

**Fix:** Add JitPack to `android/build.gradle` (or `android/settings.gradle` for Gradle 7+ projects):

```groovy
// android/build.gradle
allprojects {
    repositories {
        maven { url "https://jitpack.io" }
    }
}
```

---

### Editor returns to the wrong screen / navigation stack corrupted

**Symptom:** After dismissing the editor the app navigates to an unexpected screen.

**Cause:** The editor uses `startActivityForResult` / `onActivityResult`, which interacts with the Activity back stack. Some React Navigation setups handle this differently.

**Fix:** This is generally handled by React Native's `ActivityEventListener`. If you experience issues, make sure you're not intercepting `onActivityResult` elsewhere in your app without forwarding the event to React Native.

---

### Stickers don't appear in the picker (Android)

**Symptom:** The sticker panel opens but shows no images.

**Cause:** The drawable resource names don't match, or the files are missing from `res/drawable/`.

**Fix:**
1. Confirm the `.png` files exist in `android/app/src/main/res/drawable/`.
2. Verify the names are lowercase and match exactly what you pass in `stickers`.
3. Run a clean build: `cd android && ./gradlew clean`.

---

### `UnsupportedOperationException` or blank image after crop (UCrop)

**Symptom:** The crop step crashes or produces a blank image.

**Cause:** UCrop requires the `READ_EXTERNAL_STORAGE` or `READ_MEDIA_IMAGES` permission on older Android versions.

**Fix:** Request the appropriate storage permission before opening the editor, or use a path inside the app's private sandbox (no permission required).

---

## General

---

### `onCancel` receives `0` instead of a meaningful code

This is expected behaviour. Android passes `Activity.RESULT_CANCELED` (`0`) and iOS passes an empty array. Use the cancellation event itself rather than the code value to detect dismissal.

---

### The editor modifies the original file — how do I keep a backup?

Copy the file before passing it to the editor:

```typescript
import RNFS from 'react-native-fs';

const original = '/path/to/original.jpg';
const working  = `${RNFS.CachesDirectoryPath}/edit_${Date.now()}.jpg`;

await RNFS.copyFile(original, working);

const saved = await ImageEditor.edit(working);
// original is untouched, saved === working
```

---

### Still stuck?

[Open an issue on GitHub](https://github.com/nguyenhoangphucvnm/react-native-image-editor/issues) with:
- React Native version
- Platform (iOS/Android) and OS version
- New Architecture enabled? (`newArchEnabled=true` / `RCT_NEW_ARCH_ENABLED=1`)
- Full error message and stack trace
