package ui.photoeditor;

import androidx.annotation.NonNull;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * ReactPackage registration for RNPhotoEditor.
 *
 * Extends {@link TurboReactPackage} instead of the old {@link com.facebook.react.ReactPackage}.
 *
 * Why TurboReactPackage?
 * ──────────────────────
 * On New Architecture, React Native discovers TurboModules through the
 * {@link TurboReactPackage#getModule} / {@link TurboReactPackage#getReactModuleInfoProvider}
 * contract. A plain {@code ReactPackage} that only overrides
 * {@code createNativeModules()} is never consulted by the TurboModule registry,
 * so {@code TurboModuleRegistry.getEnforcing("RNPhotoEditor")} would throw
 * "No TurboModule found for RNPhotoEditor" at runtime on New Arch.
 *
 * On Old Architecture, {@link TurboReactPackage} delegates back to
 * {@code getModule()} so no separate code path is needed.
 */
public class RNPhotoEditorPackage extends TurboReactPackage {

    @Override
    public NativeModule getModule(
            @NonNull String name,
            @NonNull ReactApplicationContext reactContext) {
        if (RNPhotoEditorModule.NAME.equals(name)) {
            return new RNPhotoEditorModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(
                RNPhotoEditorModule.NAME,
                new ReactModuleInfo(
                    RNPhotoEditorModule.NAME,   // name
                    RNPhotoEditorModule.NAME,   // className (used for logging)
                    false,   // canOverrideExistingModule
                    false,   // needsEagerInit
                    false,   // isCxxModule
                    true     // isTurboModule — registers with the JSI TurboModule registry
                )
            );
            return map;
        };
    }
}
