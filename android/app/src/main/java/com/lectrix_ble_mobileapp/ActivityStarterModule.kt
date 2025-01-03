package com.lectrix_ble_mobileapp

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class ActivityStarterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "ActivityStarter"

    @ReactMethod
    fun navigateToReceiveActivity(deviceInfo: ReadableMap) {
        val intent = Intent(reactApplicationContext, ReceiveActivity::class.java).apply {
            putExtra(ReceiveActivity.DEVICE_ADDRESS, deviceInfo.getString("address"))
        }
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }
}
