package ui.photoeditor;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ahmedadeltito.photoeditor.PhotoEditorActivity;
import com.ahmedadeltito.photoeditor.TranslationService;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;

/**
 * Native module that opens a full-screen photo editor Activity and returns the
 * saved image path (or a cancellation rejection) via a {@link Promise}.
 *
 * Promise vs Callback
 * ───────────────────
 * The previous implementation stored two {@code Callback} instances as instance
 * fields and invoked them from {@code onActivityResult}. On New Architecture,
 * {@code Callback} objects are backed by {@code CallbackHolder} references tied
 * to the JS context. If the JS context reloads (Fast Refresh, error recovery)
 * while the editor Activity is open, those stored callbacks become dangling
 * references — invoking them is either a no-op or a crash.
 *
 * {@link Promise} has the same lifetime guarantee but is explicitly designed for
 * single-shot async operations that span multiple native frames/events. It is
 * also the only pattern fully validated by the New Architecture codegen.
 *
 * Thread safety
 * ─────────────
 * {@code mPendingPromise} is written on the JS thread (inside {@code edit()})
 * and read/nulled on the UI thread (inside {@code onActivityResult}). Both
 * accesses are guarded by synchronisation on {@code this}, and the field is
 * marked {@code volatile} so the write is immediately visible across threads.
 */
public class RNPhotoEditorModule extends RNPhotoEditorSpec {

    /** Module name as registered in JS — must match TurboModuleRegistry.getEnforcing('RNPhotoEditor'). */
    public static final String NAME = "RNPhotoEditor";

    /** startActivityForResult request code — arbitrary, just needs to be unique per Activity. */
    private static final int PHOTO_EDITOR_REQUEST = 1;

    /** Error code returned when the user cancels the editor. */
    private static final String E_CANCELLED = "CANCELLED";

    /** The in-flight Promise. Volatile for cross-thread visibility; guarded by synchronized(this). */
    private volatile @Nullable Promise mPendingPromise;

    // ─── Activity result listener ─────────────────────────────────────────────

    private final ActivityEventListener mActivityEventListener =
            new BaseActivityEventListener() {
                @Override
                public void onActivityResult(
                        Activity activity,
                        int requestCode,
                        int resultCode,
                        @Nullable Intent intent) {

                    if (requestCode != PHOTO_EDITOR_REQUEST) return;

                    Promise promise;
                    synchronized (RNPhotoEditorModule.this) {
                        promise = mPendingPromise;
                        mPendingPromise = null;
                    }

                    if (promise == null) return; // JS context already gone — nothing to do

                    if (resultCode == Activity.RESULT_CANCELED) {
                        promise.reject(E_CANCELLED, "User cancelled the editor");
                        return;
                    }

                    // RESULT_OK — extract the saved path from the result Intent
                    if (intent == null || intent.getExtras() == null) {
                        promise.reject("NO_RESULT", "Editor returned no data");
                        return;
                    }

                    String imagePath = intent.getExtras().getString("imagePath");
                    if (imagePath == null) {
                        promise.reject("NO_PATH", "Editor returned null image path");
                        return;
                    }

                    promise.resolve(imagePath);
                }
            };

    // ─── Constructor ──────────────────────────────────────────────────────────

    public RNPhotoEditorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    // ─── TurboModule contract ─────────────────────────────────────────────────

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // ─── @ReactMethod ─────────────────────────────────────────────────────────

    /**
     * Open the photo editor.
     *
     * Codegen maps this to the {@code edit(props: UnsafeObject): Promise<string>}
     * spec defined in {@code NativeRNPhotoEditor.ts}.
     *
     * @param props   Editor configuration (path, colors, stickers, hiddenControls, languages).
     * @param promise Resolved with the saved image path; rejected with code
     *                {@value E_CANCELLED} when the user dismisses.
     */
    @ReactMethod
    public void edit(@NonNull ReadableMap props, @NonNull Promise promise) {

        // ── Guard: reject immediately if there is already an editor open ──────
        synchronized (this) {
            if (mPendingPromise != null) {
                promise.reject("ALREADY_OPEN", "An editor session is already in progress");
                return;
            }
            mPendingPromise = promise;
        }

        // ── Guard: need a live Activity to start the editor ───────────────────
        Activity activity = getCurrentActivity();
        if (activity == null) {
            synchronized (this) { mPendingPromise = null; }
            promise.reject("NO_ACTIVITY", "No active Android Activity found");
            return;
        }

        // ── Translations ──────────────────────────────────────────────────────
        ReadableMap languages = props.getMap("languages");
        if (languages != null) {
            TranslationService.getInstance().init(languages.toHashMap());
        }

        // ── Stickers: string names → drawable resource IDs ────────────────────
        ReadableArray stickersArr = props.getArray("stickers");
        ArrayList<Integer> stickersIntent = new ArrayList<>();
        if (stickersArr != null) {
            for (int i = 0; i < stickersArr.size(); i++) {
                int id = getReactApplicationContext()
                        .getResources()
                        .getIdentifier(
                                stickersArr.getString(i),
                                "drawable",
                                getReactApplicationContext().getPackageName());
                stickersIntent.add(id);
            }
        }

        // ── Hidden controls ───────────────────────────────────────────────────
        ReadableArray hiddenArr = props.getArray("hiddenControls");
        ArrayList<String> hiddenControlsIntent = new ArrayList<>();
        if (hiddenArr != null) {
            for (int i = 0; i < hiddenArr.size(); i++) {
                hiddenControlsIntent.add(hiddenArr.getString(i));
            }
        }

        // ── Colors: hex strings → android.graphics.Color ints ────────────────
        ReadableArray colorsArr = props.getArray("colors");
        ArrayList<Integer> colorPickerColors = new ArrayList<>();
        if (colorsArr != null) {
            for (int i = 0; i < colorsArr.size(); i++) {
                try {
                    colorPickerColors.add(Color.parseColor(colorsArr.getString(i)));
                } catch (IllegalArgumentException ignored) {
                    // Skip invalid color strings rather than crashing
                }
            }
        }

        // ── Launch editor Activity ─────────────────────────────────────────────
        Intent intent = new Intent(activity, PhotoEditorActivity.class);
        intent.putExtra("selectedImagePath", props.getString("path"));
        intent.putExtra("colorPickerColors", colorPickerColors);
        intent.putExtra("hiddenControls", hiddenControlsIntent);
        intent.putExtra("stickers", stickersIntent);

        activity.startActivityForResult(intent, PHOTO_EDITOR_REQUEST);
    }
}
