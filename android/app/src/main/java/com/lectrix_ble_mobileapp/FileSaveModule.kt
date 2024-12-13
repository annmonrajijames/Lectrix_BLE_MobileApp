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
                val header = "time_stamp,CellVoltage01,CellVoltage02,CellVoltage03,CellVoltage04,CellVoltage05,CellVoltage06,CellVoltage07,CellVoltage08,CellVoltage09,CellVoltage10,CellVoltage11,CellVoltage12,CellVoltage13,CellVoltage14,CellVoltage15,CellVoltage16,CellVoltage17,CellVoltage18,CellVoltage19,CellVoltage20,CellVoltage21,CellVoltage22,CellVoltage23,CellVoltage24,CellVoltage25,CellVoltage26,CellVoltage27,CellVoltage28,CellVoltage29,CellVoltage30,CellVoltage31,CellVoltage32,CellVoltage33,CellVoltage34,CellVoltage35,CellVoltage36,CellVoltage37,CellVoltage38,CellVoltage39,CellVoltage40,CellVoltage41,CellVoltage42,CellVoltage43,CellVoltage44,CellVoltage45,CellVoltage46,CellVoltage47,CellVoltage48,CellVoltage49,CellVoltage50,CellVoltage51,CellVoltage52,CellVoltage53,CellVoltage54,CellVoltage55,CellVoltage56,CellVoltage57,CellVoltage58,CellVoltage59,CellVoltage60,CellVoltage61,CellVoltage62,CellVoltage63,CellVoltage64,CellVoltage65,CellVoltage66,CellVoltage67,CellVoltage68,CellVoltage69,CellVoltage70,CellVoltage71,CellVoltage72,CellVoltage73,CellVoltage74,CellVoltage75,CellVoltage76,CellVoltage77,CellVoltage78,CellVoltage79,CellVoltage80,CellVoltage81,CellVoltage82,CellVoltage83,CellVoltage84,CellVoltage85,CellVoltage86,CellVoltage87,CellVoltage88,CellVoltage89,CellVoltage90,CellVoltage91,CellVoltage92,CellVoltage93,CellVoltage94,CellVoltage95,CellVoltage96,CellVoltage97,CellVoltage98,CellVoltage99,CellVoltage100,CellVoltage101,CellVoltage102,CellVoltage103,CellVoltage104,CellVoltage105,CellVoltage106,CellVoltage107,CellVoltage108,CellVoltage109,CellVoltage110,CellVoltage111,CellVoltage112,CellVoltage113,CellVoltage114,CellVoltage115,CellVoltage116,CellVoltage117,CellVoltage118,CellVoltage119,CellVoltage120,CellVoltage121,CellVoltage122,CellVoltage123,CellVoltage124,CellVoltage125,CellVoltage126,CellVoltage127,CellVoltage128,CellVoltage129,CellVoltage130,CellVoltage131,CellVoltage132,CellVoltage133,CellVoltage134,CellVoltage135,CellVoltage136,CellVoltage137,CellVoltage138,CellVoltage139,CellVoltage140,CellVoltage141,CellVoltage142,CellVoltage143,CellVoltage144,CellVoltage145,CellVoltage146,CellVoltage147,CellVoltage148,CellVoltage149,CellVoltage150,CellVoltage151,CellVoltage152,CellVoltage153,CellVoltage154,CellVoltage155,CellVoltage156,CellVoltage157,CellVoltage158,CellVoltage159,CellVoltage160,CellVoltage161,CellVoltage162,CellVoltage163,CellVoltage164,CellVoltage165,CellVoltage166,CellVoltage167,CellVoltage168,CellVoltage169,CellVoltage170,CellVoltage171,CellVoltage172,CellVoltage173,CellVoltage174,CellVoltage175,CellVoltage176,CellVoltage177,CellVoltage178,CellVoltage179,CellVoltage180,CellVoltage181,CellVoltage182,CellVoltage183,CellVoltage184,CellVoltage185,CellVoltage186,CellVoltage187,CellVoltage188,CellVoltage189,CellVoltage190,CellVoltage191,CellVoltage192,CellVoltage193,CellVoltage194\n"
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
