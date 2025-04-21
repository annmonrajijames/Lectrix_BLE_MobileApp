package com.lectrix_ble_mobileapp

import android.app.Activity
import android.bluetooth.*
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.SystemClock
import android.util.Log
import android.widget.Chronometer
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

/** Returns true if [value] (a Double) is outside the [lower]–[upper] range. */
fun abnormality_check(value: Any?, lower: Double, upper: Double): Boolean =
    (value as? Double)?.let { it < lower || it > upper } ?: false

/** Holds configuration for a single parameter. */
data class ParamConfig(
    val name: String,
    val prefix: String,
    val decoder: (String) -> Any?,
    val state: MutableState<Any?>,
    var lastValid: Any? = null
)

class ReceiveActivity : ComponentActivity() {

    companion object {
        const val DEVICE_ADDRESS = "DEVICE_ADDRESS"
        const val TAG = "ReceiveActivity"
        const val CREATE_FILE_REQUEST_CODE = 1

        val SERVICE_UUID        = UUID.fromString("000000ff-0000-1000-8000-00805f9b34fb")
        val CHARACTERISTIC_UUID = UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb")

        // Decoder factories
        fun eightBytesDecode(firstByte: String, multiplier: Double, vararg pos: Int) = { data: String ->
            if (data.startsWith(firstByte) && data.length >= 2 * pos.size) {
                val hex = pos.joinToString("") { p -> data.substring(2*p, 2*p+2) }
                hex.toLong(16) * multiplier
            } else null
        }
        fun signedEightBytesDecode(firstByte: String, multiplier: Double, vararg pos: Int) = { data: String ->
            if (data.startsWith(firstByte) && data.length >= 2 * pos.size) {
                val hex = pos.joinToString("") { p -> data.substring(2*p, 2*p+2) }
                var v = hex.toLong(16)
                val bytes = pos.size
                val signBit = 1L shl (8*bytes - 1)
                if (v >= signBit) v -= (1L shl (8*bytes))
                v * multiplier
            } else null
        }
        fun threeBitDecode(firstByteInt: Int, bytePos: Int, b1: Int, b2: Int, b3: Int) = { data: String ->
            val fb = firstByteInt.toString().padStart(2,'0')
            if (data.startsWith(fb) && data.length >= 2*(bytePos+1)) {
                val byte = data.substring(2*bytePos,2*bytePos+2).toInt(16)
                val bits = byte.toString(2).padStart(8,'0')
                "${bits[7-b1]}${bits[7-b2]}${bits[7-b3]}".toInt(2)
            } else null
        }
        fun bitDecode(firstByte: String, bytePos: Int, bitPos: Int) = { data: String ->
            if (data.startsWith(firstByte) && data.length >= 2*(bytePos+1)) {
                val bits = data.substring(2*bytePos,2*bytePos+2).toInt(16)
                    .toString(2).padStart(8,'0')
                if (bits[7-bitPos]=='1') 1 else 0
            } else null
        }
        fun eightBytesASCIIDecode(firstByte: String, vararg pos: Int) = { data: String ->
            if (data.startsWith(firstByte) && data.length >= 2*pos.size) {
                pos.map { p -> data.substring(2*p,2*p+2).toInt(16).toChar() }
                    .joinToString("")
            } else null
        }
    }

    // List of parameters (easily extendable)
    private val paramConfigs = listOf(
        ParamConfig("CellVol01",               "07",  eightBytesDecode("07", 0.0001, 7, 8),            mutableStateOf(null)),
        ParamConfig("PackCurr",                "09",  signedEightBytesDecode("09", 0.001, 9,10,11,12), mutableStateOf(null)),
        ParamConfig("Mode_Ack",                "02",  threeBitDecode(2, 7, 2,1,0),                   mutableStateOf(null)),
        ParamConfig("MCU_Version_Firmware_Id", "04",  eightBytesASCIIDecode("04", 8,9,10,11,12,13,14,15), mutableStateOf(null)),
        ParamConfig("IgnitionStatus",          "11",  bitDecode("11", 18, 0),                         mutableStateOf(null)),
        ParamConfig("Throttle_Error",          "02",  bitDecode("02", 8, 5),                          mutableStateOf(null)),
        ParamConfig("Overcurrent_Fault",       "02",  bitDecode("02",10, 2),                          mutableStateOf(null)),
        ParamConfig("Motor_Temperature",       "02",  eightBytesDecode("02", 1.0, 16),                mutableStateOf(null)),
        ParamConfig("MCU_Temperature",         "02",  eightBytesDecode("02", 1.0, 15, 14),            mutableStateOf(null))
    )

    // Group by prefix for decoding
    private val configMap = paramConfigs.groupBy { it.prefix }

    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

    // Controls when Compose should start the chronometer
    private val recordingStartedState = mutableStateOf(false)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        intent.getStringExtra(DEVICE_ADDRESS)?.let { setupBluetooth(it) }

        setContent {
            ReceiveScreen(
                configs          = paramConfigs,
                recordingStarted = recordingStartedState.value,
                onChooseLocation = { openDirectoryChooser() },
                onStopRecording  = { stopRecording() },
                onShareCSV       = { shareCSVFile() }
            )
        }
    }

    private fun setupBluetooth(deviceAddress: String) {
        bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter
        bluetoothGatt = bluetoothAdapter
            .getRemoteDevice(deviceAddress)
            .connectGatt(this, false, object: BluetoothGattCallback() {
                override fun onConnectionStateChange(g: BluetoothGatt, status: Int, newState: Int) {
                    if (newState == BluetoothProfile.STATE_CONNECTED) g.discoverServices()
                }
                override fun onServicesDiscovered(g: BluetoothGatt, status: Int) {
                    if (status == BluetoothGatt.GATT_SUCCESS) {
                        val svc  = g.getService(SERVICE_UUID)
                        val char = svc?.getCharacteristic(CHARACTERISTIC_UUID)
                        if (char != null) {
                            g.setCharacteristicNotification(char, true)
                            char.getDescriptor(
                                UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                            )?.apply { value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE }
                             ?.also { g.writeDescriptor(it) }
                        }
                    }
                }
                override fun onCharacteristicChanged(
                    g: BluetoothGatt,
                    characteristic: BluetoothGattCharacteristic
                ) {
                    val hex = characteristic.value.joinToString("") { "%02x".format(it) }
                    configMap[hex.substring(0,2)]?.forEach { cfg ->
                        cfg.decoder(hex)?.also { decoded ->
                            cfg.lastValid = decoded
                            runOnUiThread { cfg.state.value = decoded }
                        }
                    }
                }
            })
    }

    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                saveFileUri?.let { uri ->
                    contentResolver.openOutputStream(uri, "wa")?.use { os ->
                        OutputStreamWriter(os).use { w ->
                            if (!headersWritten) {
                                w.append("Timestamp,")
                                w.append(paramConfigs.joinToString(",") { it.name })
                                w.append("\n")
                                headersWritten = true
                            }
                            val ts = SimpleDateFormat(
                                "yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()
                            ).format(Date())
                            w.append(ts)
                            paramConfigs.forEach { cfg ->
                                w.append(",${cfg.lastValid ?: ""}")
                            }
                            w.append("\n")
                        }
                    }
                }
                delay(500)
            }
        }
        Log.d(TAG, "Recording coroutine started.")
    }

    private fun stopRecording() {
        job?.cancel()
        recordingStartedState.value = false
        Toast.makeText(this, "Recording stopped.", Toast.LENGTH_SHORT).show()
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
                headersWritten = false
                contentResolver.takePersistableUriPermission(
                    uri,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                )
                Toast.makeText(this, "Save location selected. Recording started.", Toast.LENGTH_SHORT).show()
                startRecording()
                recordingStartedState.value = true
            }
        }
    }

    private fun shareCSVFile() {
        saveFileUri?.let { uri ->
            val share = Intent(Intent.ACTION_SEND).apply {
                type = "text/csv"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            startActivity(Intent.createChooser(share, "Share CSV file via"))
        } ?: Toast.makeText(this, "No CSV file to share", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}

@Composable
fun ReceiveScreen(
    configs          : List<ParamConfig>,
    recordingStarted : Boolean,
    onChooseLocation : () -> Unit,
    onStopRecording  : () -> Unit,
    onShareCSV       : () -> Unit
) {
    var searchQuery      by remember { mutableStateOf("") }
    var isSelectionMode  by remember { mutableStateOf(false) }
    var showSelectedOnly by remember { mutableStateOf(false) }
    var showErrors       by remember { mutableStateOf(false) }

    val checks    = remember { configs.associate { it.name to mutableStateOf(false) } }
    val scroll    = rememberScrollState()
    val chronoRef = remember { mutableStateOf<Chronometer?>(null) }

    LaunchedEffect(recordingStarted) {
        if (recordingStarted) {
            chronoRef.value?.apply {
                base = SystemClock.elapsedRealtime()
                start()
            }
        }
    }

    val screenHeight = LocalConfiguration.current.screenHeightDp.dp

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        TextField(
            value = searchQuery,
            onValueChange = { searchQuery = it.lowercase(Locale.getDefault()) },
            placeholder = { Text("Search Parameters") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))

        AndroidView(factory = { ctx ->
            Chronometer(ctx).apply {
                format = "Time: %s"
                chronoRef.value = this
            }
        }, modifier = Modifier.align(Alignment.End))
        Spacer(Modifier.height(8.dp))

        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { isSelectionMode = !isSelectionMode }) {
                Text(if (isSelectionMode) "Disable Selection" else "Enable Selection")
            }
            Button(onClick = { showSelectedOnly = !showSelectedOnly }) {
                Text(if (showSelectedOnly) "Show All Params" else "Show Selected Params")
            }
        }
        Spacer(Modifier.height(8.dp))

        Button(onClick = { showErrors = !showErrors }) {
            Text(if (showErrors) "Hide Errors" else "Show Errors")
        }
        Spacer(Modifier.height(8.dp))

        if (showErrors) {
            val errorFlags = configs.filter { 
                (it.name == "Throttle_Error" || it.name == "Overcurrent_Fault") &&
                it.state.value == 1
            }
            val abnormalTemps = configs.filter {
                (it.name == "MCU_Temperature" && abnormality_check(it.state.value, 12.0, 100.0)) ||
                (it.name == "Motor_Temperature" && abnormality_check(it.state.value, 15.0, 90.0))
            }
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(screenHeight * 0.25f)
                    .border(1.dp, MaterialTheme.colors.onSurface)
                    .padding(8.dp)
            ) {
                if (errorFlags.isEmpty() && abnormalTemps.isEmpty()) {
                    Text("No errors", Modifier.align(Alignment.Center))
                } else {
                    Column {
                        errorFlags.forEach {
                            Text(
                                "${it.name}: ${it.state.value}",
                                color = MaterialTheme.colors.error,
                                modifier = Modifier.padding(vertical = 2.dp)
                            )
                        }
                        abnormalTemps.forEach {
                            Text(
                                "${it.name}: ${it.state.value}",
                                color = Color(0xFFFFA500),
                                modifier = Modifier.padding(vertical = 2.dp)
                            )
                        }
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
        }

        Column(Modifier.weight(1f).verticalScroll(scroll)) {
            configs.forEach { cfg ->
                val checkedState = checks[cfg.name]!!
                val matches = searchQuery.isEmpty() ||
                              cfg.name.lowercase().contains(searchQuery)
                if (matches && (!showSelectedOnly || checkedState.value)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (isSelectionMode) {
                            Checkbox(
                                checked = checkedState.value,
                                onCheckedChange = { checkedState.value = it }
                            )
                        }
                        Text(
                            "${cfg.name}: ${cfg.state.value?.toString() ?: "N/A"}",
                            Modifier.padding(start = 8.dp)
                        )
                    }
                }
            }
        }

        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = onChooseLocation, Modifier.weight(1f)) {
                Text("Start Recording")
            }
            Button(onClick = {
                chronoRef.value?.stop()
                onStopRecording()
            }, Modifier.weight(1f)) {
                Text("Stop Recording")
            }
            Button(onClick = onShareCSV, Modifier.weight(1f)) {
                Text("Share CSV")
            }
        }
    }
}
