---
id: stickers
title: Stickers
sidebar_label: Stickers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Stickers

Stickers are PNG images that users can drag, scale, and position on top of the photo. You supply the image assets in your native project and pass the corresponding resource names to the editor at runtime.

## How it works

1. You add PNG files to your native project resources.
2. You pass the file name (without extension) in the `stickers` array.
3. The editor looks up each name using the platform's native resource system.
4. Images that can't be resolved are silently skipped.

```typescript
ImageEditor.open({
  path: imagePath,
  stickers: ['sticker_heart', 'sticker_star', 'sticker_fire'],
  onDone: (path) => console.log(path),
  onCancel: () => {},
});
```

---

## Adding sticker assets

<Tabs groupId="platform">
<TabItem value="ios" label="iOS">

1. In Xcode, open your project's navigator.
2. Select the target's **Resources** group (or create one).
3. Drag your `.png` files in. Make sure **"Add to target"** is checked for your app target.
4. Pass the filename **without extension** in the `stickers` array:

```typescript
stickers: ['heart', 'star'] // files: heart.png, star.png in Resources
```

:::tip Asset Catalog alternative
You can also add stickers to an `Assets.xcassets` catalog. Use the image set name (without `.imageset`) as the sticker name.
:::

</TabItem>
<TabItem value="android" label="Android">

1. Place your `.png` files in `android/app/src/main/res/drawable/`.
2. Android resource names must be **lowercase**, use only `a-z`, `0-9`, and `_`.
3. Pass the filename **without extension** in the `stickers` array:

```typescript
stickers: ['sticker_heart', 'sticker_star'] // files: sticker_heart.png, sticker_star.png
```

For density-specific assets, use the appropriate `drawable-*` subfolders (`drawable-mdpi`, `drawable-hdpi`, etc.):

```
android/app/src/main/res/
  drawable-mdpi/sticker_heart.png
  drawable-hdpi/sticker_heart.png
  drawable-xhdpi/sticker_heart.png
  drawable-xxhdpi/sticker_heart.png
```

</TabItem>
</Tabs>

---

## Example — 11 stickers from the Example app

The reference `Example/` project ships 11 stickers named `sticker0` through `sticker10`:

```typescript
ImageEditor.open({
  path: RNFS.DocumentDirectoryPath + '/photo.jpg',
  stickers: [
    'sticker0',
    'sticker1',
    'sticker2',
    'sticker3',
    'sticker4',
    'sticker5',
    'sticker6',
    'sticker7',
    'sticker8',
    'sticker9',
    'sticker10',
  ],
  onDone: (path) => console.log('done', path),
  onCancel: () => {},
});
```

---

## Hiding the sticker panel

If your app doesn't use stickers at all, pass `'sticker'` in `hiddenControls` to remove the sticker button from the toolbar:

```typescript
ImageEditor.open({
  path: imagePath,
  hiddenControls: ['sticker'],
  onDone: (path) => {},
  onCancel: () => {},
});
```

---

## Troubleshooting

**Stickers don't appear in the picker**
- Confirm the file exists in the right resource location for the platform.
- On Android, verify the filename is all lowercase and contains only valid characters.
- On iOS, confirm the file is included in the correct target ("Add to target" was checked).

**Tapping a sticker crashes on Android**
- This was a known bug prior to v1.0.3 caused by missing layout resources in the bundled `photo-editor-android.jar`. Update to v1.0.3 or later.

See [Troubleshooting](../troubleshooting) for more details.
