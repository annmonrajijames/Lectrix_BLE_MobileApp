package com.lectrix_ble_mobileapp

import android.app.Activity
import android.bluetooth.*
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

class ReceiveActivity : AppCompatActivity() {
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    // Last valid values for display
    private var lastValidCellVol01: Double? = null
    private var lastValidPackCurr: Double? = null
    private var lastValidIgnitionStatus: Int? = null
    private var lastValidMode_Ack: Int? = null
    private var lastValidSOC: Double? = null
    private var lastValidSOCAh: Double? = null

    // Last data recorded for CSV
    private var lastdatarecordCellVol01: Double? = null
    private var lastdatarecordPackCurr: Double? = null
    private var lastdatarecordIgnitionStatus: Int? = null
    private var lastdatarecordMode_Ack: Int? = null
    private var lastdatarecordSOC: Double? = null
    private var lastdatarecordSOCAh: Double? = null

    // Rows, CheckBoxes, and TextViews for each parameter
    private lateinit var rowCellVol01: LinearLayout
    private lateinit var cbCellVol01: CheckBox
    private lateinit var tvCellVol01: TextView

    private lateinit var rowPackCurr: LinearLayout
    private lateinit var cbPackCurr: CheckBox
    private lateinit var tvPackCurr: TextView

    private lateinit var rowIgnitionStatus: LinearLayout
    private lateinit var cbIgnitionStatus: CheckBox
    private lateinit var tvIgnitionStatus: TextView

    private lateinit var rowModeAck: LinearLayout
    private lateinit var cbModeAck: CheckBox
    private lateinit var tvMode_Ack: TextView

    private lateinit var rowSOC: LinearLayout
    private lateinit var cbSOC: CheckBox
    private lateinit var tvSOC: TextView

    private lateinit var rowSOCAh: LinearLayout
    private lateinit var cbSOCAh: CheckBox
    private lateinit var tvSOCAh: TextView

    // File saving
    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

    // Two new booleans for controlling UI logic
    private var isSelectionMode = false   // If true, shows checkboxes
    private var showSelectedOnly = false  // If true, only show rows with checked boxes

    companion object {
        const val DEVICE_ADDRESS = "DEVICE_ADDRESS"
        val SERVICE_UUID: UUID = UUID.fromString("000000ff-0000-1000-8000-00805f9b34fb")
        val CHARACTERISTIC_UUID: UUID = UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb")
        const val TAG = "ReceiveActivity"
        const val CREATE_FILE_REQUEST_CODE = 1

        val CellVol01Decoder = eightBytesDecode("07", 0.0001, 7, 8)
        val PackCurrDecoder = signedEightBytesDecode("09", 0.001, 9, 10, 11, 12)
        val IgnitionStatusDecoder = bitDecode("11", 18, 0)
        val Mode_AckDecoder = threeBitDecode(2, 7, 2, 1, 0)

        val SOCDecoder = eightBytesDecode("09", 1.0, 17)
        val SOCAhDecoder = eightBytesDecode("10", 0.001, 1, 2, 3, 4)

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

        fun signedEightBytesDecode(firstByteCheck: String, multiplier: Double, vararg positions: Int): (String) -> Double? {
            return { data ->
                if (data.length >= 2 * positions.size && data.substring(0, 2) == firstByteCheck) {
                    val bytes = positions.map { pos -> data.substring(2 * pos, 2 * pos + 2) }.joinToString("")
                    var decimalValue = bytes.toLong(16)

                    val byteLength = positions.size
                    val maxByteValue = 1L shl (8 * byteLength)
                    val signBit = 1L shl (8 * byteLength - 1)

                    if (decimalValue >= signBit) {
                        decimalValue -= maxByteValue
                    }
                    decimalValue * multiplier
                } else {
                    null
                }
            }
        }

        fun bitDecode(firstByteCheck: String, bytePosition: Int, bitPosition: Int): (String) -> Int? {
            return { data ->
                if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) == firstByteCheck) {
                    val byte = data.substring(2 * bytePosition, 2 * bytePosition + 2)
                    val bits = byte.toInt(16).toString(2).padStart(8, '0')
                    if (bits[7 - bitPosition] == '1') 1 else 0
                } else {
                    null
                }
            }
        }

        fun threeBitDecode(firstByteCheck: Int, bytePosition: Int, bit1: Int, bit2: Int, bit3: Int): (String) -> Int? {
            return { data ->
                if (data.length >= 2 * (bytePosition + 1) &&
                    data.substring(0, 2) == firstByteCheck.toString().padStart(2, '0')
                ) {
                    val byte = data.substring(2 * bytePosition, 2 * bytePosition + 2)
                    val bits = byte.toInt(16).toString(2).padStart(8, '0')
                    val resultBits = "${bits[7 - bit1]}${bits[7 - bit2]}${bits[7 - bit3]}"
                    resultBits.toInt(2)
                } else {
                    null
                }
            }
        }
    }

    // ---------------------------------------------------------------------------------------------
    // Activity Lifecycle
    // ---------------------------------------------------------------------------------------------
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receive)

        // 1) Find row + checkbox + textview references for each parameter
        rowCellVol01      = findViewById(R.id.rowCellVol01)
        cbCellVol01       = findViewById(R.id.cbCellVol01)
        tvCellVol01       = findViewById(R.id.tvCellVol01)

        rowPackCurr       = findViewById(R.id.rowPackCurr)
        cbPackCurr        = findViewById(R.id.cbPackCurr)
        tvPackCurr        = findViewById(R.id.tvPackCurr)

        rowIgnitionStatus = findViewById(R.id.rowIgnitionStatus)
        cbIgnitionStatus  = findViewById(R.id.cbIgnitionStatus)
        tvIgnitionStatus  = findViewById(R.id.tvIgnitionStatus)

        rowModeAck        = findViewById(R.id.rowModeAck)
        cbModeAck         = findViewById(R.id.cbModeAck)
        tvMode_Ack        = findViewById(R.id.tvMode_Ack)

        rowSOC            = findViewById(R.id.rowSOC)
        cbSOC             = findViewById(R.id.cbSOC)
        tvSOC             = findViewById(R.id.tvSOC)

        rowSOCAh          = findViewById(R.id.rowSOCAh)
        cbSOCAh           = findViewById(R.id.cbSOCAh)
        tvSOCAh           = findViewById(R.id.tvSOCAh)

        // 2) Setup EditText for search
        val searchEditText: EditText = findViewById(R.id.searchEditText)
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val searchQuery = s.toString().lowercase(Locale.getDefault())
                // Re-apply the logic to show/hide rows
                updateParameterVisibility(searchQuery)
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        // 3) Buttons: Start/Stop/Save
        val startRecordingButton: Button = findViewById(R.id.startRecordingButton)
        val stopRecordingButton: Button = findViewById(R.id.stopRecordingButton)
        val saveLocationButton: Button = findViewById(R.id.saveLocationButton)

        startRecordingButton.setOnClickListener {
            if (saveFileUri != null) {
                startRecording()
            } else {
                Log.d(TAG, "Please select a location to save the file first.")
                Toast.makeText(this, "Please select a location first.", Toast.LENGTH_SHORT).show()
            }
        }
        stopRecordingButton.setOnClickListener { stopRecording() }
        saveLocationButton.setOnClickListener { openDirectoryChooser() }

        // 4) New Buttons: Enable Selection & Show Selected
        val enableSelectionButton: Button = findViewById(R.id.enableSelectionButton)
        val showSelectedButton: Button    = findViewById(R.id.showSelectedButton)

        enableSelectionButton.setOnClickListener {
            // Toggle isSelectionMode
            isSelectionMode = !isSelectionMode
            // Optionally change button text
            enableSelectionButton.text = if (isSelectionMode) "Disable Selection" else "Enable Selection"
            // Update UI
            updateCheckboxVisibility()
        }

        showSelectedButton.setOnClickListener {
            // Toggle showSelectedOnly
            showSelectedOnly = !showSelectedOnly
            // Optionally change button text
            showSelectedButton.text = if (showSelectedOnly) "Show All Parameters" else "Show Selected Parameters"
            // Re-apply visibility logic
            val searchQuery = searchEditText.text.toString().lowercase(Locale.getDefault())
            updateParameterVisibility(searchQuery)
        }

        // 5) If device address was provided, connect via BLE
        val deviceAddress = intent.getStringExtra(DEVICE_ADDRESS)
        if (deviceAddress != null) {
            setupBluetooth(deviceAddress)
        } else {
            Log.d(TAG, "Device address not provided")
        }

        // Initial UI update: everything hidden or shown based on layout defaults
        // If you want them visible initially, call updateCheckboxVisibility() & updateParameterVisibility("")
        updateCheckboxVisibility()
        updateParameterVisibility("")
    }

    // ---------------------------------------------------------------------------------------------
    // UI Visibility Methods
    // ---------------------------------------------------------------------------------------------

    /**
     * Shows/hides the CheckBoxes depending on isSelectionMode
     */
    private fun updateCheckboxVisibility() {
        val checkBoxes = listOf(cbCellVol01, cbPackCurr, cbIgnitionStatus, cbModeAck, cbSOC, cbSOCAh)
        checkBoxes.forEach { cb ->
            cb.visibility = if (isSelectionMode) View.VISIBLE else View.GONE
        }
    }

    /**
     * Updates which rows are visible based on search query + showSelectedOnly
     */
    private fun updateParameterVisibility(searchQuery: String) {
        // For convenience, make a list of (paramName, row, checkBox)
        val paramRows = listOf(
            Triple("cellvol01", rowCellVol01, cbCellVol01),
            Triple("packcurr",  rowPackCurr,  cbPackCurr),
            Triple("ignitionstatus", rowIgnitionStatus, cbIgnitionStatus),
            Triple("mode_ack",  rowModeAck,   cbModeAck),
            Triple("soc",       rowSOC,       cbSOC),
            Triple("socah",     rowSOCAh,     cbSOCAh)
        )

        // Show/hide each row
        for ((paramName, rowLayout, checkBox) in paramRows) {
            // 1) Does it match the search?
            val matchesSearch = searchQuery.isEmpty() || paramName.contains(searchQuery)

            // 2) If showSelectedOnly is true, also check if it's checked
            val isChecked = checkBox.isChecked

            // The row is visible if it matches the search query
            // AND either we are not in showSelectedOnly mode, or if we are, it's checked
            val shouldShow = matchesSearch && (!showSelectedOnly || isChecked)

            rowLayout.visibility = if (shouldShow) View.VISIBLE else View.GONE
        }
    }

    // ---------------------------------------------------------------------------------------------
    // BLE Setup & Callbacks
    // ---------------------------------------------------------------------------------------------
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

                val decodedCellVol01       = CellVol01Decoder(hexString)
                val decodedPackCurr        = PackCurrDecoder(hexString)
                val decodedIgnitionStatus  = IgnitionStatusDecoder(hexString)
                val decodedMode_Ack        = Mode_AckDecoder(hexString)
                val decodedSOC             = SOCDecoder(hexString)
                val decodedSOCAh           = SOCAhDecoder(hexString)

                if (decodedCellVol01 != null) {
                    lastValidCellVol01 = decodedCellVol01
                    lastdatarecordCellVol01 = decodedCellVol01
                }
                if (decodedPackCurr != null) {
                    lastValidPackCurr = decodedPackCurr
                    lastdatarecordPackCurr = decodedPackCurr
                }
                if (decodedIgnitionStatus != null) {
                    lastValidIgnitionStatus = decodedIgnitionStatus
                    lastdatarecordIgnitionStatus = decodedIgnitionStatus
                }
                if (decodedMode_Ack != null) {
                    lastValidMode_Ack = decodedMode_Ack
                    lastdatarecordMode_Ack = decodedMode_Ack
                }
                if (decodedSOC != null) {
                    lastValidSOC = decodedSOC
                    lastdatarecordSOC = decodedSOC
                }
                if (decodedSOCAh != null) {
                    lastValidSOCAh = decodedSOCAh
                    lastdatarecordSOCAh = decodedSOCAh
                }

                // Update the UI
                runOnUiThread {
                    tvCellVol01.text       = "CellVol01: ${lastValidCellVol01 ?: "N/A"}"
                    tvPackCurr.text        = "PackCurr: ${lastValidPackCurr ?: "N/A"}"
                    tvIgnitionStatus.text  = "IgnitionStatus: ${lastValidIgnitionStatus ?: "N/A"}"
                    tvMode_Ack.text        = "Mode_Ack: ${lastValidMode_Ack ?: "N/A"}"
                    tvSOC.text             = "SOC: ${lastValidSOC ?: "N/A"}"
                    tvSOCAh.text           = "SOCAh: ${lastValidSOCAh ?: "N/A"}"
                }
            }
        })
    }

    // ---------------------------------------------------------------------------------------------
    // CSV Recording
    // ---------------------------------------------------------------------------------------------
    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                val vehicleMetrics = VehicleMetrics(
                    CellVol01        = lastdatarecordCellVol01,
                    PackCurr         = lastdatarecordPackCurr,
                    IgnitionStatus   = lastdatarecordIgnitionStatus,
                    Mode_Ack         = lastdatarecordMode_Ack,
                    SOC              = lastdatarecordSOC,
                    SOCAh            = lastdatarecordSOCAh
                )
                saveDataToCSV(vehicleMetrics)

                delay(500)  // Adjust based on how frequently you want to record
            }
        }
        Log.d("Log", "Recording started.")
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread {
            Log.d("Log", "Recording stopped.")
            Toast.makeText(this, "Recording stopped.", Toast.LENGTH_SHORT).show()
        }
    }

    data class VehicleMetrics(
        val CellVol01: Double?,
        val PackCurr: Double?,
        val IgnitionStatus: Int?,
        val Mode_Ack: Int?,
        val SOC: Double?,
        val SOCAh: Double?
    )

    private fun saveDataToCSV(metrics: VehicleMetrics) {
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    if (!headersWritten) {
                        writer.append("Timestamp,CellVol01,PackCurr,IgnitionStatus,Mode_Ack,SOC,SOCAh\n")
                        headersWritten = true
                    }
                    val timestamp = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()).format(Date())

                    writer.append(
                        "$timestamp," +
                            "${metrics.CellVol01 ?: ""}," +
                            "${metrics.PackCurr ?: ""}," +
                            "${metrics.IgnitionStatus ?: ""}," +
                            "${metrics.Mode_Ack ?: ""}," +
                            "${metrics.SOC ?: ""}," +
                            "${metrics.SOCAh ?: ""}\n"
                    )
                }
            }
        }
    }

    // ---------------------------------------------------------------------------------------------
    // File Save Location
    // ---------------------------------------------------------------------------------------------
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
                Log.d("Log", "File save location selected.")
                Toast.makeText(this, "Save location selected.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}
