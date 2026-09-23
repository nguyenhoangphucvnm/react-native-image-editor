---
id: architecture
title: Architecture
sidebar_label: 🏗️ Architecture
---

# Architecture

`@phucprime/react-native-image-editor` v1.0.3 supports both the **New Architecture** (Fabric + TurboModules) and the **Old Architecture** (classic JS bridge) in the same package.

---

## New Architecture (TurboModules)

### What it is

The New Architecture replaces the asynchronous JSON bridge with a synchronous C++ JSI layer. TurboModules are loaded lazily and accessed directly from JavaScript with compile-time type safety via **codegen**.

### How this library uses it

The library ships a **codegen spec** at `src/NativeRNPhotoEditor.ts`:

```typescript
// src/NativeRNPhotoEditor.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  Edit(
    props: Object,
    onDone: (result: string) => void,
    onCancel: (result: number) => void,
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNPhotoEditor');
```

At build time, the React Native codegen reads this spec and generates:
- **Android:** `NativeRNPhotoEditorSpec.java` (abstract TurboModule class)
- **iOS:** `RNPhotoEditorSpec.h` (Objective-C protocol)

The native modules (`RNPhotoEditorModule.java` and `RNPhotoEditor.swift`) implement those generated types.

### Android — dual source sets

```
android/src/
  main/java/ui/photoeditor/RNPhotoEditorModule.java   ← shared implementation
  newarch/java/ui/photoeditor/RNPhotoEditorSpec.java  ← extends NativeRNPhotoEditorSpec (New Arch)
  oldarch/java/ui/photoeditor/RNPhotoEditorSpec.java  ← extends ReactContextBaseJavaModule (Old Arch)
```

`build.gradle` selects the right source set at build time:

```groovy
sourceSets {
  main {
    if (isNewArchitectureEnabled()) {
      java.srcDirs += ['src/newarch']
    } else {
      java.srcDirs += ['src/oldarch']
    }
  }
}
```

The `com.facebook.react` plugin (which drives codegen) is only applied when New Arch is enabled:

```groovy
if (isNewArchitectureEnabled()) {
    apply plugin: 'com.facebook.react'
}
```

### iOS — conditional protocol conformance

The Objective-C bridge file (`RNPhotoEditor.mm`) conditionally conforms to the codegen protocol:

```objc
#ifdef RCT_NEW_ARCH_ENABLED
#import <RNPhotoEditorSpec/RNPhotoEditorSpec.h>
#endif

@interface RCT_EXTERN_MODULE(RNPhotoEditor, NSObject)
  RCT_EXTERN_METHOD(Edit:(NSDictionary *)props
                    onDone:(RCTResponseSenderBlock)onDone
                    onCancel:(RCTResponseSenderBlock)onCancel)
@end

#ifdef RCT_NEW_ARCH_ENABLED
// Declare Swift class satisfies the codegen protocol
@interface RNPhotoEditor () <NativeRNPhotoEditorSpec>
@end
#endif
```

---

## Old Architecture (classic bridge)

On the classic bridge, `TurboModuleRegistry.getEnforcing` falls back to `NativeModules` lookup (React Native 0.73+ handles this automatically). No extra configuration is needed.

---

## Call flow

```
JavaScript
  │
  │  ImageEditor.open(config)           [src/index.ts]
  │   └─ merges defaults
  │   └─ RNPhotoEditor.Edit(props, onDone, onCancel)
  │
  ▼
TurboModuleRegistry / NativeModules
  │
  ├── iOS ──────────────────────────────────────────────────────
  │     RNPhotoEditor.swift  edit(_:onDone:onCancel:)
  │       ├─ loads UIImage from path
  │       ├─ maps stickers → [UIImage]
  │       ├─ maps hiddenControls → [Control]
  │       ├─ maps colors → [UIColor]
  │       └─ presents PhotoEditorViewController (fullscreen)
  │             │
  │             ├── doneEditing(image:)
  │             │     └─ writes file (PNG or JPEG 80%)
  │             │     └─ onDone([path])
  │             └── canceledEditing()
  │                   └─ onCancel([])
  │
  └── Android ──────────────────────────────────────────────────
        RNPhotoEditorModule.java  Edit(props, onDone, onCancel)
          ├─ init TranslationService
          ├─ map sticker names → drawable IDs
          ├─ map color strings → Color ints
          ├─ start PhotoEditorActivity (startActivityForResult)
          └─ ActivityEventListener.onActivityResult
                ├── RESULT_OK
                │     └─ mDoneCallback.invoke(intent.imagePath)
                └── RESULT_CANCELED
                      └─ mCancelCallback.invoke(resultCode)
```

---

## Enabling New Architecture

### Android

In `android/gradle.properties`:

```properties
newArchEnabled=true
```

### iOS

In `ios/Podfile` (React Native 0.76+, New Arch is on by default):

```ruby
# For older RN versions, set explicitly:
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

Then re-run `pod install`.

---

## Image save behavior summary

| Scenario | iOS | Android |
|---|---|---|
| User taps **Done** | Overwrites `path` (PNG or JPEG 80%) | Overwrites `path` (JPEG 80%) |
| User taps **Save** (gallery) | N/A | New file in `Pictures/PhotoEditorSDK/` |
| User taps **Cancel** / back | File unchanged, `onCancel` fires | File unchanged, `onCancel` fires |
