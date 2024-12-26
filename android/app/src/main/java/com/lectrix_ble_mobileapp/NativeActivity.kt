package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.io.OutputStreamWriter
import kotlin.random.Random
import kotlin.system.measureTimeMillis

class NativeActivity : AppCompatActivity() {
    private lateinit var infoTextView: TextView
    private var saveFileUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_native)

        infoTextView = findViewById(R.id.infoTextView)
        val decodeButton: Button = findViewById(R.id.decodeButton)
        val saveLocationButton: Button = findViewById(R.id.saveLocationButton)

        decodeButton.setOnClickListener {
            if (saveFileUri != null) {
                performDecodeOperation()
            } else {
                infoTextView.text = "Please select a location to save the file first."
            }
        }

        saveLocationButton.setOnClickListener {
            openDirectoryChooser()
        }
    }

    private fun generateRandomData(parameterIndex: Int): String {
        val randomBytes = ByteArray(19) // Generate 19 bytes to make the total 20 bytes with the "07" prefix.
        Random.nextBytes(randomBytes)
        return "07" + randomBytes.joinToString("") { String.format("%02x", it) }
    }

    private fun eightBytesDecode(data: String, firstByteCheck: String, multiplier: Double, start: Int, end: Int): Double? {
        if (data.length >= 2 * (end + 1) && data.substring(0, 2) == firstByteCheck) {
            return Integer.parseInt(data.substring(2 * start, 2 * (end + 1)), 16) * multiplier
        }
        return null
    }

    private var headersWritten = false  // Flag to track if headers have been written

    private fun performDecodeOperation() {
        val fileUri = saveFileUri ?: return run {
            infoTextView.text = "No file location selected. Please select a location to save the file first."
            return
        }
    
        val results = mutableListOf<Double?>()
        val dataGenerationTime = measureTimeMillis {
            val dataList = (1..200).map { i -> generateRandomData(i) }
            results.addAll(dataList.map { data -> eightBytesDecode(data, "07", 0.0001, 7, 8) })
        }
    
        // Write results to the CSV file.
        val decodingTime = measureTimeMillis {
            contentResolver.openOutputStream(fileUri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    // Write headers only if they haven't been written yet.
                    if (!headersWritten) {
                        writer.append((1..200).joinToString(",", postfix = "\n") { "cellVol$it" })
                        headersWritten = true  // Set the flag once headers are written.
                    }
                    // Append a new row of results.
                    writer.append(results.joinToString(",", postfix = "\n") { it?.toString() ?: "NaN" })
                }
            }
        }
    
        // Update UI with performance info.
        runOnUiThread {
            infoTextView.text = "Data Generation Time: $dataGenerationTime ms\nDecoding Time: $decodingTime ms"
        }
    }           

    private fun openDirectoryChooser() {
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/csv"
            putExtra(Intent.EXTRA_TITLE, "output.csv")
        }
        startActivityForResult(intent, CREATE_FILE_REQUEST_CODE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == CREATE_FILE_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            data?.data?.also { uri ->
                saveFileUri = uri
                contentResolver.takePersistableUriPermission(
                    uri,
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
                infoTextView.text = "File save location selected."
            }
        }
    }

    companion object {
        const val CREATE_FILE_REQUEST_CODE = 1
    }
}
