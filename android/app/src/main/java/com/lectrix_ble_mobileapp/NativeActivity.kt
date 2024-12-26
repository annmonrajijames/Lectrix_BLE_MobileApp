package com.lectrix_ble_mobileapp

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import kotlin.random.Random
import kotlin.system.measureTimeMillis

class NativeActivity : AppCompatActivity() {
    private lateinit var infoTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_native)

        infoTextView = findViewById(R.id.infoTextView)
        val decodeButton: Button = findViewById(R.id.decodeButton)
        decodeButton.setOnClickListener {
            performDecodeOperation()
        }
    }

    private fun generateRandomData(): String {
        val randomBytes = ByteArray(8) // Generate 8 bytes (16 hex characters)
        Random.nextBytes(randomBytes)
        return "07" + randomBytes.joinToString("") { String.format("%02x", it) }
    }

    private fun eightBytesDecode(firstByteCheck: String, multiplier: Double, start: Int, end: Int, data: String): Double? {
        if (data.length >= 2 * (end + 1) && data.substring(0, 2) == firstByteCheck) {
            return Integer.parseInt(data.substring(2 * start, 2 * (end + 1)), 16) * multiplier
        }
        return null
    }

    private fun performDecodeOperation() {
        val file = File(filesDir, "output.csv")
        if (!file.exists()) {
            file.writeText("cellVol01\n") // Write header to CSV
        }

        val data = generateRandomData()
        val decodedValue: Double?
        val decodingTime: Long
        val writingTime: Long

        decodingTime = measureTimeMillis {
            decodedValue = eightBytesDecode("07", 0.0001, 7, 8, data)
        }
        println("Decoding time: $decodingTime ms")

        writingTime = measureTimeMillis {
            decodedValue?.let {
                file.appendText("$it\n") // Append decoded value to CSV
            }
        }
        println("Writing time: $writingTime ms")

        // Update the text view with the results
        runOnUiThread {
            decodedValue?.let {
                infoTextView.text = "Decoded value: $it\nDecoding Time: $decodingTime ms\nWriting Time: $writingTime ms"
            } ?: run {
                infoTextView.text = "Failed to decode value."
            }
        }
    }
}
