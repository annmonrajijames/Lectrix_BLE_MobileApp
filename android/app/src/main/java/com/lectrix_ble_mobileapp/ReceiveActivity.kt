package com.lectrix_ble_mobileapp

import android.app.Activity
import android.bluetooth.*
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

class ReceiveActivity : AppCompatActivity() {
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    private lateinit var dataReceivedView: TextView
    private var lastValidCellVol01: Double? = null
    private var lastValidCellVol01_rep: Double? = null
    
    private var lastValidPackCurr: Double? = null
    private var lastValidIgnitionStatus: Int? = null
    private var lastValidMode_Ack: Int? = null

    private var lastValidCellVol02: Double? = null
    private var lastValidCellVol03: Double? = null
    private var lastValidCellVol04: Double? = null
    private var lastValidCellVol05: Double? = null
    private var lastValidCellVol06: Double? = null
    private var lastValidCellVol07: Double? = null
    private var lastValidCellVol08: Double? = null
    private var lastValidCellVol09: Double? = null
    private var lastValidCellVol10: Double? = null
    private var lastValidCellVol11: Double? = null
    private var lastValidCellVol12: Double? = null
    private var lastValidCellVol13: Double? = null
    private var lastValidCellVol14: Double? = null
    private var lastValidCellVol15: Double? = null
    private var lastValidCellVol16: Double? = null
    private var lastValidMaxCellVol: Double? = null
    private var lastValidMinCellVol: Double? = null
    private var lastValidAvgCellVol: Double? = null
    private var lastValidMaxVoltId: Double? = null
    private var lastValidMinVoltId: Double? = null
    private var lastValidPackVol: Double? = null
    private var lastValidCycleCount: Double? = null
    private var lastValidCellVolMinMaxDev: Double? = null
    private var lastValidSOC: Double? = null
    private var lastValidSOCAh: Double? = null
    private var lastValidSOH: Double? = null
    private var lastValidBmsStatus: Double? = null
    private var lastValidLedStatus: Double? = null
    private var lastValidActiveCellBalStatus: Double? = null
    private var lastValidBMS_Serial_No_MUX: Double? = null
    private var lastValidBMS_Serial_No__1_7: Double? = null
    private var lastValidLatchProtection: Double? = null
    private var lastValidLatchType: Double? = null
    private var lastValidChargerType: Double? = null
    private var lastValidPcbTemp: Double? = null
    private var lastValidAfeTemp: Double? = null
    private var lastValidCellChemType: Double? = null
    private var lastValidChg_Accumulative_Ah: Double? = null
    private var lastValidDchg_Accumulative_Ah: Double? = null
    private var lastValidRefVol: Double? = null
    private var lastValid_3v3Vol: Double? = null
    private var lastValid_5vVol: Double? = null
    private var lastValid_12vVol: Double? = null
    private var lastValidActual_SoC: Double? = null
    private var lastValidUsable_Capacity_Ah: Double? = null
    private var lastValidConfigVer: Double? = null
    private var lastValidInternalFWVer: Double? = null
    private var lastValidInternalFWSubVer: Double? = null
    private var lastValidBHB_66049: Double? = null
    private var lastValidPackCurr: Double? = null
    private var lastValidMaxTemp: Double? = null
    private var lastValidMinTemp: Double? = null
    private var lastValidFetTemp: Double? = null
    private var lastValidTemp1: Double? = null
    private var lastValidTemp2: Double? = null
    private var lastValidTemp3: Double? = null
    private var lastValidTemp4: Double? = null
    private var lastValidTemp5: Double? = null
    private var lastValidTemp6: Double? = null
    private var lastValidTemp7: Double? = null
    private var lastValidTemp8: Double? = null
    private var lastValidHwVer: Double? = null
    private var lastValidFwVer: Double? = null
    private var lastValidFWSubVer: Double? = null
    private var lastValidBtStatus_NC0PSM1CC2CV3Finish4: Double? = null
    private var lastValidBt_liveMsg1Temp: Double? = null
    private var lastValidBt_liveMsg_soc: Double? = null
    private var lastValidBMS_status: Double? = null
    private var lastValidDemand_voltage: Double? = null
    private var lastValidDemand_Current: Double? = null
    private var lastValidMaxChgVoltgae: Double? = null
    private var lastValidMaxChgCurrent: Double? = null
    private var lastValidActualChgVoltage: Double? = null
    private var lastValidActualChgCurrent: Double? = null
    private var lastValidCharging_end_cutoff_Curr: Double? = null
    private var lastValidCHB_258: Double? = null
    private var lastValidChgrNC0PSM1CC2CV3Finsh4: Double? = null
    private var lastValidchgr_msg_temp: Double? = null
    private var lastValidchgStatus_chg_idle: Double? = null
    private var lastValidchgrLiveMsgChgVolt: Double? = null
    private var lastValidchgrLiveMsgChgCurrent: Double? = null
    private var lastValidChargeSOP: Double? = null
    private var lastValidDchgSOP: Double? = null
    private var lastValidDrive_Error_Flag: Double? = null
    private var lastValidSet_Regen: Double? = null
    private var lastValidDCcurrentlimit: Double? = null
    private var lastValidCustom_freq: Double? = null
    private var lastValidCustom_torque: Double? = null
    private var lastValidBuffer_speed: Double? = null
    private var lastValidBase_speed: Double? = null
    private var lastValidInitial_torque: Double? = null
    private var lastValidFinal_torque: Double? = null
    private var lastValidCluster_odo: Double? = null
    private var lastValidMotorSpeed: Double? = null
    private var lastValidBatteryVoltage: Double? = null
    private var lastValidBatteryCurrent: Double? = null
    private var lastValidAC_Current: Double? = null
    private var lastValidAC_Voltage: Double? = null
    private var lastValidThrottle: Double? = null
    private var lastValidMCU_Temperature: Double? = null
    private var lastValidMotor_Temperature: Double? = null
    private var lastValidMCU_Fault_Code: Double? = null
    private var lastValidMCU_ID: Double? = null
    private var lastValidCluster_heartbeat: Double? = null
    private var lastValidOdo_Cluster: Double? = null
    
    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

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
        // Define the bitDecode function
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

        // Define the threeBitDecode function
        fun threeBitDecode(firstByteCheck: Int, bytePosition: Int, bit1: Int, bit2: Int, bit3: Int): (String) -> Int? {
            return { data ->
                if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) == firstByteCheck.toString().padStart(2, '0')) {
                    val byte = data.substring(2 * bytePosition, 2 * bytePosition + 2)
                    val bits = byte.toInt(16).toString(2).padStart(8, '0')
                    val resultBits = "${bits[7 - bit1]}${bits[7 - bit2]}${bits[7 - bit3]}"
                    resultBits.toInt(2)  // Converts the bit sequence directly to decimal
                } else {
                    null
                }
            }
        }     

    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receive)

        dataReceivedView = findViewById(R.id.dataReceivedView)
        val startRecordingButton: Button = findViewById(R.id.startRecordingButton)
        val stopRecordingButton: Button = findViewById(R.id.stopRecordingButton)
        val saveLocationButton: Button = findViewById(R.id.saveLocationButton)

        val deviceAddress = intent.getStringExtra(DEVICE_ADDRESS)
        if (deviceAddress != null) {
            setupBluetooth(deviceAddress)
        } else {
            dataReceivedView.text = "Device address not provided"
        }

        startRecordingButton.setOnClickListener {
            if (saveFileUri != null) {
                startRecording()
            } else {
                dataReceivedView.text = "Please select a location to save the file first."
            }
        }

        stopRecordingButton.setOnClickListener {
            stopRecording()
        }

        saveLocationButton.setOnClickListener {
            openDirectoryChooser()
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
                    runOnUiThread { dataReceivedView.text = "Disconnected" }
                }
            }

            override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                if (status == BluetoothGatt.GATT_SUCCESS) {
                    val service = gatt.getService(SERVICE_UUID)
                    val characteristic = service?.getCharacteristic(CHARACTERISTIC_UUID)
                    if (characteristic != null) {
                        gatt.setCharacteristicNotification(characteristic, true)
                        val descriptor = characteristic.getDescriptor(
                            UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")).apply {
                            value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                        }
                        gatt.writeDescriptor(descriptor)
                    } else {
                        runOnUiThread { dataReceivedView.text = "Service/Characteristic not found" }
                    }
                } else {
                    runOnUiThread { dataReceivedView.text = "Service discovery failed" }
                }
            }

            override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
                val rawData = characteristic.value
                val hexString = rawData.joinToString(separator = "") { eachByte -> "%02x".format(eachByte) }
                val decodedCellVol01 = CellVol01Decoder(hexString)
                val decodedPackCurr = PackCurrDecoder(hexString)
                val decodedIgnitionStatus = IgnitionStatusDecoder(hexString)
                val decodedMode_Ack = Mode_AckDecoder(hexString)


                if (decodedCellVol01 != null) {
                    lastValidCellVol01 = decodedCellVol01
                }
                if (decodedPackCurr != null) {
                    lastValidPackCurr = decodedPackCurr
                }
                if (decodedIgnitionStatus != null) {
                    lastValidIgnitionStatus = decodedIgnitionStatus
                }
                if (decodedMode_Ack != null) {
                    lastValidMode_Ack = decodedMode_Ack
                }

                runOnUiThread {
                    dataReceivedView.text = "CellVol01: ${lastValidCellVol01 ?: "N/A"}\nPackCurr: ${lastValidPackCurr ?: "N/A"}\nIgnitionStatus: ${lastValidIgnitionStatus ?: "N/A"}\nMode_Ack: ${lastValidMode_Ack ?: "N/A"}"
                }
            }
        })
    }

    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                if (lastValidCellVol01 != lastValidCellVol01_rep) {
            
                saveDataToCSV(lastValidCellVol01, lastValidPackCurr, lastValidIgnitionStatus, lastValidMode_Ack)
                // delay(1000)  // Adjust based on how frequently you want to record data
                }
                lastValidCellVol01_rep = lastValidCellVol01
            }
        }
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread {
            dataReceivedView.text = "Recording stopped."
        }
    }

    private fun saveDataToCSV(CellVol01: Double?, PackCurr: Double?, IgnitionStatus: Int?, Mode_Ack: Int?) {
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    if (!headersWritten) {
                        writer.append("Timestamp,CellVol01,PackCurr,IgnitionStatus,Mode_Ack\n")
                        headersWritten = true
                    }
                    val timestamp = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()).format(Date())
                    writer.append("$timestamp,${CellVol01 ?: ""},${PackCurr ?: ""},${IgnitionStatus ?: ""},${Mode_Ack ?: ""}\n")
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
                contentResolver.takePersistableUriPermission(
                    uri,
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
                dataReceivedView.text = "File save location selected."
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}
