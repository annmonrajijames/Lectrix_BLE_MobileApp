package com.lectrix_ble_mobileapp

import android.app.Activity
import android.bluetooth.*
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.SystemClock
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.Chronometer
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*
import android.view.View

class ReceiveActivity : AppCompatActivity() {
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    // Last valid values for display
    private var lastValidCellVol01: Double? = null

    // UI references
    private lateinit var rowCellVol01: LinearLayout
    private lateinit var cbCellVol01: CheckBox
    private lateinit var tvCellVol01: TextView
    private lateinit var stopwatchChronometer: Chronometer

    // File saving
    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

    // Booleans for controlling UI logic
    private var isSelectionMode = false
    private var showSelectedOnly = false

    companion object {
        const val DEVICE_ADDRESS = "DEVICE_ADDRESS"
        val SERVICE_UUID: UUID = UUID.fromString("000000ff-0000-1000-8000-00805f9b34fb")
        val CHARACTERISTIC_UUID: UUID = UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb")
        const val TAG = "ReceiveActivity"
        const val CREATE_FILE_REQUEST_CODE = 1

        val CellVol01Decoder = eightBytesDecode("07", 0.0001, 7, 8)

        fun eightBytesDecode(firstByteCheck: String, multiplier: Double, vararg positions: Int): (String) -> Double? {
            return { data ->
                if (data.length >= 2 * positions.size && data.substring(0, 2) == firstByteCheck) {
                    val bytes = positions.map { pos -> data.substring(2 * pos, 2 * pos + 2) }.joinToString("")
                    val decimalValue = bytes.toLong(16)
                    decimalValue * multiplier
                } else {
                    null
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receive)

        // Find UI components
        rowCellVol01 = findViewById(R.id.rowCellVol01)
        cbCellVol01  = findViewById(R.id.cbCellVol01)
        tvCellVol01  = findViewById(R.id.tvCellVol01)
        stopwatchChronometer = findViewById(R.id.stopwatchChronometer)
        // Set a format so the elapsed time is clearly visible
        stopwatchChronometer.format = "Time: %s"

        // Setup search EditText
        val searchEditText: EditText = findViewById(R.id.searchEditText)
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val searchQuery = s.toString().lowercase(Locale.getDefault())
                updateParameterVisibility(searchQuery)
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        // Setup buttons
        val stopRecordingButton: Button = findViewById(R.id.stopRecordingButton)
        val saveLocationButton: Button = findViewById(R.id.saveLocationButton)
        val shareButton: Button = findViewById(R.id.shareButton)
        val enableSelectionButton: Button = findViewById(R.id.enableSelectionButton)
        val showSelectedButton: Button = findViewById(R.id.showSelectedButton)

        stopRecordingButton.setOnClickListener { stopRecording() }
        saveLocationButton.setOnClickListener { openDirectoryChooser() }
        shareButton.setOnClickListener { shareCSVFile() }

        enableSelectionButton.setOnClickListener {
            isSelectionMode = !isSelectionMode
            enableSelectionButton.text = if (isSelectionMode) "Disable Selection" else "Enable Selection"
            updateCheckboxVisibility()
        }

        showSelectedButton.setOnClickListener {
            showSelectedOnly = !showSelectedOnly
            showSelectedButton.text = if (showSelectedOnly) "Show All Parameters" else "Show Selected Parameters"
            val searchQuery = searchEditText.text.toString().lowercase(Locale.getDefault())
            updateParameterVisibility(searchQuery)
        }

        // Setup BLE connection if device address is provided
        val deviceAddress = intent.getStringExtra(DEVICE_ADDRESS)
        if (deviceAddress != null) {
            setupBluetooth(deviceAddress)
        } else {
            Log.d(TAG, "Device address not provided")
        }

        updateCheckboxVisibility()
        updateParameterVisibility("")
    }

    private fun updateCheckboxVisibility() {
        val checkBoxes = listOf(cbCellVol01)
        checkBoxes.forEach { cb ->
            cb.visibility = if (isSelectionMode) View.VISIBLE else View.GONE
        }
    }

    private fun updateParameterVisibility(searchQuery: String) {
        val paramRows = listOf(Triple("cellvol01", rowCellVol01, cbCellVol01))
        for ((paramName, rowLayout, checkBox) in paramRows) {
            val matchesSearch = searchQuery.isEmpty() || paramName.contains(searchQuery)
            val isChecked = checkBox.isChecked
            val shouldShow = matchesSearch && (!showSelectedOnly || isChecked)
            rowLayout.visibility = if (shouldShow) View.VISIBLE else View.GONE
        }
    }

    private fun setupBluetooth(deviceAddress: String) {
        bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter
        val device = bluetoothAdapter.getRemoteDevice(deviceAddress)
        connectToDevice(device)
    }

    private fun connectToDevice(device: BluetoothDevice) {
        bluetoothGatt = device.connectGatt(this, false, object : BluetoothGattCallback() {
            override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
                if (newState == BluetoothProfile.STATE_CONNECTED) {
                    gatt.discoverServices()
                } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                    Log.d("Log", "Disconnected")
                }
            }

            override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                if (status == BluetoothGatt.GATT_SUCCESS) {
                    val service = gatt.getService(SERVICE_UUID)
                    val characteristic = service?.getCharacteristic(CHARACTERISTIC_UUID)
                    if (characteristic != null) {
                        gatt.setCharacteristicNotification(characteristic, true)
                        val descriptor = characteristic.getDescriptor(
                            UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                        )?.apply {
                            value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                        }
                        if (descriptor != null) {
                            gatt.writeDescriptor(descriptor)
                        }
                    } else {
                        Log.d("Log", "Service/Characteristic not found")
                    }
                } else {
                    Log.d("Log", "Service discovery failed")
                }
            }

            override fun onCharacteristicChanged(
                gatt: BluetoothGatt,
                characteristic: BluetoothGattCharacteristic
            ) {
                val rawData = characteristic.value
                val hexString = rawData.joinToString(separator = "") { "%02x".format(it) }
                val decodedCellVol01 = CellVol01Decoder(hexString)
                if (decodedCellVol01 != null) {
                    lastValidCellVol01 = decodedCellVol01
                }
                runOnUiThread {
                    tvCellVol01.text = "CellVol01: ${lastValidCellVol01 ?: "N/A"}"
                }
            }
        })
    }

    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                val vehicleMetrics = VehicleMetrics(CellVol01 = lastValidCellVol01)
                saveDataToCSV(vehicleMetrics)
                delay(500)  // Adjust delay as needed
            }
        }
        Log.d("Log", "Recording started.")
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread {
            Log.d("Log", "Recording stopped.")
            Toast.makeText(this, "Recording stopped.", Toast.LENGTH_SHORT).show()
            // Stop the stopwatch
            stopwatchChronometer.stop()
        }
    }

    data class VehicleMetrics(val CellVol01: Double?)

    private fun saveDataToCSV(metrics: VehicleMetrics) {
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    if (!headersWritten) {
                        writer.append("Timestamp,CellVol01\n")
                        headersWritten = true
                    }
                    val timestamp = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()).format(Date())
                    writer.append("$timestamp,${metrics.CellVol01 ?: ""}\n")
                }
            }
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
                // Reset header flag for a new recording session
                headersWritten = false
                contentResolver.takePersistableUriPermission(
                    uri,
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
                Log.d("Log", "File save location selected.")
                Toast.makeText(this, "Save location selected. Recording started.", Toast.LENGTH_SHORT).show()
                // Start the stopwatch (make sure to update the base and start)
                stopwatchChronometer.base = SystemClock.elapsedRealtime()
                stopwatchChronometer.start()
                Log.d("Log", "Stopwatch started with base: ${stopwatchChronometer.base}")
                // Start recording data
                startRecording()
            }
        }
    }

    private fun shareCSVFile() {
        if (saveFileUri != null) {
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/csv"
                putExtra(Intent.EXTRA_STREAM, saveFileUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            startActivity(Intent.createChooser(shareIntent, "Share CSV file via"))
        } else {
            Toast.makeText(this, "No CSV file available to share", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}
