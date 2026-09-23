---
id: types
title: Types
sidebar_label: Types
---

# Types

All types are exported from `@phucprime/react-native-image-editor`.

```typescript
import type {
  ImageEditorConfig,
  ImageEditorLanguage,
  EditorControl,
} from '@phucprime/react-native-image-editor';
```

---

## `ImageEditorConfig`

The configuration object passed to [`ImageEditor.open()`](./image-editor#imageeditoropen) and [`ImageEditor.edit()`](./image-editor#imageeditoredit).

```typescript
interface ImageEditorConfig {
  path: string;
  colors?: string[];
  stickers?: string[];
  hiddenControls?: EditorControl[];
  languages?: ImageEditorLanguage;
  onDone?: (imagePath: string) => void;
  onCancel?: (resultCode: number) => void;
}
```

### Fields

#### `path` — `string` · **required**

Local filesystem path (or `file://` URI) of the image to edit. The editor overwrites this file when the user taps **Done**. See the [File Paths guide](../guides/file-paths).

```typescript
path: 'file:///var/mobile/Containers/Data/Application/.../photo.jpg'
path: '/data/user/0/com.myapp/files/photo.jpg'
```

---

#### `colors` — `string[]` · optional

Array of hex color strings for the drawing and text colour picker. Accepts `#RGB`, `#RRGGBB`, and `#AARRGGBB`.

```typescript
colors: ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6']
```

**Default:** 13-colour built-in palette — see [ImageEditor defaults](./image-editor#default-colour-palette).

---

#### `stickers` — `string[]` · optional

Array of sticker image **names** (no extension) matching native resource names. iOS: main bundle images. Android: `res/drawable/` names.

```typescript
stickers: ['sticker_heart', 'sticker_star', 'sticker_fire']
```

**Default:** `[]`. See the [Stickers guide](../guides/stickers).

---

#### `hiddenControls` — `EditorControl[]` · optional

Controls to remove from the editor toolbar.

```typescript
hiddenControls: ['share', 'clear']
```

**Default:** `[]`. See [Hidden Controls guide](../guides/hidden-controls).

---

#### `languages` — `ImageEditorLanguage` · optional

Partial UI string overrides. Unset keys fall back to English.

```typescript
languages: { doneTitle: 'Finish', saveTitle: 'Save to Gallery' }
```

**Default:** English. See [Localization guide](../guides/localization).

---

#### `onDone` — `(imagePath: string) => void` · optional

Called after the edited image is saved. `imagePath` is the file path that was written. Not used with `ImageEditor.edit()`.

---

#### `onCancel` — `(resultCode: number) => void` · optional

Called when the user dismisses without saving. Not used with `ImageEditor.edit()`.

---

## `ImageEditorLanguage`

All fields are optional. Unset fields fall back to the English defaults listed below.

```typescript
interface ImageEditorLanguage {
  doneTitle?: string;               // default: 'Done'
  saveTitle?: string;               // default: 'Save'
  clearAllTitle?: string;           // default: 'Clear all'
  cameraTitle?: string;             // default: 'Camera'
  galleryTitle?: string;            // default: 'Gallery'
  uploadDialogTitle?: string;       // default: 'Upload Image'
  uploadPickerTitle?: string;       // default: 'Select Picture'
  directoryCreateFail?: string;     // default: 'Failed to create directory'
  accessMediaPermissionsMsg?: string;
  continueTxt?: string;             // default: 'Continue'
  notNow?: string;                  // default: 'NOT NOW'
  mediaAccessDeniedMsg?: string;
  saveImageSucceed?: string;        // default: 'Image saved'
  eraserTitle?: string;             // default: 'Eraser'
}
```

### Field reference

| Key | Default (English) | Where it appears |
|---|---|---|
| `doneTitle` | `Done` | Editor toolbar — main action button |
| `saveTitle` | `Save` | Save-to-gallery button (Android) |
| `clearAllTitle` | `Clear all` | Clear/undo all edits button |
| `cameraTitle` | `Camera` | Camera option in image picker |
| `galleryTitle` | `Gallery` | Gallery option in image picker |
| `uploadDialogTitle` | `Upload Image` | Sticker upload dialog title |
| `uploadPickerTitle` | `Select Picture` | Sticker source picker title |
| `directoryCreateFail` | `Failed to create directory` | Error toast when storage write fails |
| `accessMediaPermissionsMsg` | `To attach photos, we need to access media on your device` | Permission rationale dialog body |
| `continueTxt` | `Continue` | Permission rationale — confirm button |
| `notNow` | `NOT NOW` | Permission rationale — dismiss button |
| `mediaAccessDeniedMsg` | `You denied storage access, no photos will be added.` | Toast shown when permission is denied |
| `saveImageSucceed` | `Image saved` | Success toast after save-to-gallery |
| `eraserTitle` | `Eraser` | Eraser tool label |

---

## `EditorControl`

A union of the control names that can be hidden via `hiddenControls`.

```typescript
type EditorControl =
  | 'text'      // Text overlay tool
  | 'clear'     // Clear all edits
  | 'draw'      // Freehand brush tool
  | 'save'      // Save-to-gallery button (Android)
  | 'share'     // Share image button
  | 'sticker'   // Sticker picker
  | 'crop';     // Crop tool
```

---

## Deprecated types

These are exported for backward compatibility with pre-1.0 code. Prefer the canonical names above.

```typescript
/** @deprecated Use ImageEditorConfig */
type PhotoEditorProps = ImageEditorConfig;

/** @deprecated Use ImageEditorLanguage */
type Language = ImageEditorLanguage;
```
