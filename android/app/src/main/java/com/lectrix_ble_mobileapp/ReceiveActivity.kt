// ReceiveActivity.kt
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
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

class ReceiveActivity : ComponentActivity() {
    companion object {
        const val DEVICE_ADDRESS = "DEVICE_ADDRESS"
        val SERVICE_UUID: UUID = UUID.fromString("000000ff-0000-1000-8000-00805f9b34fb")
        val CHARACTERISTIC_UUID: UUID = UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb")
        const val TAG = "ReceiveActivity"
        const val CREATE_FILE_REQUEST_CODE = 1
        
        // Decode helpers
        fun eightBytesDecode(firstByteCheck: String, multiplier: Double, vararg positions: Int): (String) -> Double? {
            return { data ->
                if (data.length >= 2 * positions.size && data.substring(0, 2) == firstByteCheck) {
                    val bytes = positions.joinToString("") { pos -> data.substring(2 * pos, 2 * pos + 2) }
                    bytes.toLong(16) * multiplier
                } else null
            }
        }
        // ... Other decoder functions omitted for brevity ...

        val CellVol01Decoder = eightBytesDecode("07", 0.0001, 7, 8)
    }

    // BLE state
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null
    private val cellVol01State = mutableStateOf<Double?>(null)

    // Recording state
    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

    // Triggers starting chronometer after file chosen
    private val shouldStartChrono = mutableStateOf(false)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        intent.getStringExtra(DEVICE_ADDRESS)?.let { setupBluetooth(it) }

        setContent {
            MaterialTheme {
                ReceiveScreen(
                    cellVol01          = cellVol01State.value,
                    openChooser        = { openDirectoryChooser() },
                    stopRecording      = { stopRecording() },
                    shareCSV           = { shareCSVFile() },
                    shouldStartChrono  = shouldStartChrono.value
                )
            }
        }
    }

    private fun setupBluetooth(deviceAddress: String) {
        bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter
        bluetoothAdapter.getRemoteDevice(deviceAddress).connectGatt(this, false, object : BluetoothGattCallback() {
            override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
                if (newState == BluetoothProfile.STATE_CONNECTED) gatt.discoverServices()
            }

            override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                if (status == BluetoothGatt.GATT_SUCCESS) {
                    val service = gatt.getService(SERVICE_UUID)
                    val characteristic = service?.getCharacteristic(CHARACTERISTIC_UUID)
                    characteristic?.let { char ->
                        gatt.setCharacteristicNotification(char, true)
                        val descriptor = char.getDescriptor(
                            UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                        )
                        descriptor?.let { desc ->
                            desc.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                            gatt.writeDescriptor(desc)
                        }
                    } ?: Log.d(TAG, "Service/Characteristic not found")
                }
            }

            override fun onCharacteristicChanged(
                gatt: BluetoothGatt,
                characteristic: BluetoothGattCharacteristic
            ) {
                val hex = characteristic.value.joinToString("") { "%02x".format(it) }
                CellVol01Decoder(hex)?.let { cellVol01State.value = it }
            }
        }).also { bluetoothGatt = it }
    }

    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                val timestamp = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()).format(Date())
                saveFileUri?.let { uri ->
                    contentResolver.openOutputStream(uri, "wa")?.use { os ->
                        OutputStreamWriter(os).use { writer ->
                            if (!headersWritten) {
                                writer.append("Timestamp,CellVol01\n")
                                headersWritten = true
                            }
                            writer.append("$timestamp,${cellVol01State.value ?: ""}\n")
                        }
                    }
                }
                delay(500)
            }
        }
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread { Toast.makeText(this, "Recording stopped.", Toast.LENGTH_SHORT).show() }
    }

    private fun openDirectoryChooser() {
        Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/csv"
            putExtra(Intent.EXTRA_TITLE, "output.csv")
        }.also { intent -> startActivityForResult(intent, CREATE_FILE_REQUEST_CODE) }
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
                // Now start recording and chronometer
                startRecording()
                shouldStartChrono.value = true
                Toast.makeText(this, "Save location selected. Recording started.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun shareCSVFile() {
        saveFileUri?.let { uri ->
            Intent(Intent.ACTION_SEND).apply {
                type = "text/csv"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }.also { startActivity(Intent.createChooser(it, "Share CSV via")) }
        } ?: run {
            Toast.makeText(this, "No CSV file available to share", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}

@Composable
fun ReceiveScreen(
    cellVol01: Double?,
    openChooser: ()->Unit,
    stopRecording: ()->Unit,
    shareCSV: ()->Unit,
    shouldStartChrono: Boolean
) {
    var searchQuery      by remember { mutableStateOf("") }
    var isSelectionMode  by remember { mutableStateOf(false) }
    var showSelectedOnly by remember { mutableStateOf(false) }
    var cellVolChecked   by remember { mutableStateOf(false) }

    val scrollState = rememberScrollState()
    val chronRef = remember { mutableStateOf<Chronometer?>(null) }

    // Start chronometer when file chosen
    LaunchedEffect(shouldStartChrono) {
        if (shouldStartChrono) {
            chronRef.value?.apply {
                base = SystemClock.elapsedRealtime()
                start()
            }
        }
    }

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)) {

        TextField(
            value = searchQuery,
            onValueChange = { searchQuery = it.lowercase(Locale.getDefault()) },
            placeholder = { Text("Search Parameters") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(8.dp))

        AndroidView(
            factory = { ctx -> Chronometer(ctx).apply { format = "Time: %s"; chronRef.value = this } },
            modifier = Modifier.align(Alignment.End)
        )

        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(onClick = { isSelectionMode = !isSelectionMode }) {
                Text(if (isSelectionMode) "Disable Selection" else "Enable Selection")
            }
            Button(onClick = { showSelectedOnly = !showSelectedOnly }) {
                Text(if (showSelectedOnly) "Show All Parameters" else "Show Selected Parameters")
            }
        }

        Spacer(Modifier.height(8.dp))

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(scrollState)
        ) {
            val matches   = searchQuery.isEmpty() || "cellvol01".contains(searchQuery)
            val shouldShow= matches && (!showSelectedOnly || cellVolChecked)
            if (shouldShow) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (isSelectionMode) {
                        Checkbox(
                            checked = cellVolChecked,
                            onCheckedChange = { cellVolChecked = it }
                        )
                    }
                    Text(
                        text = "CellVol01: ${cellVol01 ?: "N/A"}",
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(onClick = { openChooser() }, modifier = Modifier.weight(1f)) {
                Text("Start Recording")
            }
            Button(onClick = {
                chronRef.value?.stop()
                stopRecording()
            }, modifier = Modifier.weight(1f)) {
                Text("Stop Recording")
            }
            Button(onClick = shareCSV, modifier = Modifier.weight(1f)) {
                Text("Share CSV")
            }
        }
    }
}
