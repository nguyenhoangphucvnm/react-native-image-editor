require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name        = "RNImageEditor"
  s.version     = package["version"]
  s.summary     = package["description"]
  s.description = package["description"]
  s.homepage    = package["homepage"]
  s.license     = package["license"]
  s.author      = package["author"]
  s.source      = {
    :git => "https://github.com/nguyenhoangphucvnm/react-native-image-editor.git",
    :tag => s.version
  }

  s.platforms = { :ios => "13.0" }

  s.preserve_paths = "LICENSE", "package.json"

  # Include .swift — previously missing, which meant RNPhotoEditor.swift was
  # never compiled when consumers installed this pod. The ObjC bridge (.mm)
  # references the Swift class via RCT_EXTERN_MODULE, so both must be compiled.
  s.source_files = "**/*.{h,m,mm,swift}"

  # External photo-editor SDK (Swift framework)
  s.dependency "iOSPhotoEditor"

  # Always enforce C++17 so the pod target can include C++ standard-library
  # headers (<utility>, <vector>, <chrono>, …) pulled in transitively by
  # React Native's TurboModule / JSI headers, regardless of RN version or
  # architecture.  Without this flag the compiler treats .mm files as plain
  # Objective-C and fails with "'utility' file not found".
  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD"  => "c++17",
    "OTHER_CPLUSPLUSFLAGS"         => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
  }

  # install_modules_dependencies wires up all New Architecture (TurboModule /
  # Fabric) pod dependencies automatically on RN >= 0.71.  On older RN it falls
  # through to the else branch and adds React-Core manually.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"

    if ENV["RCT_NEW_ARCH_ENABLED"] == "1"
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end
end
