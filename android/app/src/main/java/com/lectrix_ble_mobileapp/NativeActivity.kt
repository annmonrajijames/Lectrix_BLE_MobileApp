package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import kotlin.random.Random
import kotlin.system.measureTimeMillis
import java.text.SimpleDateFormat
import java.util.*

class NativeActivity : AppCompatActivity() {
    private lateinit var infoTextView: TextView
    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_native)

        infoTextView = findViewById(R.id.infoTextView)
        val startRecordingButton: Button = findViewById(R.id.startRecordingButton)
        val stopRecordingButton: Button = findViewById(R.id.stopRecordingButton)
        val saveLocationButton: Button = findViewById(R.id.saveLocationButton)

        startRecordingButton.setOnClickListener {
            if (saveFileUri != null) {
                startRecording()
            } else {
                infoTextView.text = "Please select a location to save the file first."
            }
        }

        stopRecordingButton.setOnClickListener {
            stopRecording()
        }

        saveLocationButton.setOnClickListener {
            openDirectoryChooser()
        }
    }

    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                performDecodeOperation()
                // delay(1000)  // Delay for 1 second before the next recording, adjust as necessary
            }
        }
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread {
            infoTextView.text = "Recording stopped."
        }
    }

    private fun performDecodeOperation() {
        val results = mutableListOf<String>()
    
        // Measure data generation time
        val startDataGeneration = System.nanoTime()
        val dataList = (1..200).map { i -> generateRandomData(i) }
        val endDataGeneration = System.nanoTime()
    
        // Data generation time in milliseconds with higher precision
        val dataGenerationTime = (endDataGeneration - startDataGeneration) / 1_000_000.0
    
        // Measure decoding time
        val startDecoding = System.nanoTime()
        results.addAll(dataList.map { data -> eightBytesDecode(data, "07", 0.0001, 7, 8)?.toString() ?: "NaN" })
        val endDecoding = System.nanoTime()
    
        // Decoding time in milliseconds with higher precision
        val decodingTime = (endDecoding - startDecoding) / 1_000_000.0
    
        // Measure writing time
        val startWriting = System.nanoTime()
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    if (!headersWritten) {
                        writer.append("timestamp," + (1..200).joinToString(",") { "cellVol$it" } + "\n")
                        headersWritten = true
                    }
                    val timestamp = SimpleDateFormat("dd-MM-yyyy HH:mm:ss.SSS", Locale.getDefault()).apply {
                        timeZone = TimeZone.getTimeZone("Asia/Kolkata")
                    }.format(Date())
                    writer.append("$timestamp," + results.joinToString(",") + "\n")
                }
            }
        }
        val endWriting = System.nanoTime()
    
        // Writing time in milliseconds with higher precision
        val writingTime = (endWriting - startWriting) / 1_000_000.0
    
        // Display the timing results in the UI
        runOnUiThread {
            infoTextView.text = "Data Generation Time: ${"%.3f".format(dataGenerationTime)} ms\n" +
                                "Decoding Time: ${"%.3f".format(decodingTime)} ms\n" +
                                "Writing Time: ${"%.3f".format(writingTime)} ms"
        }
    }

    private fun generateRandomData(parameterIndex: Int): String {
        val randomBytes = ByteArray(19)
        Random.nextBytes(randomBytes)
        return "07" + randomBytes.joinToString("") { String.format("%02x", it) }
    }

    private fun eightBytesDecode(data: String, firstByteCheck: String, multiplier: Double, start: Int, end: Int): Double? {
        if (data.length >= 2 * (end + 1) && data.substring(0, 2) == firstByteCheck) {
            return Integer.parseInt(data.substring(2 * start, 2 * (end + 1)), 16) * multiplier
        }
        return null
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
