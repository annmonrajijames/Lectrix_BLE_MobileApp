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

    private fun performDecodeOperation() {
        val file = File(filesDir, "output.csv")
        if (!file.exists()) {
            // Create headers for CSV
            file.writeText((1..200).joinToString(",", prefix = "", postfix = "\n") { "cellVol$it" })
        }

        val results = mutableListOf<Double?>()
        val decodingTime = measureTimeMillis {
            (1..200).forEach { i ->
                val data = generateRandomData(i)
                // Use the adjusted function call
                results.add(eightBytesDecode(data, "07", 0.0001, 7, 8))
            }
        }

        val writingTime = measureTimeMillis {
            file.appendText(results.joinToString(",", postfix = "\n") { it?.toString() ?: "" })
        }

        // Update UI with performance info
        runOnUiThread {
            infoTextView.text = "Decoding Time: $decodingTime ms\nWriting Time: $writingTime ms"
        }
    }
}
