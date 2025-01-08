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

    private var lastValidLoadDetection: Int? = null
    private var lastValidKeystatus: Int? = null
    private var lastValidKeyevents: Int? = null
    private var lastValidCellUnderVolProt: Int? = null
    private var lastValidCellOverVolProt: Int? = null
    private var lastValidPackUnderVolProt: Int? = null
    private var lastValidPackOverVolProt: Int? = null
    private var lastValidChgUnderTempProt: Int? = null
    private var lastValidChgOverTempProt: Int? = null
    private var lastValidDchgUnderTempProt: Int? = null
    private var lastValidDchgOverTempProt: Int? = null
    private var lastValidCellOverDevProt: Int? = null
    private var lastValidBattLowSocWarn: Int? = null
    private var lastValidChgOverCurrProt: Int? = null
    private var lastValidDchgOverCurrProt: Int? = null
    private var lastValidCellUnderVolWarn: Int? = null
    private var lastValidCellOverVolWarn: Int? = null
    private var lastValidFetTempProt: Int? = null
    private var lastValidResSocProt: Int? = null
    private var lastValidFetFailure: Int? = null
    private var lastValidTempSenseFault: Int? = null
    private var lastValidPackUnderVolWarn: Int? = null
    private var lastValidPackOverVolWarn: Int? = null
    private var lastValidChgUnderTempWarn: Int? = null
    private var lastValidChgOverTempWarn: Int? = null
    private var lastValidDchgUnderTempWarn: Int? = null
    private var lastValidDchgOverTempWarn: Int? = null
    private var lastValidPreChgFetStatus: Int? = null
    private var lastValidChgFetStatus: Int? = null
    private var lastValidDchgFetStatus: Int? = null
    private var lastValidResStatus: Int? = null
    private var lastValidShortCktProt: Int? = null
    private var lastValidDschgPeakProt: Int? = null
    private var lastValidChgAuth: Int? = null
    private var lastValidChgPeakProt: Int? = null
    private var lastValidDI1: Int? = null
    private var lastValidDI2: Int? = null
    private var lastValidDO1: Int? = null
    private var lastValidDO2: Int? = null
    private var lastValidChargerDetection: Int? = null
    private var lastValidCanCommDetection: Int? = null
    private var lastValidCellBalFeatureStatus: Int? = null
    private var lastValidImmoChg: Int? = null
    private var lastValidImmoDchg: Int? = null
    private var lastValidBuzzerStatus: Int? = null
    private var lastValidSide_Stand_Ack: Int? = null
    private var lastValidDirection_Ack: Int? = null
    private var lastValidRide_Ack: Int? = null
    private var lastValidHill_hold_Ack: Int? = null
    private var lastValidWakeup_Ack: Int? = null
    private var lastValidDriveError_Motor_hall: Int? = null
    private var lastValidMotor_Stalling: Int? = null
    private var lastValidMotor_Phase_loss: Int? = null
    private var lastValidController_Over_Temperature: Int? = null
    private var lastValidMotor_Over_Temperature: Int? = null
    private var lastValidThrottle_Error: Int? = null
    private var lastValidMOSFET_Protection: Int? = null
    private var lastValidDriveStatus_Regenerative_Braking: Int? = null
    private var lastValidModeR_Pulse: Int? = null
    private var lastValidModeL_Pulse: Int? = null
    private var lastValidBrake_Pulse: Int? = null
    private var lastValidPark_Pulse: Int? = null
    private var lastValidReverse_Pulse: Int? = null
    private var lastValidSideStand_Pulse: Int? = null
    private var lastValidForwardParking_Mode_Ack: Int? = null
    private var lastValidDriveError_Controller_OverVoltag: Int? = null
    private var lastValidController_Undervoltage: Int? = null
    private var lastValidOvercurrent_Fault: Int? = null
    private var lastValidDriveStatus1_ride: Int? = null
    private var lastValidWakeup_Request: Int? = null
    private var lastValidHill_Hold: Int? = null
    private var lastValidReverse_REQUEST: Int? = null
    private var lastValidForward_parkingmode_REQUEST: Int? = null
    private var lastValidSide_stand_Req: Int? = null
    private var lastValidBattery_charge_logic: Int? = null
    private var lastValidRemote_cutoff: Int? = null
    private var lastValidmode_limit: Int? = null
    private var lastValidGeo_fencebuzzer: Int? = null
    private var lastValidHoliday_mode: Int? = null
    private var lastValidService_request: Int? = null
    private var lastValidLow_Mode_REQUEST: Int? = null
    private var lastValidMedium_Mode_REQUEST: Int? = null
    private var lastValidUser_defind_mode_High_REQUEST: Int? = null
    private var lastValidLimp_mode_REQUEST: Int? = null
    
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

        val CellVol02Decoder = eightBytesDecode("07", 0.0001, 9, 10)
        val CellVol03Decoder = eightBytesDecode("07", 0.0001, 11, 12)
        val CellVol04Decoder = eightBytesDecode("07", 0.0001, 11, 12)
        val CellVol05Decoder = eightBytesDecode("10", 0.0001, 6, 7)
        val CellVol06Decoder = eightBytesDecode("10", 0.0001, 8, 9)
        val CellVol07Decoder = eightBytesDecode("10", 0.0001, 10, 11)
        val CellVol08Decoder = eightBytesDecode("10", 0.0001, 12, 13)
        val CellVol09Decoder = eightBytesDecode("08", 0.0001, 4, 5)
        val CellVol10Decoder = eightBytesDecode("08", 0.0001, 6, 7)
        val CellVol11Decoder = eightBytesDecode("08", 0.0001, 8, 9)
        val CellVol12Decoder = eightBytesDecode("08", 0.0001, 10, 11)
        val CellVol13Decoder = eightBytesDecode("08", 0.0001, 12, 13)
        val CellVol14Decoder = eightBytesDecode("08", 0.0001, 14, 15)
        val CellVol15Decoder = eightBytesDecode("08", 0.0001, 16, 17)
        val CellVol16Decoder = eightBytesDecode("08", 0.0001, 18, 19)
        val MaxCellVolDecoder = eightBytesDecode("09", 0.001, 1, 2)
        val MinCellVolDecoder = eightBytesDecode("09", 0.001, 3, 4)
        val AvgCellVolDecoder = eightBytesDecode("09", 0.001, 5, 6)
        val MaxVoltIdDecoder = eightBytesDecode("09", 1.0, 7)
        val MinVoltIdDecoder = eightBytesDecode("09", 1.0, 8)
        val PackVolDecoder = eightBytesDecode("09", 0.001, 13, 14, 15, 16)
        val CycleCountDecoder = eightBytesDecode("07", 0.001, 15, 16)
        val CellVolMinMaxDevDecoder = eightBytesDecode("08", 1.0, 2, 3)
        val SOCDecoder = eightBytesDecode("09", 1.0, 17)
        val SOCAhDecoder = eightBytesDecode("10", 0.001, 1, 2, 3, 4)
        val SOHDecoder = eightBytesDecode("09", 1.0, 18)
        val BmsStatusDecoder = eightBytesDecode("10", 1.0, 5)
        val LedStatusDecoder = eightBytesDecode("11", 1.0, 1)
        val ActiveCellBalStatusDecoder = eightBytesDecode("10", 1.0, 17, 18, 19)
        val BMS_Serial_No_MUXDecoder = eightBytesDecode("16", 1.0, 4)
        val BMS_Serial_No__1_7Decoder = eightBytesDecode("16", 1.0, 5, 6, 7, 8, 9, 10)
        val LatchProtectionDecoder = eightBytesDecode("11", 1.0, 11)
        val LatchTypeDecoder = eightBytesDecode("11", 1.0, 12)
        val ChargerTypeDecoder = eightBytesDecode("11", 1.0, 13)
        val PcbTempDecoder = signedEightBytesDecode("11", 1.0, 14)
        val AfeTempDecoder = signedEightBytesDecode("11", 1.0, 15)
        val CellChemTypeDecoder = eightBytesDecode("11", 1.0, 16)
        val Chg_Accumulative_AhDecoder = eightBytesDecode("12", 0.001, 8, 9, 10, 11)
        val Dchg_Accumulative_AhDecoder = eightBytesDecode("12", 0.001, 12, 13, 14, 15)
        val RefVolDecoder = eightBytesDecode("12", 0.001, 16, 17)
        val _3v3VolDecoder = eightBytesDecode("12", 0.001, 18, 19)
        val _5vVolDecoder = eightBytesDecode("13", 0.001, 1, 2)
        val _12vVolDecoder = eightBytesDecode("14", 0.01, 10, 11, 12, 13)
        val Actual_SoCDecoder = eightBytesDecode("14", 0.01, 10, 11, 12, 13)
        val Usable_Capacity_AhDecoder = eightBytesDecode("14", 0.001, 14, 15, 16, 17)
        val ConfigVerDecoder = eightBytesDecode("14", 1.0, 2, 3, 4)
        val InternalFWVerDecoder = eightBytesDecode("14", 1.0, 5, 6, 7)
        val InternalFWSubVerDecoder = eightBytesDecode("14", 1.0, 8, 9)
        val BHB_66049Decoder = eightBytesDecode("14", 1.0, 3, 4, 5)
        val MaxTempDecoder = signedEightBytesDecode("07", 1.0, 17)
        val MinTempDecoder = signedEightBytesDecode("07", 1.0, 18)
        val FetTempDecoder = signedEightBytesDecode("09", 1.0, 19)
        val Temp1Decoder = signedEightBytesDecode("11", 1.0, 3)
        val Temp2Decoder = signedEightBytesDecode("11", 1.0, 4)
        val Temp3Decoder = signedEightBytesDecode("11", 1.0, 5)
        val Temp4Decoder = signedEightBytesDecode("11", 1.0, 6)
        val Temp5Decoder = signedEightBytesDecode("11", 1.0, 7)
        val Temp6Decoder = signedEightBytesDecode("11", 1.0, 8)
        val Temp7Decoder = signedEightBytesDecode("11", 1.0, 9)
        val Temp8Decoder = signedEightBytesDecode("11", 1.0, 10)
        val HwVerDecoder = eightBytesDecode("06", 1.0, 10, 11, 12)
        val FwVerDecoder = eightBytesDecode("06", 1.0, 13, 14, 15)
        val FWSubVerDecoder = eightBytesDecode("06", 1.0, 16, 17)
        val BtStatus_NC0PSM1CC2CV3Finish4Decoder = eightBytesDecode("17", 1.0, 9)
        val Bt_liveMsg1TempDecoder = signedEightBytesDecode("17", 1.0, 10)
        val Bt_liveMsg_socDecoder = eightBytesDecode("17", 1.0, 11)
        val BMS_statusDecoder = eightBytesDecode("17", 1.0, 12)
        val Demand_voltageDecoder = eightBytesDecode("17", 0.01, 13, 14)
        val Demand_CurrentDecoder = eightBytesDecode("17", 0.01, 15, 16)
        val MaxChgVoltgaeDecoder = eightBytesDecode("18", 0.01, 14, 15)
        val MaxChgCurrentDecoder = eightBytesDecode("18", 0.01, 16, 17)
        val ActualChgVoltageDecoder = eightBytesDecode("18", 0.01, 18, 19)
        val ActualChgCurrentDecoder = signedEightBytesDecode("19", 0.01, 1, 2)
        val Charging_end_cutoff_CurrDecoder = eightBytesDecode("17", 0.01, 17, 18)
        val CHB_258Decoder = eightBytesDecode("20", 1.0, 8, 9)
        val ChgrNC0PSM1CC2CV3Finsh4Decoder = eightBytesDecode("19", 1.0, 11)
        val chgr_msg_tempDecoder = eightBytesDecode("19", 1.0, 12)
        val chgStatus_chg_idleDecoder = eightBytesDecode("19", 1.0, 14)
        val chgrLiveMsgChgVoltDecoder = eightBytesDecode("19", 0.01, 15, 16)
        val chgrLiveMsgChgCurrentDecoder = eightBytesDecode("19", 0.01, 17, 18)
        val ChargeSOPDecoder = eightBytesDecode("13", 1.0, 5, 6, 7, 8)
        val DchgSOPDecoder = eightBytesDecode("13", 1.0, 9, 10, 11, 12)
        val Drive_Error_FlagDecoder = eightBytesDecode("02", 1.0, 11)
        val Set_RegenDecoder = eightBytesDecode("03", 1.0, 13)
        val DCcurrentlimitDecoder = eightBytesDecode("03", 1.0, 14)
        val Custom_freqDecoder = eightBytesDecode("03", 1.0, 17, 16)
        val Custom_torqueDecoder = eightBytesDecode("03", 1.0, 18)
        val Buffer_speedDecoder = eightBytesDecode("03", 1.0, 3, 2)
        val Base_speedDecoder = eightBytesDecode("04", 1.0, 5, 4)
        val Initial_torqueDecoder = eightBytesDecode("04", 1.0, 19)
        val Final_torqueDecoder = eightBytesDecode("04", 1.0, 1)
        val Cluster_odoDecoder = eightBytesDecode("05", 1.0, 15, 14, 13)
        val MotorSpeedDecoder = eightBytesDecode("01", 1.0, 2, 1)
        val BatteryVoltageDecoder = eightBytesDecode("01", 1.0, 3)
        val BatteryCurrentDecoder = eightBytesDecode("01", 1.0, 5, 4)
        val AC_CurrentDecoder = eightBytesDecode("01", 1.0, 14, 15)
        val AC_VoltageDecoder = eightBytesDecode("02", 1.0, 5, 4)
        val ThrottleDecoder = eightBytesDecode("02", 1.0, 6)
        val MCU_TemperatureDecoder = eightBytesDecode("02", 1.0, 15, 14)
        val Motor_TemperatureDecoder = eightBytesDecode("02", 1.0, 16)
        val MCU_Fault_CodeDecoder = eightBytesDecode("02", 1.0, 17)
        val MCU_IDDecoder = eightBytesDecode("02", 1.0, 19, 18)
        val Cluster_heartbeatDecoder = eightBytesDecode("05", 1.0, 5)
        val Odo_ClusterDecoder = eightBytesDecode("05", 1.0, 15, 14, 13)

        val LoadDetectionDecoder = bitDecode("11", 18, 6)
        val KeystatusDecoder = bitDecode("11", 19, 0)
        val KeyeventsDecoder = bitDecode("06", 18, 1)
        val CellUnderVolProtDecoder = bitDecode("10", 14, 0)
        val CellOverVolProtDecoder = bitDecode("10", 14, 1)
        val PackUnderVolProtDecoder = bitDecode("10", 14, 2)
        val PackOverVolProtDecoder = bitDecode("10", 14, 3)
        val ChgUnderTempProtDecoder = bitDecode("10", 14, 4)
        val ChgOverTempProtDecoder = bitDecode("10", 14, 5)
        val DchgUnderTempProtDecoder = bitDecode("10", 14, 6)
        val DchgOverTempProtDecoder = bitDecode("10", 14, 7)
        val CellOverDevProtDecoder = bitDecode("10", 15, 0)
        val BattLowSocWarnDecoder = bitDecode("10", 15, 1)
        val ChgOverCurrProtDecoder = bitDecode("10", 15, 2)
        val DchgOverCurrProtDecoder = bitDecode("10", 15, 3)
        val CellUnderVolWarnDecoder = bitDecode("10", 15, 4)
        val CellOverVolWarnDecoder = bitDecode("10", 15, 5)
        val FetTempProtDecoder = bitDecode("10", 15, 6)
        val ResSocProtDecoder = bitDecode("10", 15, 7)
        val FetFailureDecoder = bitDecode("10", 16, 0)
        val TempSenseFaultDecoder = bitDecode("10", 16, 1)
        val PackUnderVolWarnDecoder = bitDecode("10", 16, 2)
        val PackOverVolWarnDecoder = bitDecode("10", 16, 3)
        val ChgUnderTempWarnDecoder = bitDecode("10", 16, 4)
        val ChgOverTempWarnDecoder = bitDecode("10", 16, 5)
        val DchgUnderTempWarnDecoder = bitDecode("10", 16, 6)
        val DchgOverTempWarnDecoder = bitDecode("10", 16, 7)
        val PreChgFetStatusDecoder = bitDecode("11", 2, 0)
        val ChgFetStatusDecoder = bitDecode("11", 2, 1)
        val DchgFetStatusDecoder = bitDecode("11", 2, 2)
        val ResStatusDecoder = bitDecode("11", 2, 3)
        val ShortCktProtDecoder = bitDecode("11", 2, 7)
        val DschgPeakProtDecoder = bitDecode("11", 2, 6)
        val ChgAuthDecoder = bitDecode("11", 2, 4)
        val ChgPeakProtDecoder = bitDecode("11", 2, 5)
        val DI1Decoder = bitDecode("11", 18, 1)
        val DI2Decoder = bitDecode("11", 18, 2)
        val DO1Decoder = bitDecode("11", 18, 3)
        val DO2Decoder = bitDecode("11", 18, 4)
        val ChargerDetectionDecoder = bitDecode("11", 18, 5)
        val CanCommDetectionDecoder = bitDecode("11", 18, 7)
        val CellBalFeatureStatusDecoder = bitDecode("11", 16, 0)
        val ImmoChgDecoder = bitDecode("11", 16, 1)
        val ImmoDchgDecoder = bitDecode("11", 16, 2)
        val BuzzerStatusDecoder = bitDecode("11", 16, 3)
        val Side_Stand_AckDecoder = bitDecode("02", 7, 3)
        val Direction_AckDecoder = bitDecode("02", 7, 4)
        val Ride_AckDecoder = bitDecode("02", 7, 5)
        val Hill_hold_AckDecoder = bitDecode("02", 7, 6)
        val Wakeup_AckDecoder = bitDecode("02", 7, 7)
        val DriveError_Motor_hallDecoder = bitDecode("02", 8, 0)
        val Motor_StallingDecoder = bitDecode("02", 8, 1)
        val Motor_Phase_lossDecoder = bitDecode("02", 8, 2)
        val Controller_Over_TemperatureDecoder = bitDecode("02", 8, 3)
        val Motor_Over_TemperatureDecoder = bitDecode("02", 8, 4)
        val Throttle_ErrorDecoder = bitDecode("02", 8, 5)
        val MOSFET_ProtectionDecoder = bitDecode("02", 8, 6)
        val DriveStatus_Regenerative_BrakingDecoder = bitDecode("02", 9, 0)
        val ModeR_PulseDecoder = bitDecode("02", 9, 1)
        val ModeL_PulseDecoder = bitDecode("02", 9, 2)
        val Brake_PulseDecoder = bitDecode("02", 9, 3)
        val Park_PulseDecoder = bitDecode("02", 9, 4)
        val Reverse_PulseDecoder = bitDecode("02", 9, 5)
        val SideStand_PulseDecoder = bitDecode("02", 9, 6)
        val ForwardParking_Mode_AckDecoder = bitDecode("02", 9, 7)
        val DriveError_Controller_OverVoltagDecoder = bitDecode("02", 10, 0)
        val Controller_UndervoltageDecoder = bitDecode("02", 10, 1)
        val Overcurrent_FaultDecoder = bitDecode("02", 10, 2)
        val DriveStatus1_rideDecoder = bitDecode("03", 11, 0)
        val Wakeup_RequestDecoder = bitDecode("03", 11, 2)
        val Hill_HoldDecoder = bitDecode("03", 11, 3)
        val Reverse_REQUESTDecoder = bitDecode("03", 12, 0)
        val Forward_parkingmode_REQUESTDecoder = bitDecode("03", 12, 1)
        val Side_stand_ReqDecoder = bitDecode("03", 11, 1)
        val Battery_charge_logicDecoder = bitDecode("05", 16, 1)
        val Remote_cutoffDecoder = bitDecode("06", 2, 0)
        val mode_limitDecoder = bitDecode("06", 2, 1)
        val Geo_fencebuzzerDecoder = bitDecode("06", 2, 2)
        val Holiday_modeDecoder = bitDecode("06", 2, 3)
        val Service_requestDecoder = bitDecode("06", 2, 4)
        val Low_Mode_REQUESTDecoder = bitDecode("03", 11, 4)
        val Medium_Mode_REQUESTDecoder = bitDecode("03", 11, 5)
        val User_defind_mode_High_REQUESTDecoder = bitDecode("03", 11, 6)
        val Limp_mode_REQUESTDecoder = bitDecode("03", 11, 7)

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

                val decodedCellVol02 = CellVol02Decoder(hexString)
                val decodedCellVol03 = CellVol03Decoder(hexString)
                val decodedCellVol04 = CellVol04Decoder(hexString)
                val decodedCellVol05 = CellVol05Decoder(hexString)
                val decodedCellVol06 = CellVol06Decoder(hexString)
                val decodedCellVol07 = CellVol07Decoder(hexString)
                val decodedCellVol08 = CellVol08Decoder(hexString)
                val decodedCellVol09 = CellVol09Decoder(hexString)
                val decodedCellVol10 = CellVol10Decoder(hexString)
                val decodedCellVol11 = CellVol11Decoder(hexString)
                val decodedCellVol12 = CellVol12Decoder(hexString)
                val decodedCellVol13 = CellVol13Decoder(hexString)
                val decodedCellVol14 = CellVol14Decoder(hexString)
                val decodedCellVol15 = CellVol15Decoder(hexString)
                val decodedCellVol16 = CellVol16Decoder(hexString)
                val decodedMaxCellVol = MaxCellVolDecoder(hexString)
                val decodedMinCellVol = MinCellVolDecoder(hexString)
                val decodedAvgCellVol = AvgCellVolDecoder(hexString)
                val decodedMaxVoltId = MaxVoltIdDecoder(hexString)
                val decodedMinVoltId = MinVoltIdDecoder(hexString)
                val decodedPackVol = PackVolDecoder(hexString)
                val decodedCycleCount = CycleCountDecoder(hexString)
                val decodedCellVolMinMaxDev = CellVolMinMaxDevDecoder(hexString)
                val decodedSOC = SOCDecoder(hexString)
                val decodedSOCAh = SOCAhDecoder(hexString)
                val decodedSOH = SOHDecoder(hexString)
                val decodedBmsStatus = BmsStatusDecoder(hexString)
                val decodedLedStatus = LedStatusDecoder(hexString)
                val decodedActiveCellBalStatus = ActiveCellBalStatusDecoder(hexString)
                val decodedBMS_Serial_No_MUX = BMS_Serial_No_MUXDecoder(hexString)
                val decodedBMS_Serial_No__1_7 = BMS_Serial_No__1_7Decoder(hexString)
                val decodedLatchProtection = LatchProtectionDecoder(hexString)
                val decodedLatchType = LatchTypeDecoder(hexString)
                val decodedChargerType = ChargerTypeDecoder(hexString)
                val decodedPcbTemp = PcbTempDecoder(hexString)
                val decodedAfeTemp = AfeTempDecoder(hexString)
                val decodedCellChemType = CellChemTypeDecoder(hexString)
                val decodedChg_Accumulative_Ah = Chg_Accumulative_AhDecoder(hexString)
                val decodedDchg_Accumulative_Ah = Dchg_Accumulative_AhDecoder(hexString)
                val decodedRefVol = RefVolDecoder(hexString)
                val decoded_3v3Vol = _3v3VolDecoder(hexString)
                val decoded_5vVol = _5vVolDecoder(hexString)
                val decoded_12vVol = _12vVolDecoder(hexString)
                val decodedActual_SoC = Actual_SoCDecoder(hexString)
                val decodedUsable_Capacity_Ah = Usable_Capacity_AhDecoder(hexString)
                val decodedConfigVer = ConfigVerDecoder(hexString)
                val decodedInternalFWVer = InternalFWVerDecoder(hexString)
                val decodedInternalFWSubVer = InternalFWSubVerDecoder(hexString)
                val decodedBHB_66049 = BHB_66049Decoder(hexString)
                val decodedMaxTemp = MaxTempDecoder(hexString)
                val decodedMinTemp = MinTempDecoder(hexString)
                val decodedFetTemp = FetTempDecoder(hexString)
                val decodedTemp1 = Temp1Decoder(hexString)
                val decodedTemp2 = Temp2Decoder(hexString)
                val decodedTemp3 = Temp3Decoder(hexString)
                val decodedTemp4 = Temp4Decoder(hexString)
                val decodedTemp5 = Temp5Decoder(hexString)
                val decodedTemp6 = Temp6Decoder(hexString)
                val decodedTemp7 = Temp7Decoder(hexString)
                val decodedTemp8 = Temp8Decoder(hexString)
                val decodedHwVer = HwVerDecoder(hexString)
                val decodedFwVer = FwVerDecoder(hexString)
                val decodedFWSubVer = FWSubVerDecoder(hexString)
                val decodedBtStatus_NC0PSM1CC2CV3Finish4 = BtStatus_NC0PSM1CC2CV3Finish4Decoder(hexString)
                val decodedBt_liveMsg1Temp = Bt_liveMsg1TempDecoder(hexString)
                val decodedBt_liveMsg_soc = Bt_liveMsg_socDecoder(hexString)
                val decodedBMS_status = BMS_statusDecoder(hexString)
                val decodedDemand_voltage = Demand_voltageDecoder(hexString)
                val decodedDemand_Current = Demand_CurrentDecoder(hexString)
                val decodedMaxChgVoltgae = MaxChgVoltgaeDecoder(hexString)
                val decodedMaxChgCurrent = MaxChgCurrentDecoder(hexString)
                val decodedActualChgVoltage = ActualChgVoltageDecoder(hexString)
                val decodedActualChgCurrent = ActualChgCurrentDecoder(hexString)
                val decodedCharging_end_cutoff_Curr = Charging_end_cutoff_CurrDecoder(hexString)
                val decodedCHB_258 = CHB_258Decoder(hexString)
                val decodedChgrNC0PSM1CC2CV3Finsh4 = ChgrNC0PSM1CC2CV3Finsh4Decoder(hexString)
                val decodedchgr_msg_temp = chgr_msg_tempDecoder(hexString)
                val decodedchgStatus_chg_idle = chgStatus_chg_idleDecoder(hexString)
                val decodedchgrLiveMsgChgVolt = chgrLiveMsgChgVoltDecoder(hexString)
                val decodedchgrLiveMsgChgCurrent = chgrLiveMsgChgCurrentDecoder(hexString)
                val decodedChargeSOP = ChargeSOPDecoder(hexString)
                val decodedDchgSOP = DchgSOPDecoder(hexString)
                val decodedDrive_Error_Flag = Drive_Error_FlagDecoder(hexString)
                val decodedSet_Regen = Set_RegenDecoder(hexString)
                val decodedDCcurrentlimit = DCcurrentlimitDecoder(hexString)
                val decodedCustom_freq = Custom_freqDecoder(hexString)
                val decodedCustom_torque = Custom_torqueDecoder(hexString)
                val decodedBuffer_speed = Buffer_speedDecoder(hexString)
                val decodedBase_speed = Base_speedDecoder(hexString)
                val decodedInitial_torque = Initial_torqueDecoder(hexString)
                val decodedFinal_torque = Final_torqueDecoder(hexString)
                val decodedCluster_odo = Cluster_odoDecoder(hexString)
                val decodedMotorSpeed = MotorSpeedDecoder(hexString)
                val decodedBatteryVoltage = BatteryVoltageDecoder(hexString)
                val decodedBatteryCurrent = BatteryCurrentDecoder(hexString)
                val decodedAC_Current = AC_CurrentDecoder(hexString)
                val decodedAC_Voltage = AC_VoltageDecoder(hexString)
                val decodedThrottle = ThrottleDecoder(hexString)
                val decodedMCU_Temperature = MCU_TemperatureDecoder(hexString)
                val decodedMotor_Temperature = Motor_TemperatureDecoder(hexString)
                val decodedMCU_Fault_Code = MCU_Fault_CodeDecoder(hexString)
                val decodedMCU_ID = MCU_IDDecoder(hexString)
                val decodedCluster_heartbeat = Cluster_heartbeatDecoder(hexString)
                val decodedOdo_Cluster = Odo_ClusterDecoder(hexString)

                val decodedLoadDetection = LoadDetectionDecoder(hexString)
                val decodedKeystatus = KeystatusDecoder(hexString)
                val decodedKeyevents = KeyeventsDecoder(hexString)
                val decodedCellUnderVolProt = CellUnderVolProtDecoder(hexString)
                val decodedCellOverVolProt = CellOverVolProtDecoder(hexString)
                val decodedPackUnderVolProt = PackUnderVolProtDecoder(hexString)
                val decodedPackOverVolProt = PackOverVolProtDecoder(hexString)
                val decodedChgUnderTempProt = ChgUnderTempProtDecoder(hexString)
                val decodedChgOverTempProt = ChgOverTempProtDecoder(hexString)
                val decodedDchgUnderTempProt = DchgUnderTempProtDecoder(hexString)
                val decodedDchgOverTempProt = DchgOverTempProtDecoder(hexString)
                val decodedCellOverDevProt = CellOverDevProtDecoder(hexString)
                val decodedBattLowSocWarn = BattLowSocWarnDecoder(hexString)
                val decodedChgOverCurrProt = ChgOverCurrProtDecoder(hexString)
                val decodedDchgOverCurrProt = DchgOverCurrProtDecoder(hexString)
                val decodedCellUnderVolWarn = CellUnderVolWarnDecoder(hexString)
                val decodedCellOverVolWarn = CellOverVolWarnDecoder(hexString)
                val decodedFetTempProt = FetTempProtDecoder(hexString)
                val decodedResSocProt = ResSocProtDecoder(hexString)
                val decodedFetFailure = FetFailureDecoder(hexString)
                val decodedTempSenseFault = TempSenseFaultDecoder(hexString)
                val decodedPackUnderVolWarn = PackUnderVolWarnDecoder(hexString)
                val decodedPackOverVolWarn = PackOverVolWarnDecoder(hexString)
                val decodedChgUnderTempWarn = ChgUnderTempWarnDecoder(hexString)
                val decodedChgOverTempWarn = ChgOverTempWarnDecoder(hexString)
                val decodedDchgUnderTempWarn = DchgUnderTempWarnDecoder(hexString)
                val decodedDchgOverTempWarn = DchgOverTempWarnDecoder(hexString)
                val decodedPreChgFetStatus = PreChgFetStatusDecoder(hexString)
                val decodedChgFetStatus = ChgFetStatusDecoder(hexString)
                val decodedDchgFetStatus = DchgFetStatusDecoder(hexString)
                val decodedResStatus = ResStatusDecoder(hexString)
                val decodedShortCktProt = ShortCktProtDecoder(hexString)
                val decodedDschgPeakProt = DschgPeakProtDecoder(hexString)
                val decodedChgAuth = ChgAuthDecoder(hexString)
                val decodedChgPeakProt = ChgPeakProtDecoder(hexString)
                val decodedDI1 = DI1Decoder(hexString)
                val decodedDI2 = DI2Decoder(hexString)
                val decodedDO1 = DO1Decoder(hexString)
                val decodedDO2 = DO2Decoder(hexString)
                val decodedChargerDetection = ChargerDetectionDecoder(hexString)
                val decodedCanCommDetection = CanCommDetectionDecoder(hexString)
                val decodedCellBalFeatureStatus = CellBalFeatureStatusDecoder(hexString)
                val decodedImmoChg = ImmoChgDecoder(hexString)
                val decodedImmoDchg = ImmoDchgDecoder(hexString)
                val decodedBuzzerStatus = BuzzerStatusDecoder(hexString)
                val decodedSide_Stand_Ack = Side_Stand_AckDecoder(hexString)
                val decodedDirection_Ack = Direction_AckDecoder(hexString)
                val decodedRide_Ack = Ride_AckDecoder(hexString)
                val decodedHill_hold_Ack = Hill_hold_AckDecoder(hexString)
                val decodedWakeup_Ack = Wakeup_AckDecoder(hexString)
                val decodedDriveError_Motor_hall = DriveError_Motor_hallDecoder(hexString)
                val decodedMotor_Stalling = Motor_StallingDecoder(hexString)
                val decodedMotor_Phase_loss = Motor_Phase_lossDecoder(hexString)
                val decodedController_Over_Temperature = Controller_Over_TemperatureDecoder(hexString)
                val decodedMotor_Over_Temperature = Motor_Over_TemperatureDecoder(hexString)
                val decodedThrottle_Error = Throttle_ErrorDecoder(hexString)
                val decodedMOSFET_Protection = MOSFET_ProtectionDecoder(hexString)
                val decodedDriveStatus_Regenerative_Braking = DriveStatus_Regenerative_BrakingDecoder(hexString)
                val decodedModeR_Pulse = ModeR_PulseDecoder(hexString)
                val decodedModeL_Pulse = ModeL_PulseDecoder(hexString)
                val decodedBrake_Pulse = Brake_PulseDecoder(hexString)
                val decodedPark_Pulse = Park_PulseDecoder(hexString)
                val decodedReverse_Pulse = Reverse_PulseDecoder(hexString)
                val decodedSideStand_Pulse = SideStand_PulseDecoder(hexString)
                val decodedForwardParking_Mode_Ack = ForwardParking_Mode_AckDecoder(hexString)
                val decodedDriveError_Controller_OverVoltag = DriveError_Controller_OverVoltagDecoder(hexString)
                val decodedController_Undervoltage = Controller_UndervoltageDecoder(hexString)
                val decodedOvercurrent_Fault = Overcurrent_FaultDecoder(hexString)
                val decodedDriveStatus1_ride = DriveStatus1_rideDecoder(hexString)
                val decodedWakeup_Request = Wakeup_RequestDecoder(hexString)
                val decodedHill_Hold = Hill_HoldDecoder(hexString)
                val decodedReverse_REQUEST = Reverse_REQUESTDecoder(hexString)
                val decodedForward_parkingmode_REQUEST = Forward_parkingmode_REQUESTDecoder(hexString)
                val decodedSide_stand_Req = Side_stand_ReqDecoder(hexString)
                val decodedBattery_charge_logic = Battery_charge_logicDecoder(hexString)
                val decodedRemote_cutoff = Remote_cutoffDecoder(hexString)
                val decodedmode_limit = mode_limitDecoder(hexString)
                val decodedGeo_fencebuzzer = Geo_fencebuzzerDecoder(hexString)
                val decodedHoliday_mode = Holiday_modeDecoder(hexString)
                val decodedService_request = Service_requestDecoder(hexString)
                val decodedLow_Mode_REQUEST = Low_Mode_REQUESTDecoder(hexString)
                val decodedMedium_Mode_REQUEST = Medium_Mode_REQUESTDecoder(hexString)
                val decodedUser_defind_mode_High_REQUEST = User_defind_mode_High_REQUESTDecoder(hexString)
                val decodedLimp_mode_REQUEST = Limp_mode_REQUESTDecoder(hexString)

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

                if (decodedCellVol02 != null) {
                    lastValidCellVol02 = decodedCellVol02
                }
                if (decodedCellVol03 != null) {
                    lastValidCellVol03 = decodedCellVol03
                }
                if (decodedCellVol04 != null) {
                    lastValidCellVol04 = decodedCellVol04
                }
                if (decodedCellVol05 != null) {
                    lastValidCellVol05 = decodedCellVol05
                }
                if (decodedCellVol06 != null) {
                    lastValidCellVol06 = decodedCellVol06
                }
                if (decodedCellVol07 != null) {
                    lastValidCellVol07 = decodedCellVol07
                }
                if (decodedCellVol08 != null) {
                    lastValidCellVol08 = decodedCellVol08
                }
                if (decodedCellVol09 != null) {
                    lastValidCellVol09 = decodedCellVol09
                }
                if (decodedCellVol10 != null) {
                    lastValidCellVol10 = decodedCellVol10
                }
                if (decodedCellVol11 != null) {
                    lastValidCellVol11 = decodedCellVol11
                }
                if (decodedCellVol12 != null) {
                    lastValidCellVol12 = decodedCellVol12
                }
                if (decodedCellVol13 != null) {
                    lastValidCellVol13 = decodedCellVol13
                }
                if (decodedCellVol14 != null) {
                    lastValidCellVol14 = decodedCellVol14
                }
                if (decodedCellVol15 != null) {
                    lastValidCellVol15 = decodedCellVol15
                }
                if (decodedCellVol16 != null) {
                    lastValidCellVol16 = decodedCellVol16
                }                      
                if (decodedMaxCellVol != null) {
                    lastValidMaxCellVol = decodedMaxCellVol
                }
                if (decodedMinCellVol != null) {
                    lastValidMinCellVol = decodedMinCellVol
                }
                if (decodedAvgCellVol != null) {
                    lastValidAvgCellVol = decodedAvgCellVol
                }
                if (decodedMaxVoltId != null) {
                    lastValidMaxVoltId = decodedMaxVoltId
                }
                if (decodedMinVoltId != null) {
                    lastValidMinVoltId = decodedMinVoltId
                }
                if (decodedPackVol != null) {
                    lastValidPackVol = decodedPackVol
                }
                if (decodedCycleCount != null) {
                    lastValidCycleCount = decodedCycleCount
                }
                if (decodedCellVolMinMaxDev != null) {
                    lastValidCellVolMinMaxDev = decodedCellVolMinMaxDev
                }
                if (decodedSOC != null) {
                    lastValidSOC = decodedSOC
                }
                if (decodedSOCAh != null) {
                    lastValidSOCAh = decodedSOCAh
                }
                if (decodedSOH != null) {
                    lastValidSOH = decodedSOH
                }
                if (decodedBmsStatus != null) {
                    lastValidBmsStatus = decodedBmsStatus
                }
                if (decodedLedStatus != null) {
                    lastValidLedStatus = decodedLedStatus
                }
                if (decodedActiveCellBalStatus != null) {
                    lastValidActiveCellBalStatus = decodedActiveCellBalStatus
                }
                if (decodedBMS_Serial_No_MUX != null) {
                    lastValidBMS_Serial_No_MUX = decodedBMS_Serial_No_MUX
                }
                if (decodedBMS_Serial_No__1_7 != null) {
                    lastValidBMS_Serial_No__1_7 = decodedBMS_Serial_No__1_7
                }
                if (decodedLatchProtection != null) {
                    lastValidLatchProtection = decodedLatchProtection
                }
                if (decodedLatchType != null) {
                    lastValidLatchType = decodedLatchType
                }
                if (decodedChargerType != null) {
                    lastValidChargerType = decodedChargerType
                }
                if (decodedPcbTemp != null) {
                    lastValidPcbTemp = decodedPcbTemp
                }
                if (decodedAfeTemp != null) {
                    lastValidAfeTemp = decodedAfeTemp
                }
                if (decodedCellChemType != null) {
                    lastValidCellChemType = decodedCellChemType
                }
                if (decodedChg_Accumulative_Ah != null) {
                    lastValidChg_Accumulative_Ah = decodedChg_Accumulative_Ah
                }
                if (decodedDchg_Accumulative_Ah != null) {
                    lastValidDchg_Accumulative_Ah = decodedDchg_Accumulative_Ah
                }
                if (decodedRefVol != null) {
                    lastValidRefVol = decodedRefVol
                }
                if (decoded_3v3Vol != null) {
                    lastValid_3v3Vol = decoded_3v3Vol
                }
                if (decoded_5vVol != null) {
                    lastValid_5vVol = decoded_5vVol
                }
                if (decoded_12vVol != null) {
                    lastValid_12vVol = decoded_12vVol
                }
                if (decodedActual_SoC != null) {
                    lastValidActual_SoC = decodedActual_SoC
                }
                if (decodedUsable_Capacity_Ah != null) {
                    lastValidUsable_Capacity_Ah = decodedUsable_Capacity_Ah
                }
                if (decodedConfigVer != null) {
                    lastValidConfigVer = decodedConfigVer
                }
                if (decodedInternalFWVer != null) {
                    lastValidInternalFWVer = decodedInternalFWVer
                }
                if (decodedInternalFWSubVer != null) {
                    lastValidInternalFWSubVer = decodedInternalFWSubVer
                }
                if (decodedBHB_66049 != null) {
                    lastValidBHB_66049 = decodedBHB_66049
                }
                if (decodedPackCurr != null) {
                    lastValidPackCurr = decodedPackCurr
                }
                if (decodedMaxTemp != null) {
                    lastValidMaxTemp = decodedMaxTemp
                }
                if (decodedMinTemp != null) {
                    lastValidMinTemp = decodedMinTemp
                }
                if (decodedFetTemp != null) {
                    lastValidFetTemp = decodedFetTemp
                }
                if (decodedTemp1 != null) {
                    lastValidTemp1 = decodedTemp1
                }
                if (decodedTemp2 != null) {
                    lastValidTemp2 = decodedTemp2
                }
                if (decodedTemp3 != null) {
                    lastValidTemp3 = decodedTemp3
                }
                if (decodedTemp4 != null) {
                    lastValidTemp4 = decodedTemp4
                }
                if (decodedTemp5 != null) {
                    lastValidTemp5 = decodedTemp5
                }
                if (decodedTemp6 != null) {
                    lastValidTemp6 = decodedTemp6
                }
                if (decodedTemp7 != null) {
                    lastValidTemp7 = decodedTemp7
                }
                if (decodedTemp8 != null) {
                    lastValidTemp8 = decodedTemp8
                }
                if (decodedHwVer != null) {
                    lastValidHwVer = decodedHwVer
                }
                if (decodedFwVer != null) {
                    lastValidFwVer = decodedFwVer
                }
                if (decodedFWSubVer != null) {
                    lastValidFWSubVer = decodedFWSubVer
                }
                if (decodedBtStatus_NC0PSM1CC2CV3Finish4 != null) {
                    lastValidBtStatus_NC0PSM1CC2CV3Finish4 = decodedBtStatus_NC0PSM1CC2CV3Finish4
                }
                if (decodedBt_liveMsg1Temp != null) {
                    lastValidBt_liveMsg1Temp = decodedBt_liveMsg1Temp
                }
                if (decodedBt_liveMsg_soc != null) {
                    lastValidBt_liveMsg_soc = decodedBt_liveMsg_soc
                }
                if (decodedBMS_status != null) {
                    lastValidBMS_status = decodedBMS_status
                }
                if (decodedDemand_voltage != null) {
                    lastValidDemand_voltage = decodedDemand_voltage
                }
                if (decodedDemand_Current != null) {
                    lastValidDemand_Current = decodedDemand_Current
                }
                if (decodedMaxChgVoltgae != null) {
                    lastValidMaxChgVoltgae = decodedMaxChgVoltgae
                }
                if (decodedMaxChgCurrent != null) {
                    lastValidMaxChgCurrent = decodedMaxChgCurrent
                }
                if (decodedActualChgVoltage != null) {
                    lastValidActualChgVoltage = decodedActualChgVoltage
                }
                if (decodedActualChgCurrent != null) {
                    lastValidActualChgCurrent = decodedActualChgCurrent
                }
                if (decodedCharging_end_cutoff_Curr != null) {
                    lastValidCharging_end_cutoff_Curr = decodedCharging_end_cutoff_Curr
                }
                if (decodedCHB_258 != null) {
                    lastValidCHB_258 = decodedCHB_258
                }
                if (decodedChgrNC0PSM1CC2CV3Finsh4 != null) {
                    lastValidChgrNC0PSM1CC2CV3Finsh4 = decodedChgrNC0PSM1CC2CV3Finsh4
                }
                if (decodedchgr_msg_temp != null) {
                    lastValidchgr_msg_temp = decodedchgr_msg_temp
                }
                if (decodedchgStatus_chg_idle != null) {
                    lastValidchgStatus_chg_idle = decodedchgStatus_chg_idle
                }
                if (decodedchgrLiveMsgChgVolt != null) {
                    lastValidchgrLiveMsgChgVolt = decodedchgrLiveMsgChgVolt
                }
                if (decodedchgrLiveMsgChgCurrent != null) {
                    lastValidchgrLiveMsgChgCurrent = decodedchgrLiveMsgChgCurrent
                }
                if (decodedChargeSOP != null) {
                    lastValidChargeSOP = decodedChargeSOP
                }
                if (decodedDchgSOP != null) {
                    lastValidDchgSOP = decodedDchgSOP
                }
                if (decodedDrive_Error_Flag != null) {
                    lastValidDrive_Error_Flag = decodedDrive_Error_Flag
                }
                if (decodedSet_Regen != null) {
                    lastValidSet_Regen = decodedSet_Regen
                }
                if (decodedDCcurrentlimit != null) {
                    lastValidDCcurrentlimit = decodedDCcurrentlimit
                }
                if (decodedCustom_freq != null) {
                    lastValidCustom_freq = decodedCustom_freq
                }
                if (decodedCustom_torque != null) {
                    lastValidCustom_torque = decodedCustom_torque
                }
                if (decodedBuffer_speed != null) {
                    lastValidBuffer_speed = decodedBuffer_speed
                }
                if (decodedBase_speed != null) {
                    lastValidBase_speed = decodedBase_speed
                }
                if (decodedInitial_torque != null) {
                    lastValidInitial_torque = decodedInitial_torque
                }
                if (decodedFinal_torque != null) {
                    lastValidFinal_torque = decodedFinal_torque
                }
                if (decodedCluster_odo != null) {
                    lastValidCluster_odo = decodedCluster_odo
                }
                if (decodedMotorSpeed != null) {
                    lastValidMotorSpeed = decodedMotorSpeed
                }
                if (decodedBatteryVoltage != null) {
                    lastValidBatteryVoltage = decodedBatteryVoltage
                }
                if (decodedBatteryCurrent != null) {
                    lastValidBatteryCurrent = decodedBatteryCurrent
                }
                if (decodedAC_Current != null) {
                    lastValidAC_Current = decodedAC_Current
                }
                if (decodedAC_Voltage != null) {
                    lastValidAC_Voltage = decodedAC_Voltage
                }
                if (decodedThrottle != null) {
                    lastValidThrottle = decodedThrottle
                }
                if (decodedMCU_Temperature != null) {
                    lastValidMCU_Temperature = decodedMCU_Temperature
                }
                if (decodedMotor_Temperature != null) {
                    lastValidMotor_Temperature = decodedMotor_Temperature
                }
                if (decodedMCU_Fault_Code != null) {
                    lastValidMCU_Fault_Code = decodedMCU_Fault_Code
                }
                if (decodedMCU_ID != null) {
                    lastValidMCU_ID = decodedMCU_ID
                }
                if (decodedCluster_heartbeat != null) {
                    lastValidCluster_heartbeat = decodedCluster_heartbeat
                }
                if (decodedOdo_Cluster != null) {
                    lastValidOdo_Cluster = decodedOdo_Cluster
                }
                if (decodedLoadDetection != null) {
                    lastValidLoadDetection = decodedLoadDetection
                }
                if (decodedKeystatus != null) {
                    lastValidKeystatus = decodedKeystatus
                }
                if (decodedKeyevents != null) {
                    lastValidKeyevents = decodedKeyevents
                }
                if (decodedCellUnderVolProt != null) {
                    lastValidCellUnderVolProt = decodedCellUnderVolProt
                }
                if (decodedCellOverVolProt != null) {
                    lastValidCellOverVolProt = decodedCellOverVolProt
                }
                if (decodedPackUnderVolProt != null) {
                    lastValidPackUnderVolProt = decodedPackUnderVolProt
                }
                if (decodedPackOverVolProt != null) {
                    lastValidPackOverVolProt = decodedPackOverVolProt
                }
                if (decodedChgUnderTempProt != null) {
                    lastValidChgUnderTempProt = decodedChgUnderTempProt
                }
                if (decodedChgOverTempProt != null) {
                    lastValidChgOverTempProt = decodedChgOverTempProt
                }
                if (decodedDchgUnderTempProt != null) {
                    lastValidDchgUnderTempProt = decodedDchgUnderTempProt
                }
                if (decodedDchgOverTempProt != null) {
                    lastValidDchgOverTempProt = decodedDchgOverTempProt
                }
                if (decodedCellOverDevProt != null) {
                    lastValidCellOverDevProt = decodedCellOverDevProt
                }
                if (decodedBattLowSocWarn != null) {
                    lastValidBattLowSocWarn = decodedBattLowSocWarn
                }
                if (decodedChgOverCurrProt != null) {
                    lastValidChgOverCurrProt = decodedChgOverCurrProt
                }
                if (decodedDchgOverCurrProt != null) {
                    lastValidDchgOverCurrProt = decodedDchgOverCurrProt
                }
                if (decodedCellUnderVolWarn != null) {
                    lastValidCellUnderVolWarn = decodedCellUnderVolWarn
                }
                if (decodedCellOverVolWarn != null) {
                    lastValidCellOverVolWarn = decodedCellOverVolWarn
                }
                if (decodedFetTempProt != null) {
                    lastValidFetTempProt = decodedFetTempProt
                }
                if (decodedResSocProt != null) {
                    lastValidResSocProt = decodedResSocProt
                }
                if (decodedFetFailure != null) {
                    lastValidFetFailure = decodedFetFailure
                }
                if (decodedTempSenseFault != null) {
                    lastValidTempSenseFault = decodedTempSenseFault
                }
                if (decodedPackUnderVolWarn != null) {
                    lastValidPackUnderVolWarn = decodedPackUnderVolWarn
                }
                if (decodedPackOverVolWarn != null) {
                    lastValidPackOverVolWarn = decodedPackOverVolWarn
                }
                if (decodedChgUnderTempWarn != null) {
                    lastValidChgUnderTempWarn = decodedChgUnderTempWarn
                }
                if (decodedChgOverTempWarn != null) {
                    lastValidChgOverTempWarn = decodedChgOverTempWarn
                }
                if (decodedDchgUnderTempWarn != null) {
                    lastValidDchgUnderTempWarn = decodedDchgUnderTempWarn
                }
                if (decodedDchgOverTempWarn != null) {
                    lastValidDchgOverTempWarn = decodedDchgOverTempWarn
                }
                if (decodedPreChgFetStatus != null) {
                    lastValidPreChgFetStatus = decodedPreChgFetStatus
                }
                if (decodedChgFetStatus != null) {
                    lastValidChgFetStatus = decodedChgFetStatus
                }
                if (decodedDchgFetStatus != null) {
                    lastValidDchgFetStatus = decodedDchgFetStatus
                }
                if (decodedResStatus != null) {
                    lastValidResStatus = decodedResStatus
                }
                if (decodedShortCktProt != null) {
                    lastValidShortCktProt = decodedShortCktProt
                }
                if (decodedDschgPeakProt != null) {
                    lastValidDschgPeakProt = decodedDschgPeakProt
                }
                if (decodedChgAuth != null) {
                    lastValidChgAuth = decodedChgAuth
                }
                if (decodedChgPeakProt != null) {
                    lastValidChgPeakProt = decodedChgPeakProt
                }
                if (decodedDI1 != null) {
                    lastValidDI1 = decodedDI1
                }
                if (decodedDI2 != null) {
                    lastValidDI2 = decodedDI2
                }
                if (decodedDO1 != null) {
                    lastValidDO1 = decodedDO1
                }
                if (decodedDO2 != null) {
                    lastValidDO2 = decodedDO2
                }
                if (decodedChargerDetection != null) {
                    lastValidChargerDetection = decodedChargerDetection
                }
                if (decodedCanCommDetection != null) {
                    lastValidCanCommDetection = decodedCanCommDetection
                }
                if (decodedCellBalFeatureStatus != null) {
                    lastValidCellBalFeatureStatus = decodedCellBalFeatureStatus
                }
                if (decodedImmoChg != null) {
                    lastValidImmoChg = decodedImmoChg
                }
                if (decodedImmoDchg != null) {
                    lastValidImmoDchg = decodedImmoDchg
                }
                if (decodedBuzzerStatus != null) {
                    lastValidBuzzerStatus = decodedBuzzerStatus
                }
                if (decodedSide_Stand_Ack != null) {
                    lastValidSide_Stand_Ack = decodedSide_Stand_Ack
                }
                if (decodedDirection_Ack != null) {
                    lastValidDirection_Ack = decodedDirection_Ack
                }
                if (decodedRide_Ack != null) {
                    lastValidRide_Ack = decodedRide_Ack
                }
                if (decodedHill_hold_Ack != null) {
                    lastValidHill_hold_Ack = decodedHill_hold_Ack
                }
                if (decodedWakeup_Ack != null) {
                    lastValidWakeup_Ack = decodedWakeup_Ack
                }
                if (decodedDriveError_Motor_hall != null) {
                    lastValidDriveError_Motor_hall = decodedDriveError_Motor_hall
                }
                if (decodedMotor_Stalling != null) {
                    lastValidMotor_Stalling = decodedMotor_Stalling
                }
                if (decodedMotor_Phase_loss != null) {
                    lastValidMotor_Phase_loss = decodedMotor_Phase_loss
                }
                if (decodedController_Over_Temperature != null) {
                    lastValidController_Over_Temperature = decodedController_Over_Temperature
                }
                if (decodedMotor_Over_Temperature != null) {
                    lastValidMotor_Over_Temperature = decodedMotor_Over_Temperature
                }
                if (decodedThrottle_Error != null) {
                    lastValidThrottle_Error = decodedThrottle_Error
                }
                if (decodedMOSFET_Protection != null) {
                    lastValidMOSFET_Protection = decodedMOSFET_Protection
                }
                if (decodedDriveStatus_Regenerative_Braking != null) {
                    lastValidDriveStatus_Regenerative_Braking = decodedDriveStatus_Regenerative_Braking
                }
                if (decodedModeR_Pulse != null) {
                    lastValidModeR_Pulse = decodedModeR_Pulse
                }
                if (decodedModeL_Pulse != null) {
                    lastValidModeL_Pulse = decodedModeL_Pulse
                }
                if (decodedBrake_Pulse != null) {
                    lastValidBrake_Pulse = decodedBrake_Pulse
                }
                if (decodedPark_Pulse != null) {
                    lastValidPark_Pulse = decodedPark_Pulse
                }
                if (decodedReverse_Pulse != null) {
                    lastValidReverse_Pulse = decodedReverse_Pulse
                }
                if (decodedSideStand_Pulse != null) {
                    lastValidSideStand_Pulse = decodedSideStand_Pulse
                }
                if (decodedForwardParking_Mode_Ack != null) {
                    lastValidForwardParking_Mode_Ack = decodedForwardParking_Mode_Ack
                }
                if (decodedDriveError_Controller_OverVoltag != null) {
                    lastValidDriveError_Controller_OverVoltag = decodedDriveError_Controller_OverVoltag
                }
                if (decodedController_Undervoltage != null) {
                    lastValidController_Undervoltage = decodedController_Undervoltage
                }
                if (decodedOvercurrent_Fault != null) {
                    lastValidOvercurrent_Fault = decodedOvercurrent_Fault
                }
                if (decodedDriveStatus1_ride != null) {
                    lastValidDriveStatus1_ride = decodedDriveStatus1_ride
                }
                if (decodedWakeup_Request != null) {
                    lastValidWakeup_Request = decodedWakeup_Request
                }
                if (decodedHill_Hold != null) {
                    lastValidHill_Hold = decodedHill_Hold
                }
                if (decodedReverse_REQUEST != null) {
                    lastValidReverse_REQUEST = decodedReverse_REQUEST
                }
                if (decodedForward_parkingmode_REQUEST != null) {
                    lastValidForward_parkingmode_REQUEST = decodedForward_parkingmode_REQUEST
                }
                if (decodedSide_stand_Req != null) {
                    lastValidSide_stand_Req = decodedSide_stand_Req
                }
                if (decodedBattery_charge_logic != null) {
                    lastValidBattery_charge_logic = decodedBattery_charge_logic
                }
                if (decodedRemote_cutoff != null) {
                    lastValidRemote_cutoff = decodedRemote_cutoff
                }
                if (decodedmode_limit != null) {
                    lastValidmode_limit = decodedmode_limit
                }
                if (decodedGeo_fencebuzzer != null) {
                    lastValidGeo_fencebuzzer = decodedGeo_fencebuzzer
                }
                if (decodedHoliday_mode != null) {
                    lastValidHoliday_mode = decodedHoliday_mode
                }
                if (decodedService_request != null) {
                    lastValidService_request = decodedService_request
                }
                if (decodedLow_Mode_REQUEST != null) {
                    lastValidLow_Mode_REQUEST = decodedLow_Mode_REQUEST
                }
                if (decodedMedium_Mode_REQUEST != null) {
                    lastValidMedium_Mode_REQUEST = decodedMedium_Mode_REQUEST
                }
                if (decodedUser_defind_mode_High_REQUEST != null) {
                    lastValidUser_defind_mode_High_REQUEST = decodedUser_defind_mode_High_REQUEST
                }
                if (decodedLimp_mode_REQUEST != null) {
                    lastValidLimp_mode_REQUEST = decodedLimp_mode_REQUEST
                }                                 

                runOnUiThread {
                                dataReceivedView.text = """
                CellVol01: ${lastValidCellVol01 ?: "N/A"}
                PackCurr: ${lastValidPackCurr ?: "N/A"}
                IgnitionStatus: ${lastValidIgnitionStatus ?: "N/A"}
                Mode_Ack: ${lastValidMode_Ack ?: "N/A"}
                CellVol02: ${lastValidCellVol02 ?: "N/A"}
                CellVol03: ${lastValidCellVol03 ?: "N/A"}
                CellVol04: ${lastValidCellVol04 ?: "N/A"}
                CellVol05: ${lastValidCellVol05 ?: "N/A"}
                CellVol06: ${lastValidCellVol06 ?: "N/A"}
                CellVol07: ${lastValidCellVol07 ?: "N/A"}
                CellVol08: ${lastValidCellVol08 ?: "N/A"}
                CellVol09: ${lastValidCellVol09 ?: "N/A"}
                CellVol10: ${lastValidCellVol10 ?: "N/A"}
                CellVol11: ${lastValidCellVol11 ?: "N/A"}
                CellVol12: ${lastValidCellVol12 ?: "N/A"}
                CellVol13: ${lastValidCellVol13 ?: "N/A"}
                CellVol14: ${lastValidCellVol14 ?: "N/A"}
                CellVol15: ${lastValidCellVol15 ?: "N/A"}
                CellVol16: ${lastValidCellVol16 ?: "N/A"}
                MaxCellVol: ${lastValidMaxCellVol ?: "N/A"}
                MinCellVol: ${lastValidMinCellVol ?: "N/A"}
                AvgCellVol: ${lastValidAvgCellVol ?: "N/A"}
                MaxVoltId: ${lastValidMaxVoltId ?: "N/A"}
                MinVoltId: ${lastValidMinVoltId ?: "N/A"}
                PackVol: ${lastValidPackVol ?: "N/A"}
                CycleCount: ${lastValidCycleCount ?: "N/A"}
                CellVolMinMaxDev: ${lastValidCellVolMinMaxDev ?: "N/A"}
                SOC: ${lastValidSOC ?: "N/A"}
                SOCAh: ${lastValidSOCAh ?: "N/A"}
                SOH: ${lastValidSOH ?: "N/A"}
                BmsStatus: ${lastValidBmsStatus ?: "N/A"}
                LedStatus: ${lastValidLedStatus ?: "N/A"}
                ActiveCellBalStatus: ${lastValidActiveCellBalStatus ?: "N/A"}
                BMS_Serial_No_MUX: ${lastValidBMS_Serial_No_MUX ?: "N/A"}
                BMS_Serial_No__1_7: ${lastValidBMS_Serial_No__1_7 ?: "N/A"}
                LatchProtection: ${lastValidLatchProtection ?: "N/A"}
                LatchType: ${lastValidLatchType ?: "N/A"}
                ChargerType: ${lastValidChargerType ?: "N/A"}
                PcbTemp: ${lastValidPcbTemp ?: "N/A"}
                AfeTemp: ${lastValidAfeTemp ?: "N/A"}
                CellChemType: ${lastValidCellChemType ?: "N/A"}
                Chg_Accumulative_Ah: ${lastValidChg_Accumulative_Ah ?: "N/A"}
                Dchg_Accumulative_Ah: ${lastValidDchg_Accumulative_Ah ?: "N/A"}
                RefVol: ${lastValidRefVol ?: "N/A"}
                _3v3Vol: ${lastValid_3v3Vol ?: "N/A"}
                _5vVol: ${lastValid_5vVol ?: "N/A"}
                _12vVol: ${lastValid_12vVol ?: "N/A"}
                Actual_SoC: ${lastValidActual_SoC ?: "N/A"}
                Usable_Capacity_Ah: ${lastValidUsable_Capacity_Ah ?: "N/A"}
                ConfigVer: ${lastValidConfigVer ?: "N/A"}
                InternalFWVer: ${lastValidInternalFWVer ?: "N/A"}
                InternalFWSubVer: ${lastValidInternalFWSubVer ?: "N/A"}
                BHB_66049: ${lastValidBHB_66049 ?: "N/A"}
                MaxTemp: ${lastValidMaxTemp ?: "N/A"}
                MinTemp: ${lastValidMinTemp ?: "N/A"}
                FetTemp: ${lastValidFetTemp ?: "N/A"}
                Temp1: ${lastValidTemp1 ?: "N/A"}
                Temp2: ${lastValidTemp2 ?: "N/A"}
                Temp3: ${lastValidTemp3 ?: "N/A"}
                Temp4: ${lastValidTemp4 ?: "N/A"}
                Temp5: ${lastValidTemp5 ?: "N/A"}
                Temp6: ${lastValidTemp6 ?: "N/A"}
                Temp7: ${lastValidTemp7 ?: "N/A"}
                Temp8: ${lastValidTemp8 ?: "N/A"}
                HwVer: ${lastValidHwVer ?: "N/A"}
                FwVer: ${lastValidFwVer ?: "N/A"}
                FWSubVer: ${lastValidFWSubVer ?: "N/A"}
                BtStatus_NC0PSM1CC2CV3Finish4: ${lastValidBtStatus_NC0PSM1CC2CV3Finish4 ?: "N/A"}
                Bt_liveMsg1Temp: ${lastValidBt_liveMsg1Temp ?: "N/A"}
                Bt_liveMsg_soc: ${lastValidBt_liveMsg_soc ?: "N/A"}
                BMS_status: ${lastValidBMS_status ?: "N/A"}
                Demand_voltage: ${lastValidDemand_voltage ?: "N/A"}
                Demand_Current: ${lastValidDemand_Current ?: "N/A"}
                MaxChgVoltage: ${lastValidMaxChgVoltgae ?: "N/A"}
                MaxChgCurrent: ${lastValidMaxChgCurrent ?: "N/A"}
                ActualChgVoltage: ${lastValidActualChgVoltage ?: "N/A"}
                ActualChgCurrent: ${lastValidActualChgCurrent ?: "N/A"}
                Charging_end_cutoff_Curr: ${lastValidCharging_end_cutoff_Curr ?: "N/A"}
                CHB_258: ${lastValidCHB_258 ?: "N/A"}
                ChgrNC0PSM1CC2CV3Finsh4: ${lastValidChgrNC0PSM1CC2CV3Finsh4 ?: "N/A"}
                chgr_msg_temp: ${lastValidchgr_msg_temp ?: "N/A"}
                chgStatus_chg_idle: ${lastValidchgStatus_chg_idle ?: "N/A"}
                chgrLiveMsgChgVolt: ${lastValidchgrLiveMsgChgVolt ?: "N/A"}
                chgrLiveMsgChgCurrent: ${lastValidchgrLiveMsgChgCurrent ?: "N/A"}
                ChargeSOP: ${lastValidChargeSOP ?: "N/A"}
                DchgSOP: ${lastValidDchgSOP ?: "N/A"}
                Drive_Error_Flag: ${lastValidDrive_Error_Flag ?: "N/A"}
                Set_Regen: ${lastValidSet_Regen ?: "N/A"}
                DCcurrentlimit: ${lastValidDCcurrentlimit ?: "N/A"}
                Custom_freq: ${lastValidCustom_freq ?: "N/A"}
                Custom_torque: ${lastValidCustom_torque ?: "N/A"}
                Buffer_speed: ${lastValidBuffer_speed ?: "N/A"}
                Base_speed: ${lastValidBase_speed ?: "N/A"}
                Initial_torque: ${lastValidInitial_torque ?: "N/A"}
                Final_torque: ${lastValidFinal_torque ?: "N/A"}
                Cluster_odo: ${lastValidCluster_odo ?: "N/A"}
                MotorSpeed: ${lastValidMotorSpeed ?: "N/A"}
                BatteryVoltage: ${lastValidBatteryVoltage ?: "N/A"}
                BatteryCurrent: ${lastValidBatteryCurrent ?: "N/A"}
                AC_Current: ${lastValidAC_Current ?: "N/A"}
                AC_Voltage: ${lastValidAC_Voltage ?: "N/A"}
                Throttle: ${lastValidThrottle ?: "N/A"}
                MCU_Temperature: ${lastValidMCU_Temperature ?: "N/A"}
                Motor_Temperature: ${lastValidMotor_Temperature ?: "N/A"}
                MCU_Fault_Code: ${lastValidMCU_Fault_Code ?: "N/A"}
                MCU_ID: ${lastValidMCU_ID ?: "N/A"}
                Cluster_heartbeat: ${lastValidCluster_heartbeat ?: "N/A"}
                Odo_Cluster: ${lastValidOdo_Cluster ?: "N/A"}
                LoadDetection: ${lastValidLoadDetection ?: "N/A"}
                Keystatus: ${lastValidKeystatus ?: "N/A"}
                Keyevents: ${lastValidKeyevents ?: "N/A"}
                CellUnderVolProt: ${lastValidCellUnderVolProt ?: "N/A"}
                CellOverVolProt: ${lastValidCellOverVolProt ?: "N/A"}
                PackUnderVolProt: ${lastValidPackUnderVolProt ?: "N/A"}
                PackOverVolProt: ${lastValidPackOverVolProt ?: "N/A"}
                ChgUnderTempProt: ${lastValidChgUnderTempProt ?: "N/A"}
                ChgOverTempProt: ${lastValidChgOverTempProt ?: "N/A"}
                DchgUnderTempProt: ${lastValidDchgUnderTempProt ?: "N/A"}
                DchgOverTempProt: ${lastValidDchgOverTempProt ?: "N/A"}
                CellOverDevProt: ${lastValidCellOverDevProt ?: "N/A"}
                BattLowSocWarn: ${lastValidBattLowSocWarn ?: "N/A"}
                ChgOverCurrProt: ${lastValidChgOverCurrProt ?: "N/A"}
                DchgOverCurrProt: ${lastValidDchgOverCurrProt ?: "N/A"}
                CellUnderVolWarn: ${lastValidCellUnderVolWarn ?: "N/A"}
                CellOverVolWarn: ${lastValidCellOverVolWarn ?: "N/A"}
                FetTempProt: ${lastValidFetTempProt ?: "N/A"}
                ResSocProt: ${lastValidResSocProt ?: "N/A"}
                FetFailure: ${lastValidFetFailure ?: "N/A"}
                TempSenseFault: ${lastValidTempSenseFault ?: "N/A"}
                PackUnderVolWarn: ${lastValidPackUnderVolWarn ?: "N/A"}
                PackOverVolWarn: ${lastValidPackOverVolWarn ?: "N/A"}
                ChgUnderTempWarn: ${lastValidChgUnderTempWarn ?: "N/A"}
                ChgOverTempWarn: ${lastValidChgOverTempWarn ?: "N/A"}
                DchgUnderTempWarn: ${lastValidDchgUnderTempWarn ?: "N/A"}
                DchgOverTempWarn: ${lastValidDchgOverTempWarn ?: "N/A"}
                PreChgFetStatus: ${lastValidPreChgFetStatus ?: "N/A"}
                ChgFetStatus: ${lastValidChgFetStatus ?: "N/A"}
                DchgFetStatus: ${lastValidDchgFetStatus ?: "N/A"}
                ResStatus: ${lastValidResStatus ?: "N/A"}
                ShortCktProt: ${lastValidShortCktProt ?: "N/A"}
                DschgPeakProt: ${lastValidDschgPeakProt ?: "N/A"}
                ChgAuth: ${lastValidChgAuth ?: "N/A"}
                ChgPeakProt: ${lastValidChgPeakProt ?: "N/A"}
                DI1: ${lastValidDI1 ?: "N/A"}
                DI2: ${lastValidDI2 ?: "N/A"}
                DO1: ${lastValidDO1 ?: "N/A"}
                DO2: ${lastValidDO2 ?: "N/A"}
                ChargerDetection: ${lastValidChargerDetection ?: "N/A"}
                CanCommDetection: ${lastValidCanCommDetection ?: "N/A"}
                CellBalFeatureStatus: ${lastValidCellBalFeatureStatus ?: "N/A"}
                ImmoChg: ${lastValidImmoChg ?: "N/A"}
                ImmoDchg: ${lastValidImmoDchg ?: "N/A"}
                BuzzerStatus: ${lastValidBuzzerStatus ?: "N/A"}
                Side_Stand_Ack: ${lastValidSide_Stand_Ack ?: "N/A"}
                Direction_Ack: ${lastValidDirection_Ack ?: "N/A"}
                Ride_Ack: ${lastValidRide_Ack ?: "N/A"}
                Hill_hold_Ack: ${lastValidHill_hold_Ack ?: "N/A"}
                Wakeup_Ack: ${lastValidWakeup_Ack ?: "N/A"}
                DriveError_Motor_hall: ${lastValidDriveError_Motor_hall ?: "N/A"}
                Motor_Stalling: ${lastValidMotor_Stalling ?: "N/A"}
                Motor_Phase_loss: ${lastValidMotor_Phase_loss ?: "N/A"}
                Controller_Over_Temperature: ${lastValidController_Over_Temperature ?: "N/A"}
                Motor_Over_Temperature: ${lastValidMotor_Over_Temperature ?: "N/A"}
                Throttle_Error: ${lastValidThrottle_Error ?: "N/A"}
                MOSFET_Protection: ${lastValidMOSFET_Protection ?: "N/A"}
                DriveStatus_Regenerative_Braking: ${lastValidDriveStatus_Regenerative_Braking ?: "N/A"}
                ModeR_Pulse: ${lastValidModeR_Pulse ?: "N/A"}
                ModeL_Pulse: ${lastValidModeL_Pulse ?: "N/A"}
                Brake_Pulse: ${lastValidBrake_Pulse ?: "N/A"}
                Park_Pulse: ${lastValidPark_Pulse ?: "N/A"}
                Reverse_Pulse: ${lastValidReverse_Pulse ?: "N/A"}
                SideStand_Pulse: ${lastValidSideStand_Pulse ?: "N/A"}
                ForwardParking_Mode_Ack: ${lastValidForwardParking_Mode_Ack ?: "N/A"}
                DriveError_Controller_OverVoltag: ${lastValidDriveError_Controller_OverVoltag ?: "N/A"}
                Controller_Undervoltage: ${lastValidController_Undervoltage ?: "N/A"}
                Overcurrent_Fault: ${lastValidOvercurrent_Fault ?: "N/A"}
                DriveStatus1_ride: ${lastValidDriveStatus1_ride ?: "N/A"}
                Wakeup_Request: ${lastValidWakeup_Request ?: "N/A"}
                Hill_Hold: ${lastValidHill_Hold ?: "N/A"}
                Reverse_REQUEST: ${lastValidReverse_REQUEST ?: "N/A"}
                Forward_parkingmode_REQUEST: ${lastValidForward_parkingmode_REQUEST ?: "N/A"}
                Side_stand_Req: ${lastValidSide_stand_Req ?: "N/A"}
                Battery_charge_logic: ${lastValidBattery_charge_logic ?: "N/A"}
                Remote_cutoff: ${lastValidRemote_cutoff ?: "N/A"}
                mode_limit: ${lastValidmode_limit ?: "N/A"}
                Geo_fencebuzzer: ${lastValidGeo_fencebuzzer ?: "N/A"}
                Holiday_mode: ${lastValidHoliday_mode ?: "N/A"}
                Service_request: ${lastValidService_request ?: "N/A"}
                Low_Mode_REQUEST: ${lastValidLow_Mode_REQUEST ?: "N/A"}
                Medium_Mode_REQUEST: ${lastValidMedium_Mode_REQUEST ?: "N/A"}
                User_defind_mode_High_REQUEST: ${lastValidUser_defind_mode_High_REQUEST ?: "N/A"}
                Limp_mode_REQUEST: ${lastValidLimp_mode_REQUEST ?: "N/A"}
            """.trimIndent()

                }
            }
        })
    }

    private fun startRecording() {
        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                    val vehicleMetrics = VehicleMetrics(
    CellVol01 = lastValidCellVol01,
    PackCurr = lastValidPackCurr,
    IgnitionStatus = lastValidIgnitionStatus,
    Mode_Ack = lastValidMode_Ack,
    CellVol02 = lastValidCellVol02,
    CellVol03 = lastValidCellVol03,
    CellVol04 = lastValidCellVol04,
    CellVol05 = lastValidCellVol05,
    CellVol06 = lastValidCellVol06,
    CellVol07 = lastValidCellVol07,
    CellVol08 = lastValidCellVol08,
    CellVol09 = lastValidCellVol09,
    CellVol10 = lastValidCellVol10,
    CellVol11 = lastValidCellVol11,
    CellVol12 = lastValidCellVol12,
    CellVol13 = lastValidCellVol13,
    CellVol14 = lastValidCellVol14,
    CellVol15 = lastValidCellVol15,
    CellVol16 = lastValidCellVol16,
    MaxCellVol = lastValidMaxCellVol,
    MinCellVol = lastValidMinCellVol,
    AvgCellVol = lastValidAvgCellVol,
    MaxVoltId = lastValidMaxVoltId,
    MinVoltId = lastValidMinVoltId,
    PackVol = lastValidPackVol,
    CycleCount = lastValidCycleCount,
    CellVolMinMaxDev = lastValidCellVolMinMaxDev,
    SOC = lastValidSOC,
    SOCAh = lastValidSOCAh,
    SOH = lastValidSOH,
    BmsStatus = lastValidBmsStatus,
    LedStatus = lastValidLedStatus,
    ActiveCellBalStatus = lastValidActiveCellBalStatus,
    BMS_Serial_No_MUX = lastValidBMS_Serial_No_MUX,
    BMS_Serial_No__1_7 = lastValidBMS_Serial_No__1_7,
    LatchProtection = lastValidLatchProtection,
    LatchType = lastValidLatchType,
    ChargerType = lastValidChargerType,
    PcbTemp = lastValidPcbTemp,
    AfeTemp = lastValidAfeTemp,
    CellChemType = lastValidCellChemType,
    Chg_Accumulative_Ah = lastValidChg_Accumulative_Ah,
    Dchg_Accumulative_Ah = lastValidDchg_Accumulative_Ah,
    RefVol = lastValidRefVol,
    _3v3Vol = lastValid_3v3Vol,
    _5vVol = lastValid_5vVol,
    _12vVol = lastValid_12vVol,
    Actual_SoC = lastValidActual_SoC,
    Usable_Capacity_Ah = lastValidUsable_Capacity_Ah,
    ConfigVer = lastValidConfigVer,
    InternalFWVer = lastValidInternalFWVer,
    InternalFWSubVer = lastValidInternalFWSubVer,
    BHB_66049 = lastValidBHB_66049,
    MaxTemp = lastValidMaxTemp,
    MinTemp = lastValidMinTemp,
    FetTemp = lastValidFetTemp,
    Temp1 = lastValidTemp1,
    Temp2 = lastValidTemp2,
    Temp3 = lastValidTemp3,
    Temp4 = lastValidTemp4,
    Temp5 = lastValidTemp5,
    Temp6 = lastValidTemp6,
    Temp7 = lastValidTemp7,
    Temp8 = lastValidTemp8,
    HwVer = lastValidHwVer,
    FwVer = lastValidFwVer,
    FWSubVer = lastValidFWSubVer,
    BtStatus_NC0PSM1CC2CV3Finish4 = lastValidBtStatus_NC0PSM1CC2CV3Finish4,
    Bt_liveMsg1Temp = lastValidBt_liveMsg1Temp,
    Bt_liveMsg_soc = lastValidBt_liveMsg_soc,
    BMS_status = lastValidBMS_status,
    Demand_voltage = lastValidDemand_voltage,
    Demand_Current = lastValidDemand_Current,
    MaxChgVoltgae = lastValidMaxChgVoltgae,
    MaxChgCurrent = lastValidMaxChgCurrent,
    ActualChgVoltage = lastValidActualChgVoltage,
    ActualChgCurrent = lastValidActualChgCurrent,
    Charging_end_cutoff_Curr = lastValidCharging_end_cutoff_Curr,
    CHB_258 = lastValidCHB_258,
    ChgrNC0PSM1CC2CV3Finsh4 = lastValidChgrNC0PSM1CC2CV3Finsh4,
    chgr_msg_temp = lastValidchgr_msg_temp,
    chgStatus_chg_idle = lastValidchgStatus_chg_idle,
    chgrLiveMsgChgVolt = lastValidchgrLiveMsgChgVolt,
    chgrLiveMsgChgCurrent = lastValidchgrLiveMsgChgCurrent,
    ChargeSOP = lastValidChargeSOP,
    DchgSOP = lastValidDchgSOP,
    Drive_Error_Flag = lastValidDrive_Error_Flag,
    Set_Regen = lastValidSet_Regen,
    DCcurrentlimit = lastValidDCcurrentlimit,
    Custom_freq = lastValidCustom_freq,
    Custom_torque = lastValidCustom_torque,
    Buffer_speed = lastValidBuffer_speed,
    Base_speed = lastValidBase_speed,
    Initial_torque = lastValidInitial_torque,
    Final_torque = lastValidFinal_torque,
    Cluster_odo = lastValidCluster_odo,
    MotorSpeed = lastValidMotorSpeed,
    BatteryVoltage = lastValidBatteryVoltage,
    BatteryCurrent = lastValidBatteryCurrent,
    AC_Current = lastValidAC_Current,
    AC_Voltage = lastValidAC_Voltage,
    Throttle = lastValidThrottle,
    MCU_Temperature = lastValidMCU_Temperature,
    Motor_Temperature = lastValidMotor_Temperature,
    MCU_Fault_Code = lastValidMCU_Fault_Code,
    MCU_ID = lastValidMCU_ID,
    Cluster_heartbeat = lastValidCluster_heartbeat,
    Odo_Cluster = lastValidOdo_Cluster,
    LoadDetection = lastValidLoadDetection,
    Keystatus = lastValidKeystatus,
    Keyevents = lastValidKeyevents,
    CellUnderVolProt = lastValidCellUnderVolProt,
    CellOverVolProt = lastValidCellOverVolProt,
    PackUnderVolProt = lastValidPackUnderVolProt,
    PackOverVolProt = lastValidPackOverVolProt,
    ChgUnderTempProt = lastValidChgUnderTempProt,
    ChgOverTempProt = lastValidChgOverTempProt,
    DchgUnderTempProt = lastValidDchgUnderTempProt,
    DchgOverTempProt = lastValidDchgOverTempProt,
    CellOverDevProt = lastValidCellOverDevProt,
    BattLowSocWarn = lastValidBattLowSocWarn,
    ChgOverCurrProt = lastValidChgOverCurrProt,
    DchgOverCurrProt = lastValidDchgOverCurrProt,
    CellUnderVolWarn = lastValidCellUnderVolWarn,
    CellOverVolWarn = lastValidCellOverVolWarn,
    FetTempProt = lastValidFetTempProt,
    ResSocProt = lastValidResSocProt,
    FetFailure = lastValidFetFailure,
    TempSenseFault = lastValidTempSenseFault,
    PackUnderVolWarn = lastValidPackUnderVolWarn,
    PackOverVolWarn = lastValidPackOverVolWarn,
    ChgUnderTempWarn = lastValidChgUnderTempWarn,
    ChgOverTempWarn = lastValidChgOverTempWarn,
    DchgUnderTempWarn = lastValidDchgUnderTempWarn,
    DchgOverTempWarn = lastValidDchgOverTempWarn,
    PreChgFetStatus = lastValidPreChgFetStatus,
    ChgFetStatus = lastValidChgFetStatus,
    DchgFetStatus = lastValidDchgFetStatus,
    ResStatus = lastValidResStatus,
    ShortCktProt = lastValidShortCktProt,
    DschgPeakProt = lastValidDschgPeakProt,
    ChgAuth = lastValidChgAuth,
    ChgPeakProt = lastValidChgPeakProt,
    DI1 = lastValidDI1,
    DI2 = lastValidDI2,
    DO1 = lastValidDO1,
    DO2 = lastValidDO2,
    ChargerDetection = lastValidChargerDetection,
    CanCommDetection = lastValidCanCommDetection,
    CellBalFeatureStatus = lastValidCellBalFeatureStatus,
    ImmoChg = lastValidImmoChg,
    ImmoDchg = lastValidImmoDchg,
    BuzzerStatus = lastValidBuzzerStatus,
    Side_Stand_Ack = lastValidSide_Stand_Ack,
    Direction_Ack = lastValidDirection_Ack,
    Ride_Ack = lastValidRide_Ack,
    Hill_hold_Ack = lastValidHill_hold_Ack,
    Wakeup_Ack = lastValidWakeup_Ack,
    DriveError_Motor_hall = lastValidDriveError_Motor_hall,
    Motor_Stalling = lastValidMotor_Stalling,
    Motor_Phase_loss = lastValidMotor_Phase_loss,
    Controller_Over_Temperature = lastValidController_Over_Temperature,
    Motor_Over_Temperature = lastValidMotor_Over_Temperature,
    Throttle_Error = lastValidThrottle_Error,
    MOSFET_Protection = lastValidMOSFET_Protection,
    DriveStatus_Regenerative_Braking = lastValidDriveStatus_Regenerative_Braking,
    ModeR_Pulse = lastValidModeR_Pulse,
    ModeL_Pulse = lastValidModeL_Pulse,
    Brake_Pulse = lastValidBrake_Pulse,
    Park_Pulse = lastValidPark_Pulse,
    Reverse_Pulse = lastValidReverse_Pulse,
    SideStand_Pulse = lastValidSideStand_Pulse,
    ForwardParking_Mode_Ack = lastValidForwardParking_Mode_Ack,
    DriveError_Controller_OverVoltag = lastValidDriveError_Controller_OverVoltag,
    Controller_Undervoltage = lastValidController_Undervoltage,
    Overcurrent_Fault = lastValidOvercurrent_Fault,
    DriveStatus1_ride = lastValidDriveStatus1_ride,
    Wakeup_Request = lastValidWakeup_Request,
    Hill_Hold = lastValidHill_Hold,
    Reverse_REQUEST = lastValidReverse_REQUEST,
    Forward_parkingmode_REQUEST = lastValidForward_parkingmode_REQUEST,
    Side_stand_Req = lastValidSide_stand_Req,
    Battery_charge_logic = lastValidBattery_charge_logic,
    Remote_cutoff = lastValidRemote_cutoff,
    mode_limit = lastValidmode_limit,
    Geo_fencebuzzer = lastValidGeo_fencebuzzer,
    Holiday_mode = lastValidHoliday_mode,
    Service_request = lastValidService_request,
    Low_Mode_REQUEST = lastValidLow_Mode_REQUEST,
    Medium_Mode_REQUEST = lastValidMedium_Mode_REQUEST,
    User_defind_mode_High_REQUEST = lastValidUser_defind_mode_High_REQUEST,
    Limp_mode_REQUEST = lastValidLimp_mode_REQUEST
)
                    saveDataToCSV(vehicleMetrics)
                  
                delay(500)  // Adjust based on how frequently you want to record datas
            }
        }
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread {
            dataReceivedView.text = "Recording stopped."
        }
    }
    data class VehicleMetrics(
        val CellVol01: Double?, val PackCurr: Double?, val IgnitionStatus: Int?, val Mode_Ack: Int?,
        val CellVol02: Double?, val CellVol03: Double?, val CellVol04: Double?, val CellVol05: Double?,
        val CellVol06: Double?, val CellVol07: Double?, val CellVol08: Double?, val CellVol09: Double?,
        val CellVol10: Double?, val CellVol11: Double?, val CellVol12: Double?, val CellVol13: Double?,
        val CellVol14: Double?, val CellVol15: Double?, val CellVol16: Double?, val MaxCellVol: Double?,
        val MinCellVol: Double?, val AvgCellVol: Double?, val MaxVoltId: Double?, val MinVoltId: Double?,
        val PackVol: Double?, val CycleCount: Double?, val CellVolMinMaxDev: Double?, val SOC: Double?,
        val SOCAh: Double?, val SOH: Double?, val BmsStatus: Double?, val LedStatus: Double?,
        val ActiveCellBalStatus: Double?, val BMS_Serial_No_MUX: Double?, val BMS_Serial_No__1_7: Double?,
        val LatchProtection: Double?, val LatchType: Double?, val ChargerType: Double?, val PcbTemp: Double?,
        val AfeTemp: Double?, val CellChemType: Double?, val Chg_Accumulative_Ah: Double?, val Dchg_Accumulative_Ah: Double?,
        val RefVol: Double?, val _3v3Vol: Double?, val _5vVol: Double?, val _12vVol: Double?, val Actual_SoC: Double?,
        val Usable_Capacity_Ah: Double?, val ConfigVer: Double?, val InternalFWVer: Double?, val InternalFWSubVer: Double?,
        val BHB_66049: Double?, val MaxTemp: Double?, val MinTemp: Double?, val FetTemp: Double?,
        val Temp1: Double?, val Temp2: Double?, val Temp3: Double?, val Temp4: Double?,
        val Temp5: Double?, val Temp6: Double?, val Temp7: Double?, val Temp8: Double?, val HwVer: Double?,
        val FwVer: Double?, val FWSubVer: Double?, val BtStatus_NC0PSM1CC2CV3Finish4: Double?, val Bt_liveMsg1Temp: Double?,
        val Bt_liveMsg_soc: Double?, val BMS_status: Double?, val Demand_voltage: Double?, val Demand_Current: Double?,
        val MaxChgVoltgae: Double?, val MaxChgCurrent: Double?, val ActualChgVoltage: Double?, val ActualChgCurrent: Double?,
        val Charging_end_cutoff_Curr: Double?, val CHB_258: Double?, val ChgrNC0PSM1CC2CV3Finsh4: Double?,
        val chgr_msg_temp: Double?, val chgStatus_chg_idle: Double?, val chgrLiveMsgChgVolt: Double?, val chgrLiveMsgChgCurrent: Double?,
        val ChargeSOP: Double?, val DchgSOP: Double?, val Drive_Error_Flag: Double?, val Set_Regen: Double?,
        val DCcurrentlimit: Double?, val Custom_freq: Double?, val Custom_torque: Double?, val Buffer_speed: Double?,
        val Base_speed: Double?, val Initial_torque: Double?, val Final_torque: Double?, val Cluster_odo: Double?,
        val MotorSpeed: Double?, val BatteryVoltage: Double?, val BatteryCurrent: Double?, val AC_Current: Double?,
        val AC_Voltage: Double?, val Throttle: Double?, val MCU_Temperature: Double?, val Motor_Temperature: Double?,
        val MCU_Fault_Code: Double?, val MCU_ID: Double?, val Cluster_heartbeat: Double?, val Odo_Cluster: Double?,
        val LoadDetection: Int?,
        val Keystatus: Int?,
        val Keyevents: Int?,
        val CellUnderVolProt: Int?,
        val CellOverVolProt: Int?,
        val PackUnderVolProt: Int?,
        val PackOverVolProt: Int?,
        val ChgUnderTempProt: Int?,
        val ChgOverTempProt: Int?,
        val DchgUnderTempProt: Int?,
        val DchgOverTempProt: Int?,
        val CellOverDevProt: Int?,
        val BattLowSocWarn: Int?,
        val ChgOverCurrProt: Int?,
        val DchgOverCurrProt: Int?,
        val CellUnderVolWarn: Int?,
        val CellOverVolWarn: Int?,
        val FetTempProt: Int?,
        val ResSocProt: Int?,
        val FetFailure: Int?,
        val TempSenseFault: Int?,
        val PackUnderVolWarn: Int?,
        val PackOverVolWarn: Int?,
        val ChgUnderTempWarn: Int?,
        val ChgOverTempWarn: Int?,
        val DchgUnderTempWarn: Int?,
        val DchgOverTempWarn: Int?,
        val PreChgFetStatus: Int?,
        val ChgFetStatus: Int?,
        val DchgFetStatus: Int?,
        val ResStatus: Int?,
        val ShortCktProt: Int?,
        val DschgPeakProt: Int?,
        val ChgAuth: Int?,
        val ChgPeakProt: Int?,
        val DI1: Int?,
        val DI2: Int?,
        val DO1: Int?,
        val DO2: Int?,
        val ChargerDetection: Int?,
        val CanCommDetection: Int?,
        val CellBalFeatureStatus: Int?,
        val ImmoChg: Int?,
        val ImmoDchg: Int?,
        val BuzzerStatus: Int?,
        val Side_Stand_Ack: Int?,
        val Direction_Ack: Int?,
        val Ride_Ack: Int?,
        val Hill_hold_Ack: Int?,
        val Wakeup_Ack: Int?,
        val DriveError_Motor_hall: Int?,
        val Motor_Stalling: Int?,
        val Motor_Phase_loss: Int?,
        val Controller_Over_Temperature: Int?,
        val Motor_Over_Temperature: Int?,
        val Throttle_Error: Int?,
        val MOSFET_Protection: Int?,
        val DriveStatus_Regenerative_Braking: Int?,
        val ModeR_Pulse: Int?,
        val ModeL_Pulse: Int?,
        val Brake_Pulse: Int?,
        val Park_Pulse: Int?,
        val Reverse_Pulse: Int?,
        val SideStand_Pulse: Int?,
        val ForwardParking_Mode_Ack: Int?,
        val DriveError_Controller_OverVoltag: Int?,
        val Controller_Undervoltage: Int?,
        val Overcurrent_Fault: Int?,
        val DriveStatus1_ride: Int?,
        val Wakeup_Request: Int?,
        val Hill_Hold: Int?,
        val Reverse_REQUEST: Int?,
        val Forward_parkingmode_REQUEST: Int?,
        val Side_stand_Req: Int?,
        val Battery_charge_logic: Int?,
        val Remote_cutoff: Int?,
        val mode_limit: Int?,
        val Geo_fencebuzzer: Int?,
        val Holiday_mode: Int?,
        val Service_request: Int?,
        val Low_Mode_REQUEST: Int?,
        val Medium_Mode_REQUEST: Int?,
        val User_defind_mode_High_REQUEST: Int?,
        val Limp_mode_REQUEST: Int?
    )      
    fun saveDataToCSV(metrics: VehicleMetrics)
 {
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    if (!headersWritten) {
                        writer.append("Timestamp,CellVol01,PackCurr,IgnitionStatus,Mode_Ack,CellVol02,CellVol03,CellVol04,CellVol05,CellVol06,CellVol07,CellVol08,CellVol09,CellVol10,CellVol11,CellVol12,CellVol13,CellVol14,CellVol15,CellVol16,MaxCellVol,MinCellVol,AvgCellVol,MaxVoltId,MinVoltId,PackVol,CycleCount,CellVolMinMaxDev,SOC,SOCAh,SOH,BmsStatus,LedStatus,ActiveCellBalStatus,BMS_Serial_No_MUX,BMS_Serial_No__1_7,LatchProtection,LatchType,ChargerType,PcbTemp,AfeTemp,CellChemType,Chg_Accumulative_Ah,Dchg_Accumulative_Ah,RefVol,_3v3Vol,_5vVol,_12vVol,Actual_SoC,Usable_Capacity_Ah,ConfigVer,InternalFWVer,InternalFWSubVer,BHB_66049,PackCurr,MaxTemp,MinTemp,FetTemp,Temp1,Temp2,Temp3,Temp4,Temp5,Temp6,Temp7,Temp8,HwVer,FwVer,FWSubVer,BtStatus_NC0PSM1CC2CV3Finish4,Bt_liveMsg1Temp,Bt_liveMsg_soc,BMS_status,Demand_voltage,Demand_Current,MaxChgVoltgae,MaxChgCurrent,ActualChgVoltage,ActualChgCurrent,Charging_end_cutoff_Curr,CHB_258,ChgrNC0PSM1CC2CV3Finsh4,chgr_msg_temp,chgStatus_chg_idle,chgrLiveMsgChgVolt,chgrLiveMsgChgCurrent,ChargeSOP,DchgSOP,Drive_Error_Flag,Set_Regen,DCcurrentlimit,Custom_freq,Custom_torque,Buffer_speed,Base_speed,Initial_torque,Final_torque,Cluster_odo,MotorSpeed,BatteryVoltage,BatteryCurrent,AC_Current,AC_Voltage,Throttle,MCU_Temperature,Motor_Temperature,MCU_Fault_Code,MCU_ID,Cluster_heartbeat,Odo_Cluster,LoadDetection,Keystatus,Keyevents,CellUnderVolProt,CellOverVolProt,PackUnderVolProt,PackOverVolProt,ChgUnderTempProt,ChgOverTempProt,DchgUnderTempProt,DchgOverTempProt,CellOverDevProt,BattLowSocWarn,ChgOverCurrProt,DchgOverCurrProt,CellUnderVolWarn,CellOverVolWarn,FetTempProt,ResSocProt,FetFailure,TempSenseFault,PackUnderVolWarn,PackOverVolWarn,ChgUnderTempWarn,ChgOverTempWarn,DchgUnderTempWarn,DchgOverTempWarn,PreChgFetStatus,ChgFetStatus,DchgFetStatus,ResStatus,ShortCktProt,DschgPeakProt,ChgAuth,ChgPeakProt,DI1,DI2,DO1,DO2,ChargerDetection,CanCommDetection,CellBalFeatureStatus,ImmoChg,ImmoDchg,BuzzerStatus,Side_Stand_Ack,Direction_Ack,Ride_Ack,Hill_hold_Ack,Wakeup_Ack,DriveError_Motor_hall,Motor_Stalling,Motor_Phase_loss,Controller_Over_Temperature,Motor_Over_Temperature,Throttle_Error,MOSFET_Protection,DriveStatus_Regenerative_Braking,ModeR_Pulse,ModeL_Pulse,Brake_Pulse,Park_Pulse,Reverse_Pulse,SideStand_Pulse,ForwardParking_Mode_Ack,DriveError_Controller_OverVoltag,Controller_Undervoltage,Overcurrent_Fault,DriveStatus1_ride,Wakeup_Request,Hill_Hold,Reverse_REQUEST,Forward_parkingmode_REQUEST,Side_stand_Req,Battery_charge_logic,Remote_cutoff,mode_limit,Geo_fencebuzzer,Holiday_mode,Service_request,Low_Mode_REQUEST,Medium_Mode_REQUEST,User_defind_mode_High_REQUEST,Limp_mode_REQUEST\n")
                        headersWritten = true
                    }
                    val timestamp = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()).format(Date())

                    writer.append(
    "$timestamp,${metrics.CellVol01 ?: ""},${metrics.PackCurr ?: ""},${metrics.IgnitionStatus ?: ""},${metrics.Mode_Ack ?: ""},${metrics.CellVol02 ?: ""},${metrics.CellVol03 ?: ""},${metrics.CellVol04 ?: ""},${metrics.CellVol05 ?: ""},${metrics.CellVol06 ?: ""},${metrics.CellVol07 ?: ""},${metrics.CellVol08 ?: ""},${metrics.CellVol09 ?: ""},${metrics.CellVol10 ?: ""},${metrics.CellVol11 ?: ""},${metrics.CellVol12 ?: ""},${metrics.CellVol13 ?: ""},${metrics.CellVol14 ?: ""},${metrics.CellVol15 ?: ""},${metrics.CellVol16 ?: ""},${metrics.MaxCellVol ?: ""},${metrics.MinCellVol ?: ""},${metrics.AvgCellVol ?: ""},${metrics.MaxVoltId ?: ""},${metrics.MinVoltId ?: ""},${metrics.PackVol ?: ""},${metrics.CycleCount ?: ""},${metrics.CellVolMinMaxDev ?: ""},${metrics.SOC ?: ""},${metrics.SOCAh ?: ""},${metrics.SOH ?: ""},${metrics.BmsStatus ?: ""},${metrics.LedStatus ?: ""},${metrics.ActiveCellBalStatus ?: ""},${metrics.BMS_Serial_No_MUX ?: ""},${metrics.BMS_Serial_No__1_7 ?: ""},${metrics.LatchProtection ?: ""},${metrics.LatchType ?: ""},${metrics.ChargerType ?: ""},${metrics.PcbTemp ?: ""},${metrics.AfeTemp ?: ""},${metrics.CellChemType ?: ""},${metrics.Chg_Accumulative_Ah ?: ""},${metrics.Dchg_Accumulative_Ah ?: ""},${metrics.RefVol ?: ""},${metrics._3v3Vol ?: ""},${metrics._5vVol ?: ""},${metrics._12vVol ?: ""},${metrics.Actual_SoC ?: ""},${metrics.Usable_Capacity_Ah ?: ""},${metrics.ConfigVer ?: ""},${metrics.InternalFWVer ?: ""},${metrics.InternalFWSubVer ?: ""},${metrics.BHB_66049 ?: ""},${metrics.PackCurr ?: ""},${metrics.MaxTemp ?: ""},${metrics.MinTemp ?: ""},${metrics.FetTemp ?: ""},${metrics.Temp1 ?: ""},${metrics.Temp2 ?: ""},${metrics.Temp3 ?: ""},${metrics.Temp4 ?: ""},${metrics.Temp5 ?: ""},${metrics.Temp6 ?: ""},${metrics.Temp7 ?: ""},${metrics.Temp8 ?: ""},${metrics.HwVer ?: ""},${metrics.FwVer ?: ""},${metrics.FWSubVer ?: ""},${metrics.BtStatus_NC0PSM1CC2CV3Finish4 ?: ""},${metrics.Bt_liveMsg1Temp ?: ""},${metrics.Bt_liveMsg_soc ?: ""},${metrics.BMS_status ?: ""},${metrics.Demand_voltage ?: ""},${metrics.Demand_Current ?: ""},${metrics.MaxChgVoltgae ?: ""},${metrics.MaxChgCurrent ?: ""},${metrics.ActualChgVoltage ?: ""},${metrics.ActualChgCurrent ?: ""},${metrics.Charging_end_cutoff_Curr ?: ""},${metrics.CHB_258 ?: ""},${metrics.ChgrNC0PSM1CC2CV3Finsh4 ?: ""},${metrics.chgr_msg_temp ?: ""},${metrics.chgStatus_chg_idle ?: ""},${metrics.chgrLiveMsgChgVolt ?: ""},${metrics.chgrLiveMsgChgCurrent ?: ""},${metrics.ChargeSOP ?: ""},${metrics.DchgSOP ?: ""},${metrics.Drive_Error_Flag ?: ""},${metrics.Set_Regen ?: ""},${metrics.DCcurrentlimit ?: ""},${metrics.Custom_freq ?: ""},${metrics.Custom_torque ?: ""},${metrics.Buffer_speed ?: ""},${metrics.Base_speed ?: ""},${metrics.Initial_torque ?: ""},${metrics.Final_torque ?: ""},${metrics.Cluster_odo ?: ""},${metrics.MotorSpeed ?: ""},${metrics.BatteryVoltage ?: ""},${metrics.BatteryCurrent ?: ""},${metrics.AC_Current ?: ""},${metrics.AC_Voltage ?: ""},${metrics.Throttle ?: ""},${metrics.MCU_Temperature ?: ""},${metrics.Motor_Temperature ?: ""},${metrics.MCU_Fault_Code ?: ""},${metrics.MCU_ID ?: ""},${metrics.Cluster_heartbeat ?: ""},${metrics.Odo_Cluster ?: ""},${metrics.LoadDetection ?: ""},${metrics.Keystatus ?: ""},${metrics.Keyevents ?: ""},${metrics.CellUnderVolProt ?: ""},${metrics.CellOverVolProt ?: ""},${metrics.PackUnderVolProt ?: ""},${metrics.PackOverVolProt ?: ""},${metrics.ChgUnderTempProt ?: ""},${metrics.ChgOverTempProt ?: ""},${metrics.DchgUnderTempProt ?: ""},${metrics.DchgOverTempProt ?: ""},${metrics.CellOverDevProt ?: ""},${metrics.BattLowSocWarn ?: ""},${metrics.ChgOverCurrProt ?: ""},${metrics.DchgOverCurrProt ?: ""},${metrics.CellUnderVolWarn ?: ""},${metrics.CellOverVolWarn ?: ""},${metrics.FetTempProt ?: ""},${metrics.ResSocProt ?: ""},${metrics.FetFailure ?: ""},${metrics.TempSenseFault ?: ""},${metrics.PackUnderVolWarn ?: ""},${metrics.PackOverVolWarn ?: ""},${metrics.ChgUnderTempWarn ?: ""},${metrics.ChgOverTempWarn ?: ""},${metrics.DchgUnderTempWarn ?: ""},${metrics.DchgOverTempWarn ?: ""},${metrics.PreChgFetStatus ?: ""},${metrics.ChgFetStatus ?: ""},${metrics.DchgFetStatus ?: ""},${metrics.ResStatus ?: ""},${metrics.ShortCktProt ?: ""},${metrics.DschgPeakProt ?: ""},${metrics.ChgAuth ?: ""},${metrics.ChgPeakProt ?: ""},${metrics.DI1 ?: ""},${metrics.DI2 ?: ""},${metrics.DO1 ?: ""},${metrics.DO2 ?: ""},${metrics.ChargerDetection ?: ""},${metrics.CanCommDetection ?: ""},${metrics.CellBalFeatureStatus ?: ""},${metrics.ImmoChg ?: ""},${metrics.ImmoDchg ?: ""},${metrics.BuzzerStatus ?: ""},${metrics.Side_Stand_Ack ?: ""},${metrics.Direction_Ack ?: ""},${metrics.Ride_Ack ?: ""},${metrics.Hill_hold_Ack ?: ""},${metrics.Wakeup_Ack ?: ""},${metrics.DriveError_Motor_hall ?: ""},${metrics.Motor_Stalling ?: ""},${metrics.Motor_Phase_loss ?: ""},${metrics.Controller_Over_Temperature ?: ""},${metrics.Motor_Over_Temperature ?: ""},${metrics.Throttle_Error ?: ""},${metrics.MOSFET_Protection ?: ""},${metrics.DriveStatus_Regenerative_Braking ?: ""},${metrics.ModeR_Pulse ?: ""},${metrics.ModeL_Pulse ?: ""},${metrics.Brake_Pulse ?: ""},${metrics.Park_Pulse ?: ""},${metrics.Reverse_Pulse ?: ""},${metrics.SideStand_Pulse ?: ""},${metrics.ForwardParking_Mode_Ack ?: ""},${metrics.DriveError_Controller_OverVoltag ?: ""},${metrics.Controller_Undervoltage ?: ""},${metrics.Overcurrent_Fault ?: ""},${metrics.DriveStatus1_ride ?: ""},${metrics.Wakeup_Request ?: ""},${metrics.Hill_Hold ?: ""},${metrics.Reverse_REQUEST ?: ""},${metrics.Forward_parkingmode_REQUEST ?: ""},${metrics.Side_stand_Req ?: ""},${metrics.Battery_charge_logic ?: ""},${metrics.Remote_cutoff ?: ""},${metrics.mode_limit ?: ""},${metrics.Geo_fencebuzzer ?: ""},${metrics.Holiday_mode ?: ""},${metrics.Service_request ?: ""},${metrics.Low_Mode_REQUEST ?: ""},${metrics.Medium_Mode_REQUEST ?: ""},${metrics.User_defind_mode_High_REQUEST ?: ""},${metrics.Limp_mode_REQUEST ?: ""}\n"
)

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
