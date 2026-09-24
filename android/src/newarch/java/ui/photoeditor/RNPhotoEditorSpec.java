package ui.photoeditor;

import com.facebook.react.bridge.ReactApplicationContext;

/**
 * New Architecture spec wrapper.
 *
 * On New Architecture, the React Native codegen generates
 * {@code NativeRNPhotoEditorSpec} from {@code src/NativeRNPhotoEditor.ts}.
 * That generated class already extends {@code ReactContextBaseJavaModule} and
 * declares the abstract {@code edit(ReadableMap props, Promise promise)} method.
 *
 * This thin wrapper simply inherits from the generated spec so that
 * {@link ui.photoeditor.RNPhotoEditorModule} can extend a single
 * {@code RNPhotoEditorSpec} type regardless of architecture, keeping
 * {@code RNPhotoEditorModule.java} in the shared {@code main} source set.
 */
abstract class RNPhotoEditorSpec extends NativeRNPhotoEditorSpec {
    RNPhotoEditorSpec(ReactApplicationContext context) {
        super(context);
    }
}
