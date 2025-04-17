package com.lectrix_ble_mobileapp

import android.content.Intent
import android.os.Bundle
import android.os.SystemClock
import android.widget.Chronometer
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts.CreateDocument
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.*
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
    }

    private var lastValidCellVol01 by mutableStateOf<Double?>(null)
    private var saveFileUri: android.net.Uri? = null
    private var headersWritten = false
    private var recordJob: Job? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Launch document picker
        val createCsvLauncher = registerForActivityResult(CreateDocument("text/csv")) { uri ->
            uri?.let {
                saveFileUri = it
                headersWritten = false
                contentResolver.takePersistableUriPermission(
                    it,
                    Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                )
                startRecording()
            }
        }

        // If RN passed us the device address, you can read it here:
        val deviceAddr = intent.getStringExtra(DEVICE_ADDRESS)

        setContent {
            MaterialTheme {
                ReceiveScreen(
                    cellVol01 = lastValidCellVol01,
                    onStartRecording = { createCsvLauncher.launch("output.csv") },
                    onStopRecording  = { stopRecording() },
                    onShare          = { shareCsv() }
                )
            }
        }

        // (Re)connect your BLE device here using deviceAddr if needed...
    }

    @Composable
    private fun ReceiveScreen(
        cellVol01: Double?,
        onStartRecording: () -> Unit,
        onStopRecording:  () -> Unit,
        onShare:          () -> Unit
    ) {
        var searchQuery     by remember { mutableStateOf("") }
        var isSelectionMode by remember { mutableStateOf(false) }
        var showOnlySel     by remember { mutableStateOf(false) }
        val selected        = remember { mutableStateMapOf("cellvol01" to false) }

        Column(
            Modifier
              .fillMaxSize()
              .padding(16.dp)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it.lowercase(Locale.getDefault()) },
                label = { Text("Search Parameters") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(Modifier.height(8.dp))

            // Chronometer via AndroidView
            Box(Modifier.fillMaxWidth()) {
                AndroidView({ ctx ->
                    Chronometer(ctx).apply {
                        format = "Time: %s"
                    }
                }, Modifier.align(androidx.compose.ui.Alignment.CenterEnd))
            }

            Spacer(Modifier.height(8.dp))

            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { isSelectionMode = !isSelectionMode }, Modifier.weight(1f)) {
                    Text(if (isSelectionMode) "Disable Selection" else "Enable Selection")
                }
                Button(onClick = { showOnlySel = !showOnlySel }, Modifier.weight(1f)) {
                    Text(if (showOnlySel) "Show All" else "Show Selected")
                }
            }

            Spacer(Modifier.height(8.dp))

            Column(
                Modifier
                  .weight(1f)
                  .verticalScroll(rememberScrollState())
            ) {
                val params = listOf("cellvol01")
                params.forEach { name ->
                    val matches = searchQuery.isEmpty() || name.contains(searchQuery)
                    val checked = selected[name] ?: false
                    if (matches && (!showOnlySel || checked)) {
                        Row(
                            Modifier
                              .fillMaxWidth()
                              .padding(vertical = 4.dp),
                            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                        ) {
                            if (isSelectionMode) {
                                Checkbox(
                                    checked = checked,
                                    onCheckedChange = { selected[name] = it }
                                )
                                Spacer(Modifier.width(8.dp))
                            }
                            Text("CellVol01: ${cellVol01 ?: "N/A"}")
                        }
                    }
                }
            }

            Spacer(Modifier.height(8.dp))

            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onStopRecording, Modifier.weight(1f)) { Text("Stop Recording") }
                Button(onClick = onStartRecording, Modifier.weight(1f)) { Text("Start Recording") }
                Button(onClick = onShare, Modifier.weight(1f)) { Text("Share CSV") }
            }
        }
    }

    private fun startRecording() {
        recordJob = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                saveCsvData()
                delay(500)
            }
        }
    }

    private fun stopRecording() {
        recordJob?.cancel()
    }

    private fun saveCsvData() {
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { os ->
                OutputStreamWriter(os).use { writer ->
                    if (!headersWritten) {
                        writer.append("Timestamp,CellVol01\n")
                        headersWritten = true
                    }
                    val ts = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault())
                              .format(Date())
                    writer.append("$ts,${lastValidCellVol01 ?: ""}\n")
                }
            }
        }
    }

    private fun shareCsv() {
        saveFileUri?.let {
            startActivity(
              Intent(Intent.ACTION_SEND).apply {
                type = "text/csv"
                putExtra(Intent.EXTRA_STREAM, it)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
              }
            )
        }
    }
}
