package com.lectrix_ble_mobileapp

import android.bluetooth.*
import android.content.Context
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class ReceiveActivity : AppCompatActivity() {
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    private lateinit var dataReceivedView: TextView
    private var lastValidCellVol01: Double? = null  // Variable to store the last valid value

    companion object {
        const val DEVICE_ADDRESS = "DEVICE_ADDRESS"
        val SERVICE_UUID: UUID = UUID.fromString("000000ff-0000-1000-8000-00805f9b34fb")
        val CHARACTERISTIC_UUID: UUID = UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb")
        const val TAG = "ReceiveActivity"

        // Define the eightBytesDecode function within the companion object
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

        val cellVol01Decoder = eightBytesDecode("07", 0.0001, 7, 8)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receive)

        dataReceivedView = findViewById(R.id.dataReceivedView)

        val deviceAddress = intent.getStringExtra(DEVICE_ADDRESS)
        if (deviceAddress != null) {
            setupBluetooth(deviceAddress)
        } else {
            dataReceivedView.text = "Device address not provided"
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
                val decodedValue = cellVol01Decoder(hexString)

                // Only update lastValidCellVol01 if decodedValue is not null
                if (decodedValue != null) {
                    lastValidCellVol01 = decodedValue
                }

                // Always display the last valid value
                runOnUiThread {
                    dataReceivedView.text = "Cell Vol 01: ${lastValidCellVol01 ?: "Waiting for data..."}"
                }
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}
