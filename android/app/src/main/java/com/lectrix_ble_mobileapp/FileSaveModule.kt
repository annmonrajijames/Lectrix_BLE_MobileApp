package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.*
import java.io.FileOutputStream
import java.io.IOException
import java.util.*

class FileSaveModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var outputStream: FileOutputStream? = null
    private var uri: Uri? = null

    companion object {
        const val CREATE_FILE_REQUEST_CODE = 1
    }

    override fun getName(): String {
        return "FileSaveModule"
    }

    @ReactMethod
    fun chooseLocation(promise: Promise) {
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/csv"
            putExtra(Intent.EXTRA_TITLE, "data.csv")
        }

        val activity = currentActivity
        activity?.startActivityForResult(intent, CREATE_FILE_REQUEST_CODE, null)
        reactApplicationContext.addActivityEventListener(object : BaseActivityEventListener() {
            override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
                if (requestCode == CREATE_FILE_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
                    uri = data?.data
                    promise.resolve(uri.toString())
                } else {
                    promise.reject("ERROR", "Failed to choose location or operation was cancelled.")
                }
            }
        })
    }

    @ReactMethod
    fun startRecording() {
        try {
            uri?.let {
                outputStream = reactApplicationContext.contentResolver.openOutputStream(it) as FileOutputStream
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun writeData(id: Int, randomNumber: Int) {
        try {
            outputStream?.write("$id, $randomNumber\n".toByteArray())
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun stopRecording() {
        try {
            outputStream?.close()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
}
