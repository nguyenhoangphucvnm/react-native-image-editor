---
id: image-editor
title: ImageEditor
sidebar_label: ImageEditor
---

# `ImageEditor`

The main class exported by `@phucprime/react-native-image-editor`. All methods are static.

```typescript
import { ImageEditor } from '@phucprime/react-native-image-editor';
```

---

## `ImageEditor.edit()`

**Promise-based API.** Opens the native editor and resolves with the path to the saved image. Rejects if the user cancels.

```typescript
static edit(
  path: string,
  options?: Omit<ImageEditorConfig, 'path' | 'onDone' | 'onCancel'>,
): Promise<string>
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | `string` | ✅ | Local filesystem path to the image to edit. |
| `options` | `object` | — | Any `ImageEditorConfig` field except `path`, `onDone`, `onCancel`. |

### Returns

`Promise<string>` — resolves with the **local file path** of the saved image (the original file is overwritten).

Rejects with `Error("Editor cancelled with code: {resultCode}")` when the user dismisses without saving.

### Example

```typescript
import { ImageEditor } from '@phucprime/react-native-image-editor';

// Minimal — default palette, no stickers
const saved = await ImageEditor.edit('/var/mobile/Containers/.../photo.jpg');

// With options
const saved = await ImageEditor.edit('/var/mobile/Containers/.../photo.jpg', {
  colors: ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'],
  stickers: ['sticker_heart', 'sticker_star', 'sticker_fire'],
  hiddenControls: ['share'],
  languages: {
    doneTitle: 'Finish',
    saveTitle: 'Save Photo',
  },
});

console.log('Edited image at:', saved);
```

---

## `ImageEditor.open()`

**Callback-based API.** Opens the native editor and fires `onDone` or `onCancel` when the user is finished.

```typescript
static open(config: ImageEditorConfig): void
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `config` | [`ImageEditorConfig`](./types#imageeditorconfig) | ✅ | Full configuration object. |

### Example

```typescript
import { ImageEditor } from '@phucprime/react-native-image-editor';

ImageEditor.open({
  path: '/var/mobile/Containers/.../photo.jpg',
  colors: ['#000000', '#ffffff', '#ff0000'],
  stickers: ['sticker1'],
  hiddenControls: ['share', 'clear'],
  onDone: (editedPath) => {
    console.log('Saved to:', editedPath);
    // editedPath is the same path you passed in — file is overwritten in place
  },
  onCancel: (resultCode) => {
    console.log('User cancelled. Native result code:', resultCode);
  },
});
```

---

## `ImageEditor.Edit()` _(deprecated)_

```typescript
/** @deprecated Use ImageEditor.open() instead. */
static Edit(config: ImageEditorConfig): void
```

An alias for `open()` kept for backward compatibility with pre-1.0 code. Prefer `open()` or `edit()`.

---

## Default values

When a field is omitted from the config, the library applies these defaults automatically. You do not need to specify them unless you want to override.

### Default colour palette

```typescript
const DEFAULT_COLORS = [
  '#000000', // Black
  '#808080', // Gray
  '#a9a9a9', // Dark gray
  '#FFFFFE', // Near-white
  '#0000ff', // Blue
  '#00ff00', // Green
  '#ff0000', // Red
  '#ffff00', // Yellow
  '#ffa500', // Orange
  '#800080', // Purple
  '#00ffff', // Cyan
  '#a52a2a', // Brown
  '#ff00ff', // Magenta
];
```

### Default language strings

```typescript
const DEFAULT_LANGUAGES = {
  doneTitle:               'Done',
  saveTitle:               'Save',
  clearAllTitle:           'Clear all',
  cameraTitle:             'Camera',
  galleryTitle:            'Gallery',
  uploadDialogTitle:       'Upload Image',
  uploadPickerTitle:       'Select Picture',
  directoryCreateFail:     'Failed to create directory',
  accessMediaPermissionsMsg: 'To attach photos, we need to access media on your device',
  continueTxt:             'Continue',
  notNow:                  'NOT NOW',
  mediaAccessDeniedMsg:    'You denied storage access, no photos will be added.',
  saveImageSucceed:        'Image saved',
  eraserTitle:             'Eraser',
};
```

---

## Save behaviour

### iOS
The editor writes the result back to **the original file path**. It detects format by file extension:
- `.png` → saved as PNG (lossless)
- any other extension → saved as JPEG at **80% quality**

For `file://` URIs the scheme is stripped before writing.

### Android — Done button
The edited bitmap is written back to **the original file path** as JPEG at **80% quality**.

### Android — Save to gallery button
Saves a **new timestamped file** in `Pictures/PhotoEditorSDK/` on external storage. The original file is not modified.

---

## TypeScript exports

```typescript
// Named exports
export { ImageEditor };
export { PhotoEditor };        // deprecated alias for ImageEditor

// Types
export type { ImageEditorConfig };
export type { ImageEditorLanguage };
export type { EditorControl };

// Deprecated type aliases
export type { PhotoEditorProps };   // = ImageEditorConfig
export type { Language };           // = ImageEditorLanguage
```
