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

/** Returns true if [value] (a Double) is outside the [lower]–[upper] range. */
fun abnormality_check_integer(value: Any?, lower: Int, upper: Int): Boolean =
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
        fun eightBytesRawHexDecode(firstByteCheck: String, vararg positions: Int): (String) -> String? {
            return { data ->
                if (data.length >= 2 * (positions.maxOrNull() ?: 0 + 1) && data.substring(0, 2) == firstByteCheck) {
                    positions.joinToString("") { pos ->
                        data.substring(2 * pos, 2 * pos + 2)
                    }
                } else {
                    null
                }
            }
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
        ParamConfig("CellVol01",               "07", eightBytesDecode("07",   0.0001, 7, 8),                    mutableStateOf(null)),
        ParamConfig("PackCurr",                "09", signedEightBytesDecode("09",0.001, 9, 10, 11, 12),      mutableStateOf(null)),
        ParamConfig("IgnitionStatus",          "11", bitDecode("11",         18,    0),                         mutableStateOf(null)),
        ParamConfig("Mode_Ack",                "02", threeBitDecode(2,        7,     2, 1, 0),                 mutableStateOf(null)),
    
        ParamConfig("CellVol02",               "07", eightBytesDecode("07",   0.0001, 9, 10),                  mutableStateOf(null)),
        ParamConfig("CellVol03",               "07", eightBytesDecode("07",   0.0001, 11, 12),                 mutableStateOf(null)),
        ParamConfig("CellVol04",               "07", eightBytesDecode("07",   0.0001, 11, 12),                 mutableStateOf(null)),
        ParamConfig("CellVol05",               "10", eightBytesDecode("10",   0.0001, 6, 7),                   mutableStateOf(null)),
        ParamConfig("CellVol06",               "10", eightBytesDecode("10",   0.0001, 8, 9),                   mutableStateOf(null)),
        ParamConfig("CellVol07",               "10", eightBytesDecode("10",   0.0001, 10, 11),                 mutableStateOf(null)),
        ParamConfig("CellVol08",               "10", eightBytesDecode("10",   0.0001, 12, 13),                 mutableStateOf(null)),
        ParamConfig("CellVol09",               "08", eightBytesDecode("08",   0.0001, 4, 5),                   mutableStateOf(null)),
        ParamConfig("CellVol10",               "08", eightBytesDecode("08",   0.0001, 6, 7),                   mutableStateOf(null)),
        ParamConfig("CellVol11",               "08", eightBytesDecode("08",   0.0001, 8, 9),                   mutableStateOf(null)),
        ParamConfig("CellVol12",               "08", eightBytesDecode("08",   0.0001, 10, 11),                 mutableStateOf(null)),
        ParamConfig("CellVol13",               "08", eightBytesDecode("08",   0.0001, 12, 13),                 mutableStateOf(null)),
        ParamConfig("CellVol14",               "08", eightBytesDecode("08",   0.0001, 14, 15),                 mutableStateOf(null)),
        ParamConfig("CellVol15",               "08", eightBytesDecode("08",   0.0001, 16, 17),                 mutableStateOf(null)),
        ParamConfig("CellVol16",               "08", eightBytesDecode("08",   0.0001, 18, 19),                 mutableStateOf(null)),
    
        ParamConfig("MaxCellVol",              "09", eightBytesDecode("09",   0.001, 1, 2),                    mutableStateOf(null)),
        ParamConfig("MinCellVol",              "09", eightBytesDecode("09",   0.001, 3, 4),                    mutableStateOf(null)),
        ParamConfig("AvgCellVol",              "09", eightBytesDecode("09",   0.001, 5, 6),                    mutableStateOf(null)),
        ParamConfig("MaxVoltId",               "09", eightBytesDecode("09",   1.0,   7),                       mutableStateOf(null)),
        ParamConfig("MinVoltId",               "09", eightBytesDecode("09",   1.0,   8),                       mutableStateOf(null)),
        ParamConfig("PackVol",                 "09", eightBytesDecode("09",   0.001, 13, 14, 15, 16),         mutableStateOf(null)),
        ParamConfig("CycleCount",              "07", eightBytesDecode("07",   0.001, 15, 16),                 mutableStateOf(null)),
        ParamConfig("CellVolMinMaxDev",        "08", eightBytesDecode("08",   1.0,   2, 3),                   mutableStateOf(null)),
        ParamConfig("SOC",                     "09", eightBytesDecode("09",   1.0,   17),                      mutableStateOf(null)),
        ParamConfig("SOCAh",                   "10", eightBytesDecode("10",   0.001, 1, 2, 3, 4),             mutableStateOf(null)),
        ParamConfig("SOH",                     "09", eightBytesDecode("09",   1.0,   18),                      mutableStateOf(null)),
        ParamConfig("BmsStatus",               "10", eightBytesDecode("10",   1.0,   5),                       mutableStateOf(null)),
        ParamConfig("LedStatus",               "11", eightBytesDecode("11",   1.0,   1),                       mutableStateOf(null)),
        ParamConfig("ActiveCellBalStatus",     "10", eightBytesDecode("10",   1.0,   17, 18, 19),             mutableStateOf(null)),
    
        ParamConfig("BMS_Serial_No_MUX",       "16", eightBytesDecode("16",   1.0,   4),                       mutableStateOf(null)),
        ParamConfig("BMS_Serial_No__1_7",      "16", eightBytesDecode("16",   1.0,   5, 6, 7, 8, 9, 10),      mutableStateOf(null)),
        ParamConfig("LatchProtection",         "11", eightBytesDecode("11",   1.0,   11),                      mutableStateOf(null)),
        ParamConfig("LatchType",               "11", eightBytesDecode("11",   1.0,   12),                      mutableStateOf(null)),
        ParamConfig("ChargerType",             "11", eightBytesDecode("11",   1.0,   13),                      mutableStateOf(null)),
        ParamConfig("PcbTemp",                 "11", signedEightBytesDecode("11",1.0,   14),                    mutableStateOf(null)),
        ParamConfig("AfeTemp",                 "11", signedEightBytesDecode("11",1.0,   15),                    mutableStateOf(null)),
        ParamConfig("CellChemType",            "11", eightBytesDecode("11",   1.0,   16),                      mutableStateOf(null)),
    
        ParamConfig("Chg_Accumulative_Ah",     "12", eightBytesDecode("12",   0.001, 8, 9, 10, 11),           mutableStateOf(null)),
        ParamConfig("Dchg_Accumulative_Ah",    "12", eightBytesDecode("12",   0.001, 12, 13, 14, 15),         mutableStateOf(null)),
        ParamConfig("RefVol",                  "12", eightBytesDecode("12",   0.001, 16, 17),                 mutableStateOf(null)),
        ParamConfig("_3v3Vol",                "12", eightBytesDecode("12",   0.001, 18, 19),                 mutableStateOf(null)),
        ParamConfig("_5vVol",                 "13", eightBytesDecode("13",   0.001, 1, 2),                   mutableStateOf(null)),
        ParamConfig("_12vVol",                "14", eightBytesDecode("14",   0.01,  10, 11, 12, 13),         mutableStateOf(null)),
        ParamConfig("Actual_SoC",             "14", eightBytesDecode("14",   0.01,  10, 11, 12, 13),         mutableStateOf(null)),
        ParamConfig("Usable_Capacity_Ah",      "14", eightBytesDecode("14",   0.001, 14, 15, 16, 17),         mutableStateOf(null)),
        ParamConfig("Battery_Version_ConfigVer","14", eightBytesASCIIDecode("14",2,3,4),                       mutableStateOf(null)),
        ParamConfig("Battery_Version_InternalFWVer","14", eightBytesASCIIDecode("14",5,6,7),                   mutableStateOf(null)),
        ParamConfig("Battery_Version_InternalFWSubVer","14", eightBytesASCIIDecode("14",8,9),                  mutableStateOf(null)),
        ParamConfig("BHB_66049",              "14", eightBytesDecode("14",   1.0,   3,4,5),                 mutableStateOf(null)),
    
        ParamConfig("MaxTemp",                "07", signedEightBytesDecode("07",1.0,   17),                    mutableStateOf(null)),
        ParamConfig("MinTemp",                "07", signedEightBytesDecode("07",1.0,   18),                    mutableStateOf(null)),
        ParamConfig("FetTemp",                "09", signedEightBytesDecode("09",1.0,   19),                    mutableStateOf(null)),
        ParamConfig("Temp1",                  "11", signedEightBytesDecode("11",1.0,   3),                     mutableStateOf(null)),
        ParamConfig("Temp2",                  "11", signedEightBytesDecode("11",1.0,   4),                     mutableStateOf(null)),
        ParamConfig("Temp3",                  "11", signedEightBytesDecode("11",1.0,   5),                     mutableStateOf(null)),
        ParamConfig("Temp4",                  "11", signedEightBytesDecode("11",1.0,   6),                     mutableStateOf(null)),
        ParamConfig("Temp5",                  "11", signedEightBytesDecode("11",1.0,   7),                     mutableStateOf(null)),
        ParamConfig("Temp6",                  "11", signedEightBytesDecode("11",1.0,   8),                     mutableStateOf(null)),
        ParamConfig("Temp7",                  "11", signedEightBytesDecode("11",1.0,   9),                     mutableStateOf(null)),
        ParamConfig("Temp8",                  "11", signedEightBytesDecode("11",1.0,   10),                    mutableStateOf(null)),
    
        ParamConfig("Battery_Version_HwVer",  "06", eightBytesASCIIDecode("06", 10,11,12),                   mutableStateOf(null)),
        ParamConfig("Battery_Version_FwVer",  "06", eightBytesASCIIDecode("06", 13,14,15),                   mutableStateOf(null)),
        ParamConfig("Battery_Version_FWSubVer","06", eightBytesASCIIDecode("06", 16,17),                       mutableStateOf(null)),
    
        ParamConfig("BtStatus_NC0PSM1CC2CV3Finish4","17", eightBytesDecode("17",1.0,9),                      mutableStateOf(null)),
        ParamConfig("Bt_liveMsg1Temp",        "17", signedEightBytesDecode("17",1.0,10),                   mutableStateOf(null)),
        ParamConfig("Bt_liveMsg_soc",         "17", eightBytesDecode("17",1.0,11),                         mutableStateOf(null)),
        ParamConfig("BMS_status",             "17", eightBytesDecode("17",1.0,12),                         mutableStateOf(null)),
        ParamConfig("Demand_voltage",         "17", eightBytesDecode("17",0.01,13,14),                     mutableStateOf(null)),
        ParamConfig("Demand_Current",         "17", eightBytesDecode("17",0.01,15,16),                     mutableStateOf(null)),
        ParamConfig("MaxChgVoltgae",          "18", eightBytesDecode("18",0.01,14,15),                     mutableStateOf(null)),
        ParamConfig("MaxChgCurrent",          "18", eightBytesDecode("18",0.01,16,17),                     mutableStateOf(null)),
        ParamConfig("ActualChgVoltage",       "18", eightBytesDecode("18",0.01,18,19),                     mutableStateOf(null)),
        ParamConfig("ActualChgCurrent",       "19", signedEightBytesDecode("19",0.01,1,2),                 mutableStateOf(null)),
        ParamConfig("Charging_end_cutoff_Curr","17", eightBytesDecode("17",0.01,17,18),                     mutableStateOf(null)),
        ParamConfig("CHB_258",                "20", eightBytesDecode("20",1.0,8,9),                         mutableStateOf(null)),
        ParamConfig("ChgrNC0PSM1CC2CV3Finsh4","19", eightBytesDecode("19",1.0,11),                        mutableStateOf(null)),
        ParamConfig("chgr_msg_temp",          "19", eightBytesDecode("19",1.0,12),                        mutableStateOf(null)),
        ParamConfig("ChgStatus_chg_idle",     "19", eightBytesDecode("19",1.0,14),                        mutableStateOf(null)),
        ParamConfig("chgrLiveMsgChgVolt",     "19", eightBytesDecode("19",0.01,15,16),                    mutableStateOf(null)),
        ParamConfig("chgrLiveMsgChgCurrent",  "19", eightBytesDecode("19",0.01,17,18),                    mutableStateOf(null)),
    
        ParamConfig("ChargeSOP",              "13", eightBytesDecode("13",1.0,5,6,7,8),                   mutableStateOf(null)),
        ParamConfig("DchgSOP",                "13", eightBytesDecode("13",1.0,9,10,11,12),                mutableStateOf(null)),
        ParamConfig("Drive_Error_Flag",       "02", eightBytesDecode("02",1.0,11),                        mutableStateOf(null)),
        ParamConfig("Set_Regen",              "03", eightBytesDecode("03",1.0,13),                        mutableStateOf(null)),
        ParamConfig("DCcurrentlimit",         "03", eightBytesDecode("03",1.0,14),                        mutableStateOf(null)),
        ParamConfig("Custom_freq",            "03", eightBytesDecode("03",1.0,17,16),                     mutableStateOf(null)),
        ParamConfig("Custom_torque",          "03", eightBytesDecode("03",1.0,18),                        mutableStateOf(null)),
        ParamConfig("Buffer_speed",           "03", eightBytesDecode("03",1.0,3,2),                       mutableStateOf(null)),
        ParamConfig("Base_speed",             "04", eightBytesDecode("04",1.0,5,4),                       mutableStateOf(null)),
        ParamConfig("Initial_torque",         "04", eightBytesDecode("04",1.0,19),                        mutableStateOf(null)),
        ParamConfig("Final_torque",           "04", eightBytesDecode("04",1.0,1),                         mutableStateOf(null)),
        ParamConfig("Cluster_odo",            "05", eightBytesDecode("05",0.1,14,15),                     mutableStateOf(null)),
        ParamConfig("MotorSpeed",             "01", eightBytesDecode("01",1.0,2,1),                       mutableStateOf(null)),
        ParamConfig("BatteryVoltage",         "01", eightBytesDecode("01",1.0,3),                         mutableStateOf(null)),
        ParamConfig("BatteryCurrent",         "01", eightBytesDecode("01",1.0,5,4),                       mutableStateOf(null)),
        ParamConfig("AC_Current",             "01", eightBytesDecode("01",1.0,14,15),                     mutableStateOf(null)),
        ParamConfig("AC_Voltage",             "02", eightBytesDecode("02",1.0,5,4),                       mutableStateOf(null)),
        ParamConfig("Throttle",               "02", eightBytesDecode("02",1.0,6),                         mutableStateOf(null)),
        ParamConfig("MCU_Temperature",        "02", eightBytesDecode("02",1.0,15,14),                     mutableStateOf(null)),
        ParamConfig("Motor_Temperature",      "02", eightBytesDecode("02",1.0,16),                        mutableStateOf(null)),
        ParamConfig("MCU_Fault_Code",         "02", eightBytesDecode("02",1.0,17),                        mutableStateOf(null)),
        ParamConfig("MCU_ID",                 "02", eightBytesDecode("02",1.0,19,18),                     mutableStateOf(null)),
        ParamConfig("Cluster_heartbeat",      "05", eightBytesDecode("05",1.0,5),                         mutableStateOf(null)),
        ParamConfig("Cluster_Version_Software","05", eightBytesDecode("05",1.0,9),                         mutableStateOf(null)),
        ParamConfig("Cluster_Version_Hardware","05", eightBytesRawHexDecode("05",10),                       mutableStateOf(null)),
        ParamConfig("MCU_Version_Firmware_Id","04", eightBytesASCIIDecode("04",8,9,10,11,12,13,14,15),    mutableStateOf(null)),
    
        ParamConfig("Charger_Version_Hardware_MAJ","20", eightBytesASCIIDecode("20",1),                    mutableStateOf(null)),
        ParamConfig("Charger_Version_Hardware_MIN","20", eightBytesDecode("20",1.0,2),                       mutableStateOf(null)),
        ParamConfig("Charger_Version_Software_MAJ","20", eightBytesASCIIDecode("20",3),                      mutableStateOf(null)),
        ParamConfig("Charger_Version_Software_MIN","20", eightBytesDecode("20",1.0,4),                       mutableStateOf(null)),
    
        // all your bitDecode-based flags:
        ParamConfig("LoadDetection",           "11", bitDecode("11",18,6),                                 mutableStateOf(null)),
        ParamConfig("Keystatus",               "11", bitDecode("11",19,0),                                 mutableStateOf(null)),
        ParamConfig("Keyevents",               "06", bitDecode("06",18,1),                                 mutableStateOf(null)),
        ParamConfig("CellUnderVolProt",        "10", bitDecode("10",14,0),                                 mutableStateOf(null)),
        ParamConfig("CellOverVolProt",         "10", bitDecode("10",14,1),                                 mutableStateOf(null)),
        ParamConfig("PackUnderVolProt",        "10", bitDecode("10",14,2),                                 mutableStateOf(null)),
        ParamConfig("PackOverVolProt",         "10", bitDecode("10",14,3),                                 mutableStateOf(null)),
        ParamConfig("ChgUnderTempProt",        "10", bitDecode("10",14,4),                                 mutableStateOf(null)),
        ParamConfig("ChgOverTempProt",         "10", bitDecode("10",14,5),                                 mutableStateOf(null)),
        ParamConfig("DchgUnderTempProt",       "10", bitDecode("10",14,6),                                 mutableStateOf(null)),
        ParamConfig("DchgOverTempProt",        "10", bitDecode("10",14,7),                                 mutableStateOf(null)),
        ParamConfig("CellOverDevProt",         "10", bitDecode("10",15,0),                                 mutableStateOf(null)),
        ParamConfig("BattLowSocWarn",          "10", bitDecode("10",15,1),                                 mutableStateOf(null)),
        ParamConfig("ChgOverCurrProt",         "10", bitDecode("10",15,2),                                 mutableStateOf(null)),
        ParamConfig("DchgOverCurrProt",        "10", bitDecode("10",15,3),                                 mutableStateOf(null)),
        ParamConfig("CellUnderVolWarn",        "10", bitDecode("10",15,4),                                 mutableStateOf(null)),
        ParamConfig("CellOverVolWarn",         "10", bitDecode("10",15,5),                                 mutableStateOf(null)),
        ParamConfig("FetTempProt",             "10", bitDecode("10",15,6),                                 mutableStateOf(null)),
        ParamConfig("ResSocProt",              "10", bitDecode("10",15,7),                                 mutableStateOf(null)),
        ParamConfig("FetFailure",              "11", bitDecode("11",16,0),                                 mutableStateOf(null)),
        ParamConfig("TempSenseFault",          "10", bitDecode("10",16,1),                                 mutableStateOf(null)),
        ParamConfig("PackUnderVolWarn",        "10", bitDecode("10",16,2),                                 mutableStateOf(null)),
        ParamConfig("PackOverVolWarn",         "10", bitDecode("10",16,3),                                 mutableStateOf(null)),
        ParamConfig("ChgUnderTempWarn",        "10", bitDecode("10",16,4),                                 mutableStateOf(null)),
        ParamConfig("ChgOverTempWarn",         "10", bitDecode("10",16,5),                                 mutableStateOf(null)),
        ParamConfig("DchgUnderTempWarn",       "10", bitDecode("10",16,6),                                 mutableStateOf(null)),
        ParamConfig("DchgOverTempWarn",        "10", bitDecode("10",16,7),                                 mutableStateOf(null)),
    
        ParamConfig("PreChgFetStatus",         "11", bitDecode("11",2,0),                                  mutableStateOf(null)),
        ParamConfig("ChgFetStatus",            "11", bitDecode("11",2,1),                                  mutableStateOf(null)),
        ParamConfig("DchgFetStatus",           "11", bitDecode("11",2,2),                                  mutableStateOf(null)),
        ParamConfig("ResStatus",               "11", bitDecode("11",2,3),                                  mutableStateOf(null)),
        ParamConfig("ShortCktProt",            "11", bitDecode("11",2,7),                                  mutableStateOf(null)),
        ParamConfig("DschgPeakProt",           "11", bitDecode("11",2,6),                                  mutableStateOf(null)),
        ParamConfig("ChgAuth",                 "11", bitDecode("11",2,4),                                  mutableStateOf(null)),
        ParamConfig("ChgPeakProt",             "11", bitDecode("11",2,5),                                  mutableStateOf(null)),
    
        ParamConfig("DI1",                     "11", bitDecode("11",18,1),                                 mutableStateOf(null)),
        ParamConfig("DI2",                     "11", bitDecode("11",18,2),                                 mutableStateOf(null)),
        ParamConfig("DO1",                     "11", bitDecode("11",18,3),                                 mutableStateOf(null)),
        ParamConfig("DO2",                     "11", bitDecode("11",18,4),                                 mutableStateOf(null)),
        ParamConfig("ChargerDetection",        "11", bitDecode("11",18,5),                                 mutableStateOf(null)),
        ParamConfig("CanCommDetection",        "11", bitDecode("11",18,7),                                 mutableStateOf(null)),
        ParamConfig("CellBalFeatureStatus",    "11", bitDecode("11",16,0),                                 mutableStateOf(null)),
        ParamConfig("ImmoChg",                 "11", bitDecode("11",16,1),                                 mutableStateOf(null)),
        ParamConfig("ImmoDchg",                "11", bitDecode("11",16,2),                                 mutableStateOf(null)),
        ParamConfig("BuzzerStatus",            "11", bitDecode("11",16,3),                                 mutableStateOf(null)),
    
        ParamConfig("Side_Stand_Ack",          "02", bitDecode("02",7,3),                                  mutableStateOf(null)),
        ParamConfig("Direction_Ack",           "02", bitDecode("02",7,4),                                  mutableStateOf(null)),
        ParamConfig("Ride_Ack",                "02", bitDecode("02",7,5),                                  mutableStateOf(null)),
        ParamConfig("Hill_hold_Ack",           "02", bitDecode("02",7,6),                                  mutableStateOf(null)),
        ParamConfig("Wakeup_Ack",              "02", bitDecode("02",7,7),                                  mutableStateOf(null)),
    
        ParamConfig("DriveError_Motor_hall",   "02", bitDecode("02",8,0),                                  mutableStateOf(null)),
        ParamConfig("Motor_Stalling",          "02", bitDecode("02",8,1),                                  mutableStateOf(null)),
        ParamConfig("Motor_Phase_loss",        "02", bitDecode("02",8,2),                                  mutableStateOf(null)),
        ParamConfig("Controller_Over_Temeprature","02", bitDecode("02",8,3),                              mutableStateOf(null)),
        ParamConfig("Motor_Over_Temeprature",  "02", bitDecode("02",8,4),                                  mutableStateOf(null)),
        ParamConfig("Throttle_Error",          "02", bitDecode("02",8,5),                                  mutableStateOf(null)),
        ParamConfig("MOSFET_Protection",       "02", bitDecode("02",8,6),                                  mutableStateOf(null)),
    
        ParamConfig("DriveStatus_Regenerative_Braking","02", bitDecode("02",9,0),                      mutableStateOf(null)),
        ParamConfig("ModeR_Pulse",             "02", bitDecode("02",9,1),                                  mutableStateOf(null)),
        ParamConfig("ModeL_Pulse",             "02", bitDecode("02",9,2),                                  mutableStateOf(null)),
        ParamConfig("Brake_Pulse",             "02", bitDecode("02",9,3),                                  mutableStateOf(null)),
        ParamConfig("Park_Pulse",              "02", bitDecode("02",9,4),                                  mutableStateOf(null)),
        ParamConfig("Reverse_Pulse",           "02", bitDecode("02",9,5),                                  mutableStateOf(null)),
        ParamConfig("SideStand_Pulse",         "02", bitDecode("02",9,6),                                  mutableStateOf(null)),
        ParamConfig("ForwardParking_Mode_Ack","02", bitDecode("02",9,7),                                  mutableStateOf(null)),
    
        ParamConfig("DriveError_Controller_OverVoltag","02", bitDecode("02",10,0),                       mutableStateOf(null)),
        ParamConfig("Controller_Undervoltage","02", bitDecode("02",10,1),                                mutableStateOf(null)),
        ParamConfig("Overcurrent_Fault",       "02", bitDecode("02",10,2),                                mutableStateOf(null)),
    
        ParamConfig("DriveStatus1_ride",       "03", bitDecode("03",11,0),                                mutableStateOf(null)),
        ParamConfig("Wakeup_Request",          "03", bitDecode("03",11,2),                                mutableStateOf(null)),
        ParamConfig("Hill_Hold",               "03", bitDecode("03",11,3),                                mutableStateOf(null)),
        ParamConfig("Reverse_REQUEST",         "03", bitDecode("03",12,0),                                mutableStateOf(null)),
        ParamConfig("Forward_parkingmode_REQUEST","03", bitDecode("03",12,1),                              mutableStateOf(null)),
        ParamConfig("Side_stand_Req",          "03", bitDecode("03",11,1),                                mutableStateOf(null)),
        ParamConfig("Battery_charge_logic",    "05", bitDecode("05",16,1),                                mutableStateOf(null)),
        ParamConfig("Remote_cutoff",            "06", bitDecode("06",2,0),                                 mutableStateOf(null)),
        ParamConfig("mode_limit",              "06", bitDecode("06",2,1),                                 mutableStateOf(null)),
        ParamConfig("Geo_fencebuzzer",         "06", bitDecode("06",2,2),                                 mutableStateOf(null)),
        ParamConfig("Holiday_mode",            "06", bitDecode("06",2,3),                                 mutableStateOf(null)),
        ParamConfig("Service_request",         "06", bitDecode("06",2,4),                                 mutableStateOf(null)),
        ParamConfig("Low_Mode_REQUEST",        "03", bitDecode("03",11,4),                                mutableStateOf(null)),
        ParamConfig("Medium_Mode_REQUEST",     "03", bitDecode("03",11,5),                                mutableStateOf(null)),
        ParamConfig("User_defind_mode_High_REQUEST","03", bitDecode("03",11,6),                          mutableStateOf(null)),
        ParamConfig("Limp_mode_REQUEST",       "03", bitDecode("03",11,7),                                mutableStateOf(null)),

        ParamConfig("Battery_disconnected","19", bitDecode("19",19,0),                          mutableStateOf(null)),
        ParamConfig("AC_Voltage_out_of_range","19", bitDecode("19",19,1),                          mutableStateOf(null)),
        ParamConfig("AC_Frequency_out_of_range","19", bitDecode("19",19,2),                          mutableStateOf(null)),
        ParamConfig("Charger_short_ckt","19", bitDecode("19",19,3),                          mutableStateOf(null)),
        ParamConfig("Current_derate_due_to_temp","19", bitDecode("19",19,4),                          mutableStateOf(null)),
        ParamConfig("Charger_Over_under_temp","19", bitDecode("19",19,5),                          mutableStateOf(null)),
        ParamConfig("Battery_reverse_connection","19", bitDecode("19",19,6),                          mutableStateOf(null)),
        ParamConfig("CHG_Communication_fault","19", bitDecode("19",19,7),                          mutableStateOf(null))
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

    // <-- NEW: scroll state for the error box
    val errorScroll = rememberScrollState()

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
            val errorFlags = configs.filter { config ->
                config.state.value == 1 && config.name in setOf(
                    "Throttle_Error", "Overcurrent_Fault",
                    "DriveError_Motor_hall", "Motor_Stalling", "Motor_Phase_loss",
                    "Controller_Over_Temeprature", "Motor_Over_Temeprature",
                    "MOSFET_Protection", "DriveError_Controller_OverVoltag",
                    "Controller_Undervoltage", "Drive_Error_Flag",
                    "CellUnderVolProt", "CellOverVolProt", "PackUnderVolProt", "PackOverVolProt",
                    "ChgUnderTempProt", "ChgOverTempProt", "DchgUnderTempProt", "DchgOverTempProt",
                    "CellOverDevProt", "ChgOverCurrProt", "DchgOverCurrProt",
                    "FetTempProt", "ResSocProt", "FetFailure", "TempSenseFault",
                    "ShortCktProt", "DschgPeakProt", "ChgPeakProt", "Battery_disconnected",
                    "AC_Voltage_out_of_range", "AC_Frequency_out_of_range", "Charger_short_ckt",
                    "Current_derate_due_to_temp","Charger_Over_under_temp", "Battery_reverse_connection",
                    "CHG_Communication_fault"
                )
            }            
            
            val abnormalTemps = configs.filter {
                (it.name == "Cluster_heartbeat"     && abnormality_check_integer(it.state.value, 255,    255))    ||
                (it.name == "MCU_Temperature"      && abnormality_check(it.state.value, -1000.0, 110.0))  ||
                (it.name == "Motor_Temperature"    && abnormality_check(it.state.value, -1000.0, 170.0))  ||
                (it.name == "MaxTemp"              && abnormality_check(it.state.value, -1000.0, 61.9))   ||
                (it.name == "MinTemp"              && abnormality_check(it.state.value, 0.1,      1000.0))||
                (it.name == "MaxCellVol"           && abnormality_check(it.state.value, -1000.0, 3.64))   ||
                (it.name == "MinCellVol"           && abnormality_check(it.state.value, 2.91,    1000.0))||
                (it.name == "FetTemp"              && abnormality_check(it.state.value, -1000.0, 79.9))   ||
                (it.name == "CellVolMinMaxDev"     && abnormality_check(it.state.value, -1000.0, 299.9)) ||
                (it.name == "PackCurr"             && abnormality_check(it.state.value, -1000.0, 61.9)) ||
                (it.name == "PackVol"              && abnormality_check(it.state.value, 46.5,     56.9))
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
                    Column(
                        Modifier
                            .fillMaxSize()
                            .verticalScroll(errorScroll)  // <— make this scrollable
                    ) {
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
