package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log  // Import for using Log
import com.facebook.react.bridge.*
import java.io.FileOutputStream
import java.io.IOException

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
                    startNewFileWithHeader()
                } else {
                    promise.reject("ERROR", "Failed to choose location or operation was cancelled.")
                }
            }
        })
    }

    private fun startNewFileWithHeader() {
        try {
            uri?.let {
                outputStream = reactApplicationContext.contentResolver.openOutputStream(it) as FileOutputStream
                outputStream?.write("time_stamp,ID,random_number\n".toByteArray())
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun startRecording() {
        try {
            if (outputStream == null) {
                uri?.let {
                    outputStream = reactApplicationContext.contentResolver.openOutputStream(it) as FileOutputStream
                    outputStream?.write("time_stamp,ID,random_number\n".toByteArray())
                }
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun writeData(timeStamp: String, id: Int, randomNumber: Int) {
        Log.d("FileSaveModule", "Writing data: $timeStamp,$id,$randomNumber")  // Log the data being written
        try {
            outputStream?.write("$timeStamp,$id,$randomNumber\n".toByteArray())
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun stopRecording() {
        try {
            outputStream?.close()
            outputStream = null // Ensure we can restart cleanly
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
}
