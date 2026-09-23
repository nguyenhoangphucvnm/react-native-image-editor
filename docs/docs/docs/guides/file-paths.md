---
id: file-paths
title: File Paths
sidebar_label: File Paths
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with File Paths

The editor requires a **local file path** pointing to an image that the app can both read from and write to. This page explains how to get valid paths for the most common sources.

## What paths are accepted

| Format | Example | Works? |
|---|---|---|
| Bare POSIX path | `/data/user/0/com.myapp/files/photo.jpg` | ✅ |
| `file://` URI | `file:///var/mobile/.../photo.jpg` | ✅ iOS only (stripped internally) |
| `content://` URI | `content://media/external/images/...` | ❌ Must be copied first |
| `http://` / `https://` | `https://example.com/photo.jpg` | ❌ Must be downloaded first |
| Metro bundler asset | `require('./photo.jpg')` (resolved URI) | ❌ Must be copied to sandbox |

:::caution Write access required
The editor overwrites the file at `path` when the user taps Done. The path must be inside a directory your app has **write** access to — typically the app's documents or cache directory.
:::

---

## Getting a path with `react-native-fs`

[`react-native-fs`](https://github.com/itinance/react-native-fs) provides cross-platform path constants and file operations.

```typescript
import RNFS from 'react-native-fs';

// App documents directory — persists across app restarts
const destPath = `${RNFS.DocumentDirectoryPath}/edited_photo.jpg`;

// Copy an existing file into the sandbox before editing
await RNFS.copyFile(sourceUri, destPath);

const saved = await ImageEditor.edit(destPath);
```

### Useful path constants from `react-native-fs`

| Constant | iOS | Android |
|---|---|---|
| `DocumentDirectoryPath` | `…/Documents` | `…/files` |
| `CachesDirectoryPath` | `…/Library/Caches` | `…/cache` |
| `TemporaryDirectoryPath` | `…/tmp` | `…/cache` |

---

## Downloading a remote image first

```typescript
import RNFS from 'react-native-fs';
import { ImageEditor } from '@phucprime/react-native-image-editor';

async function editRemoteImage(url: string) {
  const dest = `${RNFS.CachesDirectoryPath}/edit_${Date.now()}.jpg`;

  const { statusCode } = await RNFS.downloadFile({
    fromUrl: url,
    toFile: dest,
  }).promise;

  if (statusCode !== 200) throw new Error('Download failed');

  return ImageEditor.edit(dest);
}
```

---

## Camera Roll / Media Library

<Tabs groupId="platform">
<TabItem value="camera-roll" label="@react-native-camera-roll/camera-roll">

```typescript
import {
  CameraRoll,
  type PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { ImageEditor } from '@phucprime/react-native-image-editor';

async function editFromCameraRoll(photo: PhotoIdentifier) {
  const sourceUri = photo.node.image.uri;
  const filename  = `edit_${Date.now()}.jpg`;
  const destPath  = `${RNFS.DocumentDirectoryPath}/${filename}`;

  // CameraRoll URIs are content:// on Android — copy to sandbox first
  await RNFS.copyFile(sourceUri, destPath);

  return ImageEditor.edit(destPath);
}
```

</TabItem>
<TabItem value="image-picker" label="react-native-image-picker">

```typescript
import { launchImageLibrary } from 'react-native-image-picker';
import { ImageEditor } from '@phucprime/react-native-image-editor';

async function pickAndEdit() {
  const result = await launchImageLibrary({ mediaType: 'photo' });

  if (result.didCancel || !result.assets?.[0]?.uri) return;

  // react-native-image-picker resolves to a file:// or bare path
  // that is already in the app sandbox on iOS, and a writable path on Android
  const uri = result.assets[0].uri!;

  return ImageEditor.edit(uri);
}
```

</TabItem>
</Tabs>

---

## Using `react-native-blob-util` (as in the Example app)

The reference Example app uses `react-native-blob-util` to download a bundled asset and move it into the documents directory:

```typescript
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-blob-util';
import { Image } from 'react-native';

const photoPath = RNFS.DocumentDirectoryPath + '/photo1.jpg';
const binaryFile = Image.resolveAssetSource(require('./assets/photo.jpg'));

const resp = await RNFetchBlob.config({ fileCache: true })
  .fetch('GET', binaryFile.uri);

await RNFS.moveFile(resp.path(), photoPath);

// Now safe to pass to the editor
ImageEditor.open({ path: photoPath, onDone: () => {}, onCancel: () => {} });
```

---

## After editing

The editor writes the result back to the **same path** you passed in (iOS and Android Done button). If you need to keep the original, copy it first:

```typescript
const original = `${RNFS.DocumentDirectoryPath}/original.jpg`;
const editable = `${RNFS.DocumentDirectoryPath}/edit_copy.jpg`;

await RNFS.copyFile(original, editable);

const saved = await ImageEditor.edit(editable);
// `saved` === editable — original is untouched
```
