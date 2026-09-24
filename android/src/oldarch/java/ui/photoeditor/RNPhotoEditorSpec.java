package ui.photoeditor;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;

/**
 * Old Architecture compatibility spec.
 *
 * On Old Architecture (classic bridge), there is no codegen-generated base
 * class, so we hand-write the abstract contract here.
 *
 * The method signature mirrors the New Architecture codegen output exactly:
 *   {@code edit(ReadableMap props, Promise promise)}
 *
 * This means {@link ui.photoeditor.RNPhotoEditorModule} compiles and behaves
 * identically regardless of which source set ({@code newarch} / {@code oldarch})
 * is active.
 */
abstract class RNPhotoEditorSpec extends ReactContextBaseJavaModule {

    RNPhotoEditorSpec(ReactApplicationContext context) {
        super(context);
    }

    /**
     * Open the photo editor.
     *
     * @param props   Editor configuration map (path, colors, stickers, …).
     * @param promise Resolved with the saved image path on success; rejected
     *                with code {@code "CANCELLED"} when the user dismisses.
     */
    public abstract void edit(@NonNull ReadableMap props, @NonNull Promise promise);
}
