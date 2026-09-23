<h1 align="center">@phucprime/react-native-image-editor</h1>

<p align="center">
  A high-performance, native image editing library for React Native — crop, draw, text, stickers, and more.<br/>
  Fully supports the <strong>New Architecture</strong> (Fabric + TurboModules) and legacy bridge mode.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@phucprime/react-native-image-editor"><img src="https://img.shields.io/npm/v/@phucprime/react-native-image-editor.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@phucprime/react-native-image-editor"><img src="https://img.shields.io/npm/dm/@phucprime/react-native-image-editor.svg?style=flat-square" alt="npm downloads" /></a>
  <a href="https://github.com/phucprime/react-native-image-editor/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@phucprime/react-native-image-editor.svg?style=flat-square" alt="license" /></a>
  <a href="https://reactnative.dev/docs/the-new-architecture/landing-page"><img src="https://img.shields.io/badge/React%20Native-New%20Architecture-blue?style=flat-square" alt="New Architecture Ready" /></a>
</p>

---

## ⚡ Features

- ✂️ **Image Cropping**: Precision native cropping UI.
- 🎨 **Freehand Drawing**: Brush tool with custom color choices.
- ✍️ **Text Overlays**: Add, position, scale, and rotate text with custom colors.
- 🎭 **Stickers**: Add customizable sticker overlays.
- 🚀 **TurboModules Support**: Native performance on React Native New Architecture.

## 📱 Screenshots

|                   iOS                    |                   Android                    |
| :--------------------------------------: | :------------------------------------------: |
| <img src="assets/ios.gif" width="280" /> | <img src="assets/android.gif" width="280" /> |

---

## 📋 Compatibility

| Platform / Tool  | Minimum     | Tested          |
| ---------------- | ----------- | --------------- |
| **React Native** | `>= 0.73`   | **`0.78.2`**    |
| **React**        | `>= 18.2.0` | **`19.0.0`**    |
| **iOS**          | `13.0`      | `18.0`          |
| **Android**      | API 24      | API 35          |
| **Architecture** | Old Arch ✅ | **New Arch ✅** |

> **Note:** Requires **JDK 17** and **Gradle 8.x** for Android builds.

---

## 📦 Installation

```bash
npm install @phucprime/react-native-image-editor
# or
yarn add @phucprime/react-native-image-editor
```

### iOS

Add to your `Podfile`:

```ruby
use_frameworks! :linkage => :static
pod "iOSPhotoEditor", :git => "https://github.com/phucprime/photo-editor", :branch => "master"
```

Then run `pod install`.

Add to `Info.plist`:

```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Allow access to save edited photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Allow access to select photos for editing</string>
```

### Android

Add JitPack to your root `android/build.gradle`:

```groovy
allprojects {
    repositories {
        maven { url "https://jitpack.io" }
    }
}
```

Add activities to `AndroidManifest.xml`:

```xml
<activity android:name="com.ahmedadeltito.photoeditor.PhotoEditorActivity" />
<activity android:name="com.yalantis.ucrop.UCropActivity" />
```

## 🛠️ Usage

### Promise API (recommended)

```typescript
import { ImageEditor } from '@phucprime/react-native-image-editor';

const editedPath = await ImageEditor.edit('/path/to/image.jpg', {
  colors: ['#ff0000', '#00ff00', '#0000ff'],
  stickers: ['sticker1', 'sticker2'],
});
```

### Callback API

```typescript
ImageEditor.open({
  path: '/path/to/image.jpg',
  onDone: (path) => console.log('Saved:', path),
  onCancel: () => console.log('Cancelled'),
});
```

## ⚙️ Configuration Options

| Property         | Type       | Default         | Description                                                                                            |
| ---------------- | ---------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `path`           | `string`   | **Required**    | Local file URI/path of the image to edit.                                                              |
| `colors`         | `string[]` | Default palette | Array of hex color strings for drawing and text.                                                       |
| `stickers`       | `string[]` | `[]`            | List of sticker image names located in native resource folders.                                        |
| `hiddenControls` | `string[]` | `[]`            | Array of controls to hide (`'text'`, `'clear'`, `'draw'`, `'save'`, `'share'`, `'sticker'`, `'crop'`). |
| `languages`      | `object`   | English         | Object map for localized UI text strings.                                                              |

> **Tip:** Use [react-native-fs](https://github.com/itinance/react-native-fs) or `@react-native-camera-roll/camera-roll` to handle native file paths in sandbox directories before passing them to the editor.

---

## 🎨 Adding Custom Stickers

- **iOS**: Add image assets (`.png`) to your main Xcode Project's **Resources** bundle.
- **Android**: Add image assets (`.png`) to `android/app/src/main/res/drawable/`.

##### Refer to the [Example](Example/) project for a ready-to-run demonstration setup.

## 📄 License

Distributed under the [Apache 2.0 License](LICENSE).

---

## 🙏 Credits

Maintained by **[nguyenhoangphucvnm](https://github.com/nguyenhoangphucvnm)**. Based on [prscX/react-native-photo-editor](https://github.com/prscX/react-native-photo-editor), built upon native photo editor SDKs.
