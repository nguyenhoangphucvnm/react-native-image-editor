import NativeRNPhotoEditor from './NativeRNPhotoEditor';

/**
 * Localization strings for the image editor UI.
 * All fields are optional — unset keys fall back to the English defaults.
 */
export interface ImageEditorLanguage {
  /** Title for the "Done" button */
  doneTitle?: string;
  /** Title for the "Save" button */
  saveTitle?: string;
  /** Title for the "Clear All" button */
  clearAllTitle?: string;
  /** Title for the "Camera" option */
  cameraTitle?: string;
  /** Title for the "Gallery" option */
  galleryTitle?: string;
  /** Title for the upload dialog */
  uploadDialogTitle?: string;
  /** Title for the upload picker */
  uploadPickerTitle?: string;
  /** Message shown when directory creation fails */
  directoryCreateFail?: string;
  /** Message requesting media access permissions */
  accessMediaPermissionsMsg?: string;
  /** Label for the "Continue" button */
  continueTxt?: string;
  /** Label for the "Not Now" button */
  notNow?: string;
  /** Message shown when media access is denied */
  mediaAccessDeniedMsg?: string;
  /** Message shown when image save succeeds */
  saveImageSucceed?: string;
  /** Title for the "Eraser" tool */
  eraserTitle?: string;
}

/**
 * Editor control identifiers that can be hidden via `hiddenControls`.
 */
export type EditorControl =
  | 'text'
  | 'clear'
  | 'draw'
  | 'save'
  | 'share'
  | 'sticker'
  | 'crop';

/**
 * Configuration options for the image editor.
 */
export interface ImageEditorConfig {
  /**
   * Local file path (or file:// URI) of the image to edit.
   * The editor overwrites this file when the user taps Done.
   */
  path: string;

  /**
   * Hex color strings for the drawing and text colour picker.
   * Accepts #RGB, #RRGGBB, and #AARRGGBB formats.
   * @default DEFAULT_COLORS (13-colour palette)
   */
  colors?: string[];

  /**
   * Sticker image names from native resources.
   * iOS: main bundle image names. Android: res/drawable/ file names (no extension).
   * @default []
   */
  stickers?: string[];

  /**
   * Controls to remove from the editor toolbar.
   * @default []
   */
  hiddenControls?: EditorControl[];

  /**
   * Localization overrides for editor UI strings.
   * Unset keys fall back to English defaults.
   */
  languages?: ImageEditorLanguage;

  /**
   * Called when the user saves the edited image.
   * `imagePath` is the local path to the overwritten file.
   * Only used by `ImageEditor.open()` — ignored by `ImageEditor.edit()`.
   */
  onDone?: (imagePath: string) => void;

  /**
   * Called when the user dismisses without saving.
   * Only used by `ImageEditor.open()` — ignored by `ImageEditor.edit()`.
   */
  onCancel?: () => void;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

/** Built-in 13-colour drawing palette. */
const DEFAULT_COLORS: string[] = [
  '#000000',
  '#808080',
  '#a9a9a9',
  '#FFFFFE',
  '#0000ff',
  '#00ff00',
  '#ff0000',
  '#ffff00',
  '#ffa500',
  '#800080',
  '#00ffff',
  '#a52a2a',
  '#ff00ff',
];

/** Built-in English UI strings. */
const DEFAULT_LANGUAGES: Required<ImageEditorLanguage> = {
  doneTitle: 'Done',
  saveTitle: 'Save',
  clearAllTitle: 'Clear all',
  cameraTitle: 'Camera',
  galleryTitle: 'Gallery',
  uploadDialogTitle: 'Upload Image',
  uploadPickerTitle: 'Select Picture',
  directoryCreateFail: 'Failed to create directory',
  accessMediaPermissionsMsg:
    'To attach photos, we need to access media on your device',
  continueTxt: 'Continue',
  notNow: 'NOT NOW',
  mediaAccessDeniedMsg: 'You denied storage access, no photos will be added.',
  saveImageSucceed: 'Image saved',
  eraserTitle: 'Eraser',
};

// ─── Core native call ─────────────────────────────────────────────────────────

/**
 * Build the props object and call the native TurboModule.
 *
 * The native module exposes a single `edit(props): Promise<string>` method.
 * This is the only point in the codebase that touches the native boundary,
 * keeping the public API (open / edit) as thin wrappers.
 */
function callNative(config: ImageEditorConfig): Promise<string> {
  const {
    path,
    stickers = [],
    hiddenControls = [],
    colors = DEFAULT_COLORS,
    languages,
  } = config;

  const mergedLanguages: Required<ImageEditorLanguage> = languages
    ? { ...DEFAULT_LANGUAGES, ...languages }
    : DEFAULT_LANGUAGES;

  return NativeRNPhotoEditor.edit({
    path,
    colors,
    hiddenControls,
    stickers,
    languages: mergedLanguages,
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * React Native Image Editor — native photo editing for iOS and Android.
 *
 * Supports the New Architecture (Fabric + TurboModules) and the classic bridge.
 *
 * @example
 * ```ts
 * // Promise / async-await (recommended)
 * const saved = await ImageEditor.edit('/path/to/photo.jpg', {
 *   colors: ['#ff0000', '#00ff00', '#0000ff'],
 *   stickers: ['heart', 'star'],
 * });
 *
 * // Callback
 * ImageEditor.open({
 *   path: '/path/to/photo.jpg',
 *   onDone:   (path) => console.log('saved:', path),
 *   onCancel: ()     => console.log('cancelled'),
 * });
 * ```
 */
class ImageEditor {
  /**
   * Edit an image and receive the result via callbacks.
   *
   * @param config - Editor configuration including `onDone` / `onCancel`.
   */
  static open(config: ImageEditorConfig): void {
    callNative(config).then(config.onDone).catch(() => config.onCancel?.());
  }

  /**
   * Edit an image and return a Promise.
   *
   * Resolves with the saved image path.
   * Rejects with `{ code: 'CANCELLED' }` when the user dismisses.
   *
   * @param path    - Local file path of the image to edit.
   * @param options - Optional editor configuration (excludes path, onDone, onCancel).
   */
  static edit(
    path: string,
    options?: Omit<ImageEditorConfig, 'path' | 'onDone' | 'onCancel'>,
  ): Promise<string> {
    return callNative({ ...options, path });
  }

  /**
   * @deprecated Use `ImageEditor.open()` instead.
   */
  static Edit(config: ImageEditorConfig): void {
    ImageEditor.open(config);
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

/**
 * @deprecated Use `ImageEditor` instead.
 */
const PhotoEditor = ImageEditor;

export { ImageEditor, PhotoEditor };
export default ImageEditor;

/** @deprecated Use `ImageEditorConfig` instead. */
export type PhotoEditorProps = ImageEditorConfig;
/** @deprecated Use `ImageEditorLanguage` instead. */
export type Language = ImageEditorLanguage;
