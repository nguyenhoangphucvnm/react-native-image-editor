---
id: hidden-controls
title: Hidden Controls
sidebar_label: Hidden Controls
---

# Hidden Controls

The `hiddenControls` prop lets you remove specific tools from the editor toolbar. Pass an array of control names to hide; any control not in the array remains visible.

```typescript
ImageEditor.open({
  path: imagePath,
  hiddenControls: ['share', 'clear'],
  onDone: (path) => {},
  onCancel: () => {},
});
```

## Available controls

| Value | Description | Platform |
|---|---|---|
| `'crop'` | Crop tool — opens UCrop (Android) or native crop (iOS) | iOS + Android |
| `'draw'` | Freehand brush drawing tool | iOS + Android |
| `'text'` | Text overlay tool | iOS + Android |
| `'sticker'` | Sticker picker panel | iOS + Android |
| `'clear'` | Clear all — removes all drawing, text, and sticker layers | iOS + Android |
| `'save'` | Save to gallery button (saves a new file to `Pictures/`) | Android only |
| `'share'` | Native share sheet button | iOS + Android |

## Common recipes

### Drawing-only mode

Show only the brush tool; hide everything else:

```typescript
hiddenControls: ['crop', 'text', 'sticker', 'save', 'share', 'clear']
```

### Crop-only mode

```typescript
hiddenControls: ['draw', 'text', 'sticker', 'save', 'share', 'clear']
```

### Hide destructive/sharing actions

Keep all editing tools but remove save-to-gallery and share:

```typescript
hiddenControls: ['save', 'share']
```

### Minimal editor (crop + draw only)

```typescript
hiddenControls: ['text', 'sticker', 'save', 'share']
```

## Hide all

Passing every control name results in a toolbar with only the **Done** button visible:

```typescript
hiddenControls: ['crop', 'draw', 'text', 'sticker', 'clear', 'save', 'share']
```

## TypeScript type

```typescript
type EditorControl =
  | 'text'
  | 'clear'
  | 'draw'
  | 'save'
  | 'share'
  | 'sticker'
  | 'crop';
```

The `hiddenControls` field accepts `EditorControl[]`.

## Notes

- Control names are **case-insensitive** on Android (matched with `.toLowerCase()`). On iOS they are matched with `.lowercased()`. Use lowercase to be safe across both platforms.
- The **Done** button cannot be hidden.
- The `'save'` control (save to gallery) only exists in the Android toolbar. Passing it on iOS has no effect.
