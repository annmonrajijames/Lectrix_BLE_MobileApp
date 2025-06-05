package com.lectrix_ble_mobileapp

import android.content.Intent
import com.facebook.react.bridge.*

class ActivityStarterModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ActivityStarter"

    /**
     * Exposed to JS as ActivityStarter.navigateToReceiveActivity({ address: string })
     */
    @ReactMethod
    fun navigateToReceiveActivity(options: ReadableMap) {
        val address = options.getString("address")
        if (address == null) {
            // invalid call from JS
            return
        }
        // Grab the current Activity
        val activity = currentActivity ?: return

        // Create intent for your Compose Activity (or rename here if your class is named differently)
        val intent = Intent(activity, ReceiveActivity::class.java).apply {
            putExtra(ReceiveActivity.DEVICE_ADDRESS, address)
        }
        activity.startActivity(intent)
    }
}
