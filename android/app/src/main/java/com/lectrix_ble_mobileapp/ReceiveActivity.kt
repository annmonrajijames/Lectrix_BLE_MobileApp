package com.lectrix_ble_mobileapp

import android.bluetooth.*
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class ReceiveActivity : AppCompatActivity() {
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    private lateinit var dataReceivedView: TextView

    companion object {
        const val DEVICE_ADDRESS = "DEVICE_ADDRESS"
        val SERVICE_UUID: UUID = UUID.fromString("0000ff00-0000-1000-8000-00805f9b34fb")
        val CHARACTERISTIC_UUID: UUID = UUID.fromString("0000ff01-0000-1000-8000-00805f9b34fb")
        const val TAG = "ReceiveActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receive)

        dataReceivedView = findViewById(R.id.dataReceivedView)

        val deviceAddress = intent.getStringExtra(DEVICE_ADDRESS)
        if (deviceAddress != null) {
            Log.d(TAG, "Received device address: $deviceAddress")
            setupBluetooth(deviceAddress)
        } else {
            dataReceivedView.text = "Device address not provided"
            Log.e(TAG, "No device address provided in intent extras")
        }
    }

    private fun setupBluetooth(deviceAddress: String) {
        bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter

        val device = bluetoothAdapter.getRemoteDevice(deviceAddress)
        Log.d(TAG, "BluetoothDevice created: $device")
        connectToDevice(device)
    }

    private fun connectToDevice(device: BluetoothDevice) {
        bluetoothGatt = device.connectGatt(this, false, object : BluetoothGattCallback() {
            override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
                Log.d(TAG, "Connection State Change: Status $status New State $newState")
                if (newState == BluetoothProfile.STATE_CONNECTED) {
                    gatt.discoverServices()
                } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                    runOnUiThread { dataReceivedView.text = "Disconnected" }
                }
            }

            override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                Log.d(TAG, "Services Discovered: Status $status")
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
                        Log.d(TAG, "Service and Characteristic found and notifications set")
                    } else {
                        runOnUiThread { dataReceivedView.text = "Service/Characteristic not found" }
                        Log.e(TAG, "Service or Characteristic not found")
                    }
                } else {
                    runOnUiThread { dataReceivedView.text = "Service discovery failed" }
                }
            }

            override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
                val data = characteristic.value.toString(Charsets.UTF_8)
                runOnUiThread {
                    dataReceivedView.text = "Data Received: $data"
                }
                Log.d(TAG, "Characteristic Changed: $data")
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}
