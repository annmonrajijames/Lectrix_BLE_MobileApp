package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log
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
                // Create a header for just time_stamp and CellVoltage01 for now
                val header = "LocalTime,CellVol01,PackCurr,SOC,IgnitionStatus\n"
                outputStream?.write(header.toByteArray())
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }    

    @ReactMethod
    fun startRecording() {
        if (outputStream == null && uri != null) {
            startNewFileWithHeader()
        }
    }

    @ReactMethod
    fun writeData(data: String) {
        Log.d("FileSaveModule", "Attempting to write data: $data")
        try {
            outputStream?.let {
                it.write((data + "\n").toByteArray())
                it.flush()  // Ensure data is written to the file immediately
                Log.d("FileSaveModule", "Data written successfully")
            } ?: Log.e("FileSaveModule", "OutputStream not initialized")
        } catch (e: IOException) {
            Log.e("FileSaveModule", "Error writing data", e)
        }
    }    

    @ReactMethod
    fun stopRecording() {
        try {
            outputStream?.close()
            outputStream = null
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun shareFile(fileUriString: String, promise: Promise) {
        try {
            val fileUri = Uri.parse(fileUriString)
            val shareIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_STREAM, fileUri)
                type = "text/csv"
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val chooserIntent = Intent.createChooser(shareIntent, "Share CSV File")
            chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(chooserIntent)
            promise.resolve("File shared successfully")
        } catch (e: Exception) {
            promise.reject("ERROR_SHARING_FILE", "Failed to share file", e)
        }
    }

    @ReactMethod
    fun viewFile(fileUriString: String, promise: Promise) {
        try {
            val fileUri = Uri.parse(fileUriString)
            val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(fileUri, "text/csv")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val chooserIntent = Intent.createChooser(viewIntent, "Open With")
            chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(chooserIntent)
            promise.resolve("File opened successfully")
        } catch (e: Exception) {
            promise.reject("ERROR_OPENING_FILE", "Failed to open file", e)
        }
    }
}
