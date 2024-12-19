package com.lectrix_ble_mobileapp

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import java.io.FileOutputStream
import java.io.IOException

class FileSaveModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var outputStream: FileOutputStream? = null
    private var uri: Uri? = null

    companion object {
        const val CREATE_FILE_REQUEST_CODE = 1
    }

    override fun getName(): String {
        return "FileSaveModule"
    }

    @ReactMethod
    fun chooseLocation(promise: Promise) {
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/csv"
            putExtra(Intent.EXTRA_TITLE, "data.csv")
        }

        val activity = currentActivity
        activity?.startActivityForResult(intent, CREATE_FILE_REQUEST_CODE, null)
        reactApplicationContext.addActivityEventListener(object : BaseActivityEventListener() {
            override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
                if (requestCode == CREATE_FILE_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
                    uri = data?.data
                    promise.resolve(uri.toString())
                    startNewFileWithHeader()
                } else {
                    promise.reject("ERROR", "Failed to choose location or operation was cancelled.")
                }
            }
        })
    }

    private fun startNewFileWithHeader() {
        try {
            uri?.let {
                outputStream = reactApplicationContext.contentResolver.openOutputStream(it) as FileOutputStream
                // Create a header for just time_stamp and CellVoltage01 for now
                val header = "LocalTime,CellVol01,CellVol02,CellVol03,CellVol04,CellVol05,CellVol06,CellVol07,CellVol08,CellVol09,CellVol10,CellVol11,CellVol12,CellVol13,CellVol14,CellVol15,CellVol16,MaxCellVol,MinCellVol,AvgCellVol,MaxVoltId,MinVoltId,PackVol,CycleCount,CellVolMinMaxDev,SOC,SOCAh,SOH,BmsStatus,LedStatus,ActiveCellBalStatus,BMS_Serial_No_MUX,BMS_Serial_No__1_7,LatchProtection,LatchType,ChargerType,PcbTemp,AfeTemp,CellChemType,Chg_Accumulative_Ah,Dchg_Accumulative_Ah,RefVol,_3v3Vol,_5vVol,_12vVol,Actual_SoC,Usable_Capacity_Ah,ConfigVer,InternalFWVer,InternalFWSubVer,BHB_66049,PackCurr,MaxTemp,MinTemp,FetTemp,Temp1,Temp2,Temp3,Temp4,Temp5,Temp6,Temp7,Temp8,HwVer,FwVer,FWSubVer,BtStatus_NC0PSM1CC2CV3Finish4,Bt_liveMsg1Temp,Bt_liveMsg_soc,BMS_status,Demand_voltage,Demand_Current,MaxChgVoltgae,MaxChgCurrent,ActualChgVoltage,ActualChgCurrent,Charging_end_cutoff_Curr,CHB_258,ChgrNC0PSM1CC2CV3Finsh4,chgr_msg_temp,chgStatus_chg_idle,chgrLiveMsgChgVolt,chgrLiveMsgChgCurrent,MotorSpeed,BatteryVoltage,BatteryCurrent,AC_Current,AC_Voltage,Throttle,MCU_Temperature,Motor_Temperature,MCU_Fault_Code,MCU_ID,Cluster_heartbeat,Odo_Cluster,IgnitionStatus,LoadDetection,Keystatus,keyevents,CellUnderVolProt,CellOverVolProt,PackUnderVolProt,PackOverVolProt,ChgUnderTempProt,ChgOverTempProt,DchgUnderTempProt,DchgOverTempProt,CellOverDevProt,BattLowSocWarn,ChgOverCurrProt,DchgOverCurrProt,CellUnderVolWarn,CellOverVolWarn,FetTempProt,ResSocProt,FetFailure,TempSenseFault,PackUnderVolWarn,PackOverVolWarn,ChgUnderTempWarn,ChgOverTempWarn,DchgUnderTempWarn,DchgOverTempWarn,PreChgFetStatus,ChgFetStatus,DchgFetStatus,ResStatus,ShortCktProt,DschgPeakProt,ChgAuth,ChgPeakProt,DI1,DI2,DO1,DO2,ChargerDetection,CanCommDetection,CellBalFeatureStatus,ImmoChg,ImmoDchg,BuzzerStatus,Side_Stand_Ack,Direction_Ack,Ride_Ack,Hill_hold_Ack,Wakeup_Ack,DriveError_Motor_hall,Motor_Stalling,Motor_Phase_loss,Controller_Over_Temperature,Motor_Over_Temperature,Throttle_Error,MOSFET_Protection,DriveStatus_Regenerative_Braking,ModeR_Pulse,ModeL_Pulse,Brake_Pulse,Park_Pulse,Reverse_Pulse,SideStand_Pulse,ForwardParking_Mode_Ack,DriveError_Controller_OverVoltage,Controller_Undervoltage,Overcurrent_Fault,DriveStatus1_ride,Wakeup_Request,Hill_Hold,Reverse_REQUEST,Forward_parkingmode_REQUEST,Side_stand_Req,Battery_charge_logic,Remote_cutoff,mode_limit,Geo_fencebuzzer,Holiday_mode,Service_request,Low_Mode_REQUEST,Medium_Mode_REQUEST,User_defined_mode_High_REQUEST,Limp_mode_REQUEST,ChargeSOP,DchgSOP,Drive_Error_Flag,Set_Regen,DCcurrentlimit,Custom_freq,Custom_torque,Buffer_speed,Base_speed,Initial_torque,Final_torque,Cluster_odo,Mode_Ack\n"
                outputStream?.write(header.toByteArray())
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }    

    @ReactMethod
    fun startRecording() {
        if (outputStream == null && uri != null) {
            startNewFileWithHeader()
        }
    }

    @ReactMethod
    fun writeData(data: String) {
        Log.d("FileSaveModule", "Attempting to write data: $data")
        try {
            outputStream?.let {
                it.write((data + "\n").toByteArray())
                it.flush()  // Ensure data is written to the file immediately
                Log.d("FileSaveModule", "Data written successfully")
            } ?: Log.e("FileSaveModule", "OutputStream not initialized")
        } catch (e: IOException) {
            Log.e("FileSaveModule", "Error writing data", e)
        }
    }    

    @ReactMethod
    fun stopRecording() {
        try {
            outputStream?.close()
            outputStream = null
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun shareFile(fileUriString: String, promise: Promise) {
        try {
            val fileUri = Uri.parse(fileUriString)
            val shareIntent = Intent().apply {
                action = Intent.ACTION_SEND
                putExtra(Intent.EXTRA_STREAM, fileUri)
                type = "text/csv"
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val chooserIntent = Intent.createChooser(shareIntent, "Share CSV File")
            chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(chooserIntent)
            promise.resolve("File shared successfully")
        } catch (e: Exception) {
            promise.reject("ERROR_SHARING_FILE", "Failed to share file", e)
        }
    }

    @ReactMethod
    fun viewFile(fileUriString: String, promise: Promise) {
        try {
            val fileUri = Uri.parse(fileUriString)
            val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(fileUri, "text/csv")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val chooserIntent = Intent.createChooser(viewIntent, "Open With")
            chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(chooserIntent)
            promise.resolve("File opened successfully")
        } catch (e: Exception) {
            promise.reject("ERROR_OPENING_FILE", "Failed to open file", e)
        }
    }
}
