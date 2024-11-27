package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import java.io.IOException

class FileSaveModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        const val CREATE_FILE_REQUEST_CODE = 1
    }

    override fun getName(): String {
        return "FileSaveModule"
    }

    @ReactMethod
    fun saveFile(content: String, promise: Promise) {
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/csv"
            putExtra(Intent.EXTRA_TITLE, "sample.csv")
        }

        val activity = currentActivity
        if (activity != null) {
            activity.startActivityForResult(intent, CREATE_FILE_REQUEST_CODE)
            reactApplicationContext.addActivityEventListener(object : BaseActivityEventListener() {
                override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
                    if (requestCode == CREATE_FILE_REQUEST_CODE && resultCode == Activity.RESULT_OK && data != null) {
                        val uri = data.data
                        try {
                            uri?.let {
                                reactApplicationContext.contentResolver.openOutputStream(it).use { outputStream ->
                                    if (outputStream != null) {
                                        outputStream.write(content.toByteArray())
                                        promise.resolve("File saved successfully to: ${uri.path}")
                                    } else {
                                        promise.reject("ERROR_WRITING_FILE", "Failed to open output stream.")
                                    }
                                }
                            }
                        } catch (e: IOException) {
                            promise.reject("ERROR_SAVING_FILE", "Failed to save file", e)
                        }
                    }
                }
            })
        } else {
            promise.reject("ERROR_NO_ACTIVITY", "Activity doesn't exist")
        }
    }
}
