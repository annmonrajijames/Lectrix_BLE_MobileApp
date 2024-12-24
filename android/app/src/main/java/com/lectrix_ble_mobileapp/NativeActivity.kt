package com.lectrix_ble_mobileapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class NativeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_native) // Ensure you have a layout file 'activity_native.xml'
    }
}
