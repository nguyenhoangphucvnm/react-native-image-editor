---
id: ios
title: iOS Installation
sidebar_label: iOS
---

# iOS Installation

## Requirements

- iOS **13.0** minimum deployment target
- Xcode **15+**
- CocoaPods

## 1 — Add the pod source

The library depends on the `iOSPhotoEditor` pod hosted on GitHub. Add it to your `Podfile` **before** running `pod install`:

```ruby title="ios/Podfile"
# Required — expose Swift symbols to Objective-C consumers
use_frameworks! :linkage => :static

# iOSPhotoEditor SDK (photo editor UI)
pod "iOSPhotoEditor",
    :git => "https://github.com/phucprime/photo-editor",
    :branch => "master"
```

:::caution `use_frameworks! :linkage => :static` is required
The `iOSPhotoEditor` pod is a Swift framework. Without `use_frameworks! :linkage => :static` the Swift types cannot be exposed to Objective-C consumers and the build will fail.
:::

## 2 — Install pods

```bash
cd ios && pod install
```

## 3 — Add Privacy Usage Descriptions

The editor can save images to the photo library. iOS requires explicit usage descriptions in `Info.plist`:

```xml title="ios/YourApp/Info.plist"
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Allow access to save edited photos to your library</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Allow access to select photos for editing</string>
```

:::note
If these keys are missing iOS will crash with `SIGABRT` the first time the user taps **Save** or tries to pick a photo from the gallery inside the editor.
:::

## 4 — New Architecture (`post_install` hook)

If your project uses the **New Architecture** (`newArchEnabled=true`), add the following to your `Podfile`'s `post_install` block. It ensures the `react-native-image-editor` pod target is compiled with C++17, which is required for TurboModule / JSI headers:

```ruby title="ios/Podfile"
post_install do |installer|
  # ... your existing post_install content ...

  installer.pods_project.targets.each do |target|
    if target.name == "react-native-image-editor"
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] =
          '$(inherited) -DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1'
      end
    end
  end

  react_native_post_install(
    installer,
    config[:reactNativePath],
    :mac_catalyst_enabled => false,
  )
end
```

## Verifying the setup

Build and run on a simulator:

```bash
npx react-native run-ios
```

If the build fails with errors like `'utility' file not found` or `'vector' file not found`, see [Troubleshooting → iOS](../troubleshooting).

## Complete Podfile example

```ruby title="ios/Podfile"
require Pod::Executable.execute_command("node", ["-p",
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, min_ios_version_supported
prepare_react_native_project!

use_frameworks! :linkage => :static

target "YourApp" do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/..",
  )

  pod "iOSPhotoEditor",
      :git => "https://github.com/phucprime/photo-editor",
      :branch => "master"

  post_install do |installer|
    installer.pods_project.targets.each do |target|
      if target.name == "react-native-image-editor"
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
          config.build_settings['OTHER_CPLUSPLUSFLAGS'] =
            '$(inherited) -DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1'
        end
      end
    end
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
    )
  end
end
```
