---
id: localization
title: Localization
sidebar_label: Localization
---

# Localization

Every user-visible string in the editor UI can be overridden at runtime via the `languages` prop — no native rebuild required.

## Basic usage

Pass a partial `ImageEditorLanguage` object. Only the keys you provide are replaced; the rest fall back to English.

```typescript
import { ImageEditor } from '@phucprime/react-native-image-editor';

ImageEditor.open({
  path: imagePath,
  languages: {
    doneTitle: 'Finish',
    saveTitle: 'Save to Gallery',
    clearAllTitle: 'Remove All',
    eraserTitle: 'Eraser',
  },
  onDone: (path) => {},
  onCancel: () => {},
});
```

## All overridable strings

| Key | Default (English) | Description |
|---|---|---|
| `doneTitle` | `Done` | Main toolbar button — saves the edit in place |
| `saveTitle` | `Save` | Save-to-gallery button (Android only) |
| `clearAllTitle` | `Clear all` | Removes all drawing/text/sticker layers |
| `cameraTitle` | `Camera` | Camera option label in sticker image picker |
| `galleryTitle` | `Gallery` | Gallery option label in sticker image picker |
| `uploadDialogTitle` | `Upload Image` | Title of the sticker-source dialog |
| `uploadPickerTitle` | `Select Picture` | Title of the sticker source picker sheet |
| `directoryCreateFail` | `Failed to create directory` | Error message when storage dir creation fails |
| `accessMediaPermissionsMsg` | `To attach photos, we need to access media on your device` | Permission rationale dialog body |
| `continueTxt` | `Continue` | Permission rationale — confirm button label |
| `notNow` | `NOT NOW` | Permission rationale — dismiss button label |
| `mediaAccessDeniedMsg` | `You denied storage access, no photos will be added.` | Toast shown when media access is denied |
| `saveImageSucceed` | `Image saved` | Toast shown after successful save to gallery |
| `eraserTitle` | `Eraser` | Eraser tool button label |

## Full example — Vietnamese

```typescript
import type { ImageEditorLanguage } from '@phucprime/react-native-image-editor';

const VI: ImageEditorLanguage = {
  doneTitle: 'Xong',
  saveTitle: 'Lưu',
  clearAllTitle: 'Xoá tất cả',
  cameraTitle: 'Máy ảnh',
  galleryTitle: 'Thư viện',
  uploadDialogTitle: 'Tải ảnh lên',
  uploadPickerTitle: 'Chọn ảnh',
  directoryCreateFail: 'Không thể tạo thư mục',
  accessMediaPermissionsMsg: 'Chúng tôi cần quyền truy cập ảnh để đính kèm',
  continueTxt: 'Tiếp tục',
  notNow: 'KHÔNG PHẢI LÚC NÀY',
  mediaAccessDeniedMsg: 'Bạn đã từ chối quyền truy cập, không thể thêm ảnh.',
  saveImageSucceed: 'Đã lưu ảnh',
  eraserTitle: 'Tẩy',
};

ImageEditor.open({
  path: imagePath,
  languages: VI,
  onDone: (path) => {},
  onCancel: () => {},
});
```

## Using with i18next / react-i18next

```typescript
import { useTranslation } from 'react-i18next';
import type { ImageEditorLanguage } from '@phucprime/react-native-image-editor';

function useEditorLanguages(): ImageEditorLanguage {
  const { t } = useTranslation('editor');
  return {
    doneTitle:     t('done'),
    saveTitle:     t('save'),
    clearAllTitle: t('clearAll'),
    eraserTitle:   t('eraser'),
    // ... other keys
  };
}

// In your component:
const languages = useEditorLanguages();
ImageEditor.open({ path, languages, onDone, onCancel });
```

## iOS note

Language support on iOS is partially available. The `languages` prop is accepted and forwarded to the native layer. The `TranslationService` wiring in `iOSPhotoEditor` is planned for a future release; until then, the iOS editor displays English UI regardless of `languages`.

Android supports all keys fully through `TranslationService`.
