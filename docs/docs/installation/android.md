---
id: android
title: Android Installation
sidebar_label: Android
---

# Android Installation

## Requirements

- Android API **24** (Android 7.0) minimum
- **JDK 17**
- **Gradle 8.x**
- JitPack in your repository list

## 1 — Add JitPack repository

The library depends on [`UCrop`](https://github.com/yalantis/uCrop) which is hosted on JitPack. Add JitPack to your root `android/build.gradle`:

```groovy title="android/build.gradle"
allprojects {
    repositories {
        google()
        mavenCentral()
        // highlight-next-line
        maven { url "https://jitpack.io" }
    }
}
```

:::note Gradle 7+ settings-based repo config
If your project uses `dependencyResolutionManagement` in `android/settings.gradle` instead of `allprojects`, add JitPack there:

```groovy title="android/settings.gradle"
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // highlight-next-line
        maven { url "https://jitpack.io" }
    }
}
```
:::

## 2 — Declare editor activities

The editor opens a full-screen `Activity`. Declare both activities in your app's `AndroidManifest.xml`:

```xml title="android/app/src/main/AndroidManifest.xml"
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <application ...>

    <!-- highlight-start -->
    <!-- Photo editor activity -->
    <activity
      android:name="com.ahmedadeltito.photoeditor.PhotoEditorActivity"
      android:screenOrientation="portrait"
      android:theme="@style/Theme.AppCompat.Light.NoActionBar" />

    <!-- Crop activity (UCrop) -->
    <activity
      android:name="com.yalantis.ucrop.UCropActivity"
      android:screenOrientation="portrait"
      android:theme="@style/Theme.AppCompat.Light.NoActionBar" />
    <!-- highlight-end -->

  </application>
</manifest>
```

:::caution Missing activity declarations = crash on launch
If either activity is missing from the manifest, Android will throw an `ActivityNotFoundException` as soon as the editor tries to open.
:::

## 3 — JDK 17

The library's Android module is compiled with `sourceCompatibility JavaVersion.VERSION_17`. Make sure your Android Gradle build is using JDK 17.

Check your current JDK version:

```bash
java -version
```

If you're using Android Studio, set the Gradle JDK to 17 in **File → Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**.

## 4 — Verify

Run on a connected device or emulator:

```bash
npx react-native run-android
```

If you see a `NoClassDefFoundError` crash on the first button tap, see [Troubleshooting → Android](../troubleshooting).

## SDK version overrides

The library reads SDK versions from your root project's `ext` block with sensible fallbacks. You can override any of them:

```groovy title="android/build.gradle"
ext {
    compileSdkVersion = 35
    buildToolsVersion = "35.0.0"
    minSdkVersion     = 24
    targetSdkVersion  = 35
}
```

## Dependencies pulled in

These are resolved automatically and do not need to be added manually:

| Dependency | Version | Purpose |
|---|---|---|
| `com.facebook.react:react-native` | `+` | React Native bridge |
| `com.google.android.material:material` | `1.9.0` | Material UI components |
| `androidx.appcompat:appcompat` | `1.6.1` | AppCompat base |
| `androidx.constraintlayout:constraintlayout` | `2.1.4` | Layout |
| `com.github.yalantis:ucrop` | `2.2.2-native` | Crop UI (from JitPack) |
| `androidx.exifinterface:exifinterface` | `1.3.7` | EXIF orientation handling |
| `fr.avianey.com.viewpagerindicator:library` | `2.4.1` | Sticker/emoji tab indicator |
