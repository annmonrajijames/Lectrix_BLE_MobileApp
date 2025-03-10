package com.lectrix_ble_mobileapp

import android.app.Activity
import android.bluetooth.*
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

class ReceiveActivity : AppCompatActivity() {
    private lateinit var bluetoothManager: BluetoothManager
    private lateinit var bluetoothAdapter: BluetoothAdapter
    private var bluetoothGatt: BluetoothGatt? = null

    // Last valid values for display
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
    private var lastValidConfigVer: String? = null
    private var lastValidInternalFWVer: String? = null
    private var lastValidInternalFWSubVer: String? = null
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
    private var lastValidHwVer: String? = null
    private var lastValidFwVer: String? = null
    private var lastValidFWSubVer: String? = null
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
    private var lastValidChgStatus_chg_idle: Double? = null
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
    private var lastValidSW_Version_MAJ: Double? = null
    private var lastValidSW_Version_MIN: Double? = null
    private var lastValidHW_Version_MAJ: Double? = null
    private var lastValidHW_Version_MIN: Double? = null
    private var lastValidMCU_Firmware_Id: String? = null

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
    private var lastValidController_Over_Temeprature: Int? = null
    private var lastValidMotor_Over_Temeprature: Int? = null
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

    // Last data recorded for CSV
    private var lastdatarecordCellVol01: Double? = null
    private var lastdatarecordCellVol02: Double? = null
    private var lastdatarecordCellVol03: Double? = null
    private var lastdatarecordCellVol04: Double? = null
    private var lastdatarecordCellVol05: Double? = null
    private var lastdatarecordCellVol06: Double? = null
    private var lastdatarecordCellVol07: Double? = null
    private var lastdatarecordCellVol08: Double? = null
    private var lastdatarecordCellVol09: Double? = null
    private var lastdatarecordCellVol10: Double? = null
    private var lastdatarecordCellVol11: Double? = null
    private var lastdatarecordCellVol12: Double? = null
    private var lastdatarecordCellVol13: Double? = null
    private var lastdatarecordCellVol14: Double? = null
    private var lastdatarecordCellVol15: Double? = null
    private var lastdatarecordCellVol16: Double? = null
    private var lastdatarecordMaxCellVol: Double? = null
    private var lastdatarecordMinCellVol: Double? = null
    private var lastdatarecordAvgCellVol: Double? = null
    private var lastdatarecordMaxVoltId: Double? = null
    private var lastdatarecordMinVoltId: Double? = null
    private var lastdatarecordPackVol: Double? = null
    private var lastdatarecordCycleCount: Double? = null
    private var lastdatarecordCellVolMinMaxDev: Double? = null
    private var lastdatarecordSOC: Double? = null
    private var lastdatarecordSOCAh: Double? = null
    private var lastdatarecordSOH: Double? = null
    private var lastdatarecordBmsStatus: Double? = null
    private var lastdatarecordLedStatus: Double? = null
    private var lastdatarecordActiveCellBalStatus: Double? = null
    private var lastdatarecordBMS_Serial_No_MUX: Double? = null
    private var lastdatarecordBMS_Serial_No__1_7: Double? = null
    private var lastdatarecordLatchProtection: Double? = null
    private var lastdatarecordLatchType: Double? = null
    private var lastdatarecordChargerType: Double? = null
    private var lastdatarecordPcbTemp: Double? = null
    private var lastdatarecordAfeTemp: Double? = null
    private var lastdatarecordCellChemType: Double? = null
    private var lastdatarecordChg_Accumulative_Ah: Double? = null
    private var lastdatarecordDchg_Accumulative_Ah: Double? = null
    private var lastdatarecordRefVol: Double? = null
    private var lastdatarecord_3v3Vol: Double? = null
    private var lastdatarecord_5vVol: Double? = null
    private var lastdatarecord_12vVol: Double? = null
    private var lastdatarecordActual_SoC: Double? = null
    private var lastdatarecordUsable_Capacity_Ah: Double? = null
    private var lastdatarecordConfigVer: String? = null
    private var lastdatarecordInternalFWVer: String? = null
    private var lastdatarecordInternalFWSubVer: String? = null
    private var lastdatarecordBHB_66049: Double? = null
    private var lastdatarecordPackCurr: Double? = null
    private var lastdatarecordMaxTemp: Double? = null
    private var lastdatarecordMinTemp: Double? = null
    private var lastdatarecordFetTemp: Double? = null
    private var lastdatarecordTemp1: Double? = null
    private var lastdatarecordTemp2: Double? = null
    private var lastdatarecordTemp3: Double? = null
    private var lastdatarecordTemp4: Double? = null
    private var lastdatarecordTemp5: Double? = null
    private var lastdatarecordTemp6: Double? = null
    private var lastdatarecordTemp7: Double? = null
    private var lastdatarecordTemp8: Double? = null
    private var lastdatarecordHwVer: String? = null
    private var lastdatarecordFwVer: String? = null
    private var lastdatarecordFWSubVer: String? = null
    private var lastdatarecordBtStatus_NC0PSM1CC2CV3Finish4: Double? = null
    private var lastdatarecordBt_liveMsg1Temp: Double? = null
    private var lastdatarecordBt_liveMsg_soc: Double? = null
    private var lastdatarecordBMS_status: Double? = null
    private var lastdatarecordDemand_voltage: Double? = null
    private var lastdatarecordDemand_Current: Double? = null
    private var lastdatarecordMaxChgVoltgae: Double? = null
    private var lastdatarecordMaxChgCurrent: Double? = null
    private var lastdatarecordActualChgVoltage: Double? = null
    private var lastdatarecordActualChgCurrent: Double? = null
    private var lastdatarecordCharging_end_cutoff_Curr: Double? = null
    private var lastdatarecordCHB_258: Double? = null
    private var lastdatarecordChgrNC0PSM1CC2CV3Finsh4: Double? = null
    private var lastdatarecordchgr_msg_temp: Double? = null
    private var lastdatarecordChgStatus_chg_idle: Double? = null
    private var lastdatarecordchgrLiveMsgChgVolt: Double? = null
    private var lastdatarecordchgrLiveMsgChgCurrent: Double? = null
    private var lastdatarecordChargeSOP: Double? = null
    private var lastdatarecordDchgSOP: Double? = null
    private var lastdatarecordDrive_Error_Flag: Double? = null
    private var lastdatarecordSet_Regen: Double? = null
    private var lastdatarecordDCcurrentlimit: Double? = null
    private var lastdatarecordCustom_freq: Double? = null
    private var lastdatarecordCustom_torque: Double? = null
    private var lastdatarecordBuffer_speed: Double? = null
    private var lastdatarecordBase_speed: Double? = null
    private var lastdatarecordInitial_torque: Double? = null
    private var lastdatarecordFinal_torque: Double? = null
    private var lastdatarecordCluster_odo: Double? = null
    private var lastdatarecordMode_Ack: Double? = null
    private var lastdatarecordMotorSpeed: Double? = null
    private var lastdatarecordBatteryVoltage: Double? = null
    private var lastdatarecordBatteryCurrent: Double? = null
    private var lastdatarecordAC_Current: Double? = null
    private var lastdatarecordAC_Voltage: Double? = null
    private var lastdatarecordThrottle: Double? = null
    private var lastdatarecordMCU_Temperature: Double? = null
    private var lastdatarecordMotor_Temperature: Double? = null
    private var lastdatarecordMCU_Fault_Code: Double? = null
    private var lastdatarecordMCU_ID: Double? = null
    private var lastdatarecordCluster_heartbeat: Double? = null
    private var lastdatarecordOdo_Cluster: Double? = null

    private var lastdatarecordIgnitionStatus: Int? = null
    private var lastdatarecordLoadDetection: Int? = null
    private var lastdatarecordKeystatus: Int? = null
    private var lastdatarecordKeyevents: Int? = null
    private var lastdatarecordCellUnderVolProt: Int? = null
    private var lastdatarecordCellOverVolProt: Int? = null
    private var lastdatarecordPackUnderVolProt: Int? = null
    private var lastdatarecordPackOverVolProt: Int? = null
    private var lastdatarecordChgUnderTempProt: Int? = null
    private var lastdatarecordChgOverTempProt: Int? = null
    private var lastdatarecordDchgUnderTempProt: Int? = null
    private var lastdatarecordDchgOverTempProt: Int? = null
    private var lastdatarecordCellOverDevProt: Int? = null
    private var lastdatarecordBattLowSocWarn: Int? = null
    private var lastdatarecordChgOverCurrProt: Int? = null
    private var lastdatarecordDchgOverCurrProt: Int? = null
    private var lastdatarecordCellUnderVolWarn: Int? = null
    private var lastdatarecordCellOverVolWarn: Int? = null
    private var lastdatarecordFetTempProt: Int? = null
    private var lastdatarecordResSocProt: Int? = null
    private var lastdatarecordFetFailure: Int? = null
    private var lastdatarecordTempSenseFault: Int? = null
    private var lastdatarecordPackUnderVolWarn: Int? = null
    private var lastdatarecordPackOverVolWarn: Int? = null
    private var lastdatarecordChgUnderTempWarn: Int? = null
    private var lastdatarecordChgOverTempWarn: Int? = null
    private var lastdatarecordDchgUnderTempWarn: Int? = null
    private var lastdatarecordDchgOverTempWarn: Int? = null
    private var lastdatarecordPreChgFetStatus: Int? = null
    private var lastdatarecordChgFetStatus: Int? = null
    private var lastdatarecordDchgFetStatus: Int? = null
    private var lastdatarecordResStatus: Int? = null
    private var lastdatarecordShortCktProt: Int? = null
    private var lastdatarecordDschgPeakProt: Int? = null
    private var lastdatarecordChgAuth: Int? = null
    private var lastdatarecordChgPeakProt: Int? = null
    private var lastdatarecordDI1: Int? = null
    private var lastdatarecordDI2: Int? = null
    private var lastdatarecordDO1: Int? = null
    private var lastdatarecordDO2: Int? = null
    private var lastdatarecordChargerDetection: Int? = null
    private var lastdatarecordCanCommDetection: Int? = null
    private var lastdatarecordCellBalFeatureStatus: Int? = null
    private var lastdatarecordImmoChg: Int? = null
    private var lastdatarecordImmoDchg: Int? = null
    private var lastdatarecordBuzzerStatus: Int? = null
    private var lastdatarecordSide_Stand_Ack: Int? = null
    private var lastdatarecordDirection_Ack: Int? = null
    private var lastdatarecordRide_Ack: Int? = null
    private var lastdatarecordHill_hold_Ack: Int? = null
    private var lastdatarecordWakeup_Ack: Int? = null
    private var lastdatarecordDriveError_Motor_hall: Int? = null
    private var lastdatarecordMotor_Stalling: Int? = null
    private var lastdatarecordMotor_Phase_loss: Int? = null
    private var lastdatarecordController_Over_Temeprature: Int? = null
    private var lastdatarecordMotor_Over_Temeprature: Int? = null
    private var lastdatarecordThrottle_Error: Int? = null
    private var lastdatarecordMOSFET_Protection: Int? = null
    private var lastdatarecordDriveStatus_Regenerative_Braking: Int? = null
    private var lastdatarecordModeR_Pulse: Int? = null
    private var lastdatarecordModeL_Pulse: Int? = null
    private var lastdatarecordBrake_Pulse: Int? = null
    private var lastdatarecordPark_Pulse: Int? = null
    private var lastdatarecordReverse_Pulse: Int? = null
    private var lastdatarecordSideStand_Pulse: Int? = null
    private var lastdatarecordForwardParking_Mode_Ack: Int? = null
    private var lastdatarecordDriveError_Controller_OverVoltag: Int? = null
    private var lastdatarecordController_Undervoltage: Int? = null
    private var lastdatarecordOvercurrent_Fault: Int? = null
    private var lastdatarecordDriveStatus1_ride: Int? = null
    private var lastdatarecordWakeup_Request: Int? = null
    private var lastdatarecordHill_Hold: Int? = null
    private var lastdatarecordReverse_REQUEST: Int? = null
    private var lastdatarecordForward_parkingmode_REQUEST: Int? = null
    private var lastdatarecordSide_stand_Req: Int? = null
    private var lastdatarecordBattery_charge_logic: Int? = null
    private var lastdatarecordRemote_cutoff: Int? = null
    private var lastdatarecordmode_limit: Int? = null
    private var lastdatarecordGeo_fencebuzzer: Int? = null
    private var lastdatarecordHoliday_mode: Int? = null
    private var lastdatarecordService_request: Int? = null
    private var lastdatarecordLow_Mode_REQUEST: Int? = null
    private var lastdatarecordMedium_Mode_REQUEST: Int? = null
    private var lastdatarecordUser_defind_mode_High_REQUEST: Int? = null
    private var lastdatarecordLimp_mode_REQUEST: Int? = null
    private var lastdatarecordSW_Version_MAJ: Double? = null
    private var lastdatarecordSW_Version_MIN: Double? = null
    private var lastdatarecordHW_Version_MAJ: Double? = null
    private var lastdatarecordHW_Version_MIN: Double? = null
    private var lastdatarecordMCU_Firmware_Id: String? = null

    // Rows, CheckBoxes, and TextViews for each parameter
    private lateinit var rowCellVol01: LinearLayout
    private lateinit var cbCellVol01: CheckBox
    private lateinit var tvCellVol01: TextView

    private lateinit var rowCellVol02: LinearLayout
    private lateinit var cbCellVol02: CheckBox
    private lateinit var tvCellVol02: TextView
    
    private lateinit var rowCellVol03: LinearLayout
    private lateinit var cbCellVol03: CheckBox
    private lateinit var tvCellVol03: TextView
    
    private lateinit var rowCellVol04: LinearLayout
    private lateinit var cbCellVol04: CheckBox
    private lateinit var tvCellVol04: TextView
    
    private lateinit var rowCellVol05: LinearLayout
    private lateinit var cbCellVol05: CheckBox
    private lateinit var tvCellVol05: TextView
    
    private lateinit var rowCellVol06: LinearLayout
    private lateinit var cbCellVol06: CheckBox
    private lateinit var tvCellVol06: TextView
    
    private lateinit var rowCellVol07: LinearLayout
    private lateinit var cbCellVol07: CheckBox
    private lateinit var tvCellVol07: TextView
    
    private lateinit var rowCellVol08: LinearLayout
    private lateinit var cbCellVol08: CheckBox
    private lateinit var tvCellVol08: TextView
    
    private lateinit var rowCellVol09: LinearLayout
    private lateinit var cbCellVol09: CheckBox
    private lateinit var tvCellVol09: TextView
    
    private lateinit var rowCellVol10: LinearLayout
    private lateinit var cbCellVol10: CheckBox
    private lateinit var tvCellVol10: TextView
    
    private lateinit var rowCellVol11: LinearLayout
    private lateinit var cbCellVol11: CheckBox
    private lateinit var tvCellVol11: TextView
    
    private lateinit var rowCellVol12: LinearLayout
    private lateinit var cbCellVol12: CheckBox
    private lateinit var tvCellVol12: TextView
    
    private lateinit var rowCellVol13: LinearLayout
    private lateinit var cbCellVol13: CheckBox
    private lateinit var tvCellVol13: TextView
    
    private lateinit var rowCellVol14: LinearLayout
    private lateinit var cbCellVol14: CheckBox
    private lateinit var tvCellVol14: TextView
    
    private lateinit var rowCellVol15: LinearLayout
    private lateinit var cbCellVol15: CheckBox
    private lateinit var tvCellVol15: TextView
    
    private lateinit var rowCellVol16: LinearLayout
    private lateinit var cbCellVol16: CheckBox
    private lateinit var tvCellVol16: TextView
    
    private lateinit var rowMaxCellVol: LinearLayout
    private lateinit var cbMaxCellVol: CheckBox
    private lateinit var tvMaxCellVol: TextView
    
    private lateinit var rowMinCellVol: LinearLayout
    private lateinit var cbMinCellVol: CheckBox
    private lateinit var tvMinCellVol: TextView
    
    private lateinit var rowAvgCellVol: LinearLayout
    private lateinit var cbAvgCellVol: CheckBox
    private lateinit var tvAvgCellVol: TextView
    
    private lateinit var rowMaxVoltId: LinearLayout
    private lateinit var cbMaxVoltId: CheckBox
    private lateinit var tvMaxVoltId: TextView

    private lateinit var rowMinVoltId: LinearLayout
    private lateinit var cbMinVoltId: CheckBox
    private lateinit var tvMinVoltId: TextView

    private lateinit var rowPackVol: LinearLayout
    private lateinit var cbPackVol: CheckBox
    private lateinit var tvPackVol: TextView

    private lateinit var rowCycleCount: LinearLayout
    private lateinit var cbCycleCount: CheckBox
    private lateinit var tvCycleCount: TextView

    private lateinit var rowCellVolMinMaxDev: LinearLayout
    private lateinit var cbCellVolMinMaxDev: CheckBox
    private lateinit var tvCellVolMinMaxDev: TextView

    private lateinit var rowSOC: LinearLayout
    private lateinit var cbSOC: CheckBox
    private lateinit var tvSOC: TextView

    private lateinit var rowSOCAh: LinearLayout
    private lateinit var cbSOCAh: CheckBox
    private lateinit var tvSOCAh: TextView

    private lateinit var rowSOH: LinearLayout
    private lateinit var cbSOH: CheckBox
    private lateinit var tvSOH: TextView

    private lateinit var rowBmsStatus: LinearLayout
    private lateinit var cbBmsStatus: CheckBox
    private lateinit var tvBmsStatus: TextView

    private lateinit var rowLedStatus: LinearLayout
    private lateinit var cbLedStatus: CheckBox
    private lateinit var tvLedStatus: TextView

    private lateinit var rowActiveCellBalStatus: LinearLayout
    private lateinit var cbActiveCellBalStatus: CheckBox
    private lateinit var tvActiveCellBalStatus: TextView

    private lateinit var rowBMS_Serial_No_MUX: LinearLayout
    private lateinit var cbBMS_Serial_No_MUX: CheckBox
    private lateinit var tvBMS_Serial_No_MUX: TextView

    private lateinit var rowBMS_Serial_No__1_7: LinearLayout
    private lateinit var cbBMS_Serial_No__1_7: CheckBox
    private lateinit var tvBMS_Serial_No__1_7: TextView

    private lateinit var rowLatchProtection: LinearLayout
    private lateinit var cbLatchProtection: CheckBox
    private lateinit var tvLatchProtection: TextView

    private lateinit var rowLatchType: LinearLayout
    private lateinit var cbLatchType: CheckBox
    private lateinit var tvLatchType: TextView

    private lateinit var rowChargerType: LinearLayout
    private lateinit var cbChargerType: CheckBox
    private lateinit var tvChargerType: TextView

    private lateinit var rowPcbTemp: LinearLayout
    private lateinit var cbPcbTemp: CheckBox
    private lateinit var tvPcbTemp: TextView

    private lateinit var rowAfeTemp: LinearLayout
    private lateinit var cbAfeTemp: CheckBox
    private lateinit var tvAfeTemp: TextView

    private lateinit var rowCellChemType: LinearLayout
    private lateinit var cbCellChemType: CheckBox
    private lateinit var tvCellChemType: TextView

    private lateinit var rowChg_Accumulative_Ah: LinearLayout
    private lateinit var cbChg_Accumulative_Ah: CheckBox
    private lateinit var tvChg_Accumulative_Ah: TextView

    private lateinit var rowDchg_Accumulative_Ah: LinearLayout
    private lateinit var cbDchg_Accumulative_Ah: CheckBox
    private lateinit var tvDchg_Accumulative_Ah: TextView

    private lateinit var rowRefVol: LinearLayout
    private lateinit var cbRefVol: CheckBox
    private lateinit var tvRefVol: TextView

    private lateinit var row_3v3Vol: LinearLayout
    private lateinit var cb_3v3Vol: CheckBox
    private lateinit var tv_3v3Vol: TextView

    private lateinit var row_5vVol: LinearLayout
    private lateinit var cb_5vVol: CheckBox
    private lateinit var tv_5vVol: TextView

    private lateinit var row_12vVol: LinearLayout
    private lateinit var cb_12vVol: CheckBox
    private lateinit var tv_12vVol: TextView

    private lateinit var rowActual_SoC: LinearLayout
    private lateinit var cbActual_SoC: CheckBox
    private lateinit var tvActual_SoC: TextView

    private lateinit var rowUsable_Capacity_Ah: LinearLayout
    private lateinit var cbUsable_Capacity_Ah: CheckBox
    private lateinit var tvUsable_Capacity_Ah: TextView

    private lateinit var rowConfigVer: LinearLayout
    private lateinit var cbConfigVer: CheckBox
    private lateinit var tvConfigVer: TextView

    private lateinit var rowInternalFWVer: LinearLayout
    private lateinit var cbInternalFWVer: CheckBox
    private lateinit var tvInternalFWVer: TextView

    private lateinit var rowInternalFWSubVer: LinearLayout
    private lateinit var cbInternalFWSubVer: CheckBox
    private lateinit var tvInternalFWSubVer: TextView

    private lateinit var rowBHB_66049: LinearLayout
    private lateinit var cbBHB_66049: CheckBox
    private lateinit var tvBHB_66049: TextView

    private lateinit var rowPackCurr: LinearLayout
    private lateinit var cbPackCurr: CheckBox
    private lateinit var tvPackCurr: TextView

    private lateinit var rowMaxTemp: LinearLayout
    private lateinit var cbMaxTemp: CheckBox
    private lateinit var tvMaxTemp: TextView

    private lateinit var rowMinTemp: LinearLayout
    private lateinit var cbMinTemp: CheckBox
    private lateinit var tvMinTemp: TextView

    private lateinit var rowFetTemp: LinearLayout
    private lateinit var cbFetTemp: CheckBox
    private lateinit var tvFetTemp: TextView

    private lateinit var rowTemp1: LinearLayout
    private lateinit var cbTemp1: CheckBox
    private lateinit var tvTemp1: TextView

    private lateinit var rowTemp2: LinearLayout
    private lateinit var cbTemp2: CheckBox
    private lateinit var tvTemp2: TextView

    private lateinit var rowTemp3: LinearLayout
    private lateinit var cbTemp3: CheckBox
    private lateinit var tvTemp3: TextView

    private lateinit var rowTemp4: LinearLayout
    private lateinit var cbTemp4: CheckBox
    private lateinit var tvTemp4: TextView

    private lateinit var rowTemp5: LinearLayout
    private lateinit var cbTemp5: CheckBox
    private lateinit var tvTemp5: TextView

    private lateinit var rowTemp6: LinearLayout
    private lateinit var cbTemp6: CheckBox
    private lateinit var tvTemp6: TextView

    private lateinit var rowTemp7: LinearLayout
    private lateinit var cbTemp7: CheckBox
    private lateinit var tvTemp7: TextView

    private lateinit var rowTemp8: LinearLayout
    private lateinit var cbTemp8: CheckBox
    private lateinit var tvTemp8: TextView

    private lateinit var rowHwVer: LinearLayout
    private lateinit var cbHwVer: CheckBox
    private lateinit var tvHwVer: TextView

    private lateinit var rowFwVer: LinearLayout
    private lateinit var cbFwVer: CheckBox
    private lateinit var tvFwVer: TextView

    private lateinit var rowFWSubVer: LinearLayout
    private lateinit var cbFWSubVer: CheckBox
    private lateinit var tvFWSubVer: TextView

    private lateinit var rowBtStatus_NC0PSM1CC2CV3Finish4: LinearLayout
    private lateinit var cbBtStatus_NC0PSM1CC2CV3Finish4: CheckBox
    private lateinit var tvBtStatus_NC0PSM1CC2CV3Finish4: TextView

    private lateinit var rowBt_liveMsg1Temp: LinearLayout
    private lateinit var cbBt_liveMsg1Temp: CheckBox
    private lateinit var tvBt_liveMsg1Temp: TextView

    private lateinit var rowBt_liveMsg_soc: LinearLayout
    private lateinit var cbBt_liveMsg_soc: CheckBox
    private lateinit var tvBt_liveMsg_soc: TextView

    private lateinit var rowBMS_status: LinearLayout
    private lateinit var cbBMS_status: CheckBox
    private lateinit var tvBMS_status: TextView

    private lateinit var rowDemand_voltage: LinearLayout
    private lateinit var cbDemand_voltage: CheckBox
    private lateinit var tvDemand_voltage: TextView

    private lateinit var rowDemand_Current: LinearLayout
    private lateinit var cbDemand_Current: CheckBox
    private lateinit var tvDemand_Current: TextView

    private lateinit var rowMaxChgVoltgae: LinearLayout
    private lateinit var cbMaxChgVoltgae: CheckBox
    private lateinit var tvMaxChgVoltgae: TextView

    private lateinit var rowMaxChgCurrent: LinearLayout
    private lateinit var cbMaxChgCurrent: CheckBox
    private lateinit var tvMaxChgCurrent: TextView

    private lateinit var rowActualChgVoltage: LinearLayout
    private lateinit var cbActualChgVoltage: CheckBox
    private lateinit var tvActualChgVoltage: TextView

    private lateinit var rowActualChgCurrent: LinearLayout
    private lateinit var cbActualChgCurrent: CheckBox
    private lateinit var tvActualChgCurrent: TextView

    private lateinit var rowCharging_end_cutoff_Curr: LinearLayout
    private lateinit var cbCharging_end_cutoff_Curr: CheckBox
    private lateinit var tvCharging_end_cutoff_Curr: TextView

    private lateinit var rowCHB_258: LinearLayout
    private lateinit var cbCHB_258: CheckBox
    private lateinit var tvCHB_258: TextView

    private lateinit var rowChgrNC0PSM1CC2CV3Finsh4: LinearLayout
    private lateinit var cbChgrNC0PSM1CC2CV3Finsh4: CheckBox
    private lateinit var tvChgrNC0PSM1CC2CV3Finsh4: TextView

    private lateinit var rowchgr_msg_temp: LinearLayout
    private lateinit var cbchgr_msg_temp: CheckBox
    private lateinit var tvchgr_msg_temp: TextView

    private lateinit var rowChgStatus_chg_idle: LinearLayout
    private lateinit var cbChgStatus_chg_idle: CheckBox
    private lateinit var tvChgStatus_chg_idle: TextView

    private lateinit var rowchgrLiveMsgChgVolt: LinearLayout
    private lateinit var cbchgrLiveMsgChgVolt: CheckBox
    private lateinit var tvchgrLiveMsgChgVolt: TextView

    private lateinit var rowchgrLiveMsgChgCurrent: LinearLayout
    private lateinit var cbchgrLiveMsgChgCurrent: CheckBox
    private lateinit var tvchgrLiveMsgChgCurrent: TextView

    private lateinit var rowChargeSOP: LinearLayout
    private lateinit var cbChargeSOP: CheckBox
    private lateinit var tvChargeSOP: TextView

    private lateinit var rowDchgSOP: LinearLayout
    private lateinit var cbDchgSOP: CheckBox
    private lateinit var tvDchgSOP: TextView

    private lateinit var rowDrive_Error_Flag: LinearLayout
    private lateinit var cbDrive_Error_Flag: CheckBox
    private lateinit var tvDrive_Error_Flag: TextView

    private lateinit var rowSet_Regen: LinearLayout
    private lateinit var cbSet_Regen: CheckBox
    private lateinit var tvSet_Regen: TextView

    private lateinit var rowDCcurrentlimit: LinearLayout
    private lateinit var cbDCcurrentlimit: CheckBox
    private lateinit var tvDCcurrentlimit: TextView

    private lateinit var rowCustom_freq: LinearLayout
    private lateinit var cbCustom_freq: CheckBox
    private lateinit var tvCustom_freq: TextView

    private lateinit var rowCustom_torque: LinearLayout
    private lateinit var cbCustom_torque: CheckBox
    private lateinit var tvCustom_torque: TextView

    private lateinit var rowBuffer_speed: LinearLayout
    private lateinit var cbBuffer_speed: CheckBox
    private lateinit var tvBuffer_speed: TextView

    private lateinit var rowBase_speed: LinearLayout
    private lateinit var cbBase_speed: CheckBox
    private lateinit var tvBase_speed: TextView

    private lateinit var rowInitial_torque: LinearLayout
    private lateinit var cbInitial_torque: CheckBox
    private lateinit var tvInitial_torque: TextView

    private lateinit var rowFinal_torque: LinearLayout
    private lateinit var cbFinal_torque: CheckBox
    private lateinit var tvFinal_torque: TextView

    private lateinit var rowCluster_odo: LinearLayout
    private lateinit var cbCluster_odo: CheckBox
    private lateinit var tvCluster_odo: TextView

    private lateinit var rowMode_Ack: LinearLayout
    private lateinit var cbMode_Ack: CheckBox
    private lateinit var tvMode_Ack: TextView

    private lateinit var rowMotorSpeed: LinearLayout
    private lateinit var cbMotorSpeed: CheckBox
    private lateinit var tvMotorSpeed: TextView

    private lateinit var rowBatteryVoltage: LinearLayout
    private lateinit var cbBatteryVoltage: CheckBox
    private lateinit var tvBatteryVoltage: TextView

    private lateinit var rowBatteryCurrent: LinearLayout
    private lateinit var cbBatteryCurrent: CheckBox
    private lateinit var tvBatteryCurrent: TextView

    private lateinit var rowAC_Current: LinearLayout
    private lateinit var cbAC_Current: CheckBox
    private lateinit var tvAC_Current: TextView

    private lateinit var rowAC_Voltage: LinearLayout
    private lateinit var cbAC_Voltage: CheckBox
    private lateinit var tvAC_Voltage: TextView

    private lateinit var rowThrottle: LinearLayout
    private lateinit var cbThrottle: CheckBox
    private lateinit var tvThrottle: TextView

    private lateinit var rowMCU_Temperature: LinearLayout
    private lateinit var cbMCU_Temperature: CheckBox
    private lateinit var tvMCU_Temperature: TextView

    private lateinit var rowMotor_Temperature: LinearLayout
    private lateinit var cbMotor_Temperature: CheckBox
    private lateinit var tvMotor_Temperature: TextView

    private lateinit var rowMCU_Fault_Code: LinearLayout
    private lateinit var cbMCU_Fault_Code: CheckBox
    private lateinit var tvMCU_Fault_Code: TextView

    private lateinit var rowMCU_ID: LinearLayout
    private lateinit var cbMCU_ID: CheckBox
    private lateinit var tvMCU_ID: TextView

    private lateinit var rowCluster_heartbeat: LinearLayout
    private lateinit var cbCluster_heartbeat: CheckBox
    private lateinit var tvCluster_heartbeat: TextView

    private lateinit var rowOdo_Cluster: LinearLayout
    private lateinit var cbOdo_Cluster: CheckBox
    private lateinit var tvOdo_Cluster: TextView

    private lateinit var rowIgnitionStatus: LinearLayout
    private lateinit var cbIgnitionStatus: CheckBox
    private lateinit var tvIgnitionStatus: TextView

    private lateinit var rowLoadDetection: LinearLayout
    private lateinit var cbLoadDetection: CheckBox
    private lateinit var tvLoadDetection: TextView

    private lateinit var rowKeystatus: LinearLayout
    private lateinit var cbKeystatus: CheckBox
    private lateinit var tvKeystatus: TextView

    private lateinit var rowKeyevents: LinearLayout
    private lateinit var cbKeyevents: CheckBox
    private lateinit var tvKeyevents: TextView

    private lateinit var rowCellUnderVolProt: LinearLayout
    private lateinit var cbCellUnderVolProt: CheckBox
    private lateinit var tvCellUnderVolProt: TextView

    private lateinit var rowCellOverVolProt: LinearLayout
    private lateinit var cbCellOverVolProt: CheckBox
    private lateinit var tvCellOverVolProt: TextView

    private lateinit var rowPackUnderVolProt: LinearLayout
    private lateinit var cbPackUnderVolProt: CheckBox
    private lateinit var tvPackUnderVolProt: TextView

    private lateinit var rowPackOverVolProt: LinearLayout
    private lateinit var cbPackOverVolProt: CheckBox
    private lateinit var tvPackOverVolProt: TextView

    private lateinit var rowChgUnderTempProt: LinearLayout
    private lateinit var cbChgUnderTempProt: CheckBox
    private lateinit var tvChgUnderTempProt: TextView

    private lateinit var rowChgOverTempProt: LinearLayout
    private lateinit var cbChgOverTempProt: CheckBox
    private lateinit var tvChgOverTempProt: TextView

    private lateinit var rowDchgUnderTempProt: LinearLayout
    private lateinit var cbDchgUnderTempProt: CheckBox
    private lateinit var tvDchgUnderTempProt: TextView

    private lateinit var rowDchgOverTempProt: LinearLayout
    private lateinit var cbDchgOverTempProt: CheckBox
    private lateinit var tvDchgOverTempProt: TextView

    private lateinit var rowCellOverDevProt: LinearLayout
    private lateinit var cbCellOverDevProt: CheckBox
    private lateinit var tvCellOverDevProt: TextView

    private lateinit var rowBattLowSocWarn: LinearLayout
    private lateinit var cbBattLowSocWarn: CheckBox
    private lateinit var tvBattLowSocWarn: TextView

    private lateinit var rowChgOverCurrProt: LinearLayout
    private lateinit var cbChgOverCurrProt: CheckBox
    private lateinit var tvChgOverCurrProt: TextView

    private lateinit var rowDchgOverCurrProt: LinearLayout
    private lateinit var cbDchgOverCurrProt: CheckBox
    private lateinit var tvDchgOverCurrProt: TextView

    private lateinit var rowCellUnderVolWarn: LinearLayout
    private lateinit var cbCellUnderVolWarn: CheckBox
    private lateinit var tvCellUnderVolWarn: TextView

    private lateinit var rowCellOverVolWarn: LinearLayout
    private lateinit var cbCellOverVolWarn: CheckBox
    private lateinit var tvCellOverVolWarn: TextView

    private lateinit var rowFetTempProt: LinearLayout
    private lateinit var cbFetTempProt: CheckBox
    private lateinit var tvFetTempProt: TextView

    private lateinit var rowResSocProt: LinearLayout
    private lateinit var cbResSocProt: CheckBox
    private lateinit var tvResSocProt: TextView

    private lateinit var rowFetFailure: LinearLayout
    private lateinit var cbFetFailure: CheckBox
    private lateinit var tvFetFailure: TextView

    private lateinit var rowTempSenseFault: LinearLayout
    private lateinit var cbTempSenseFault: CheckBox
    private lateinit var tvTempSenseFault: TextView

    private lateinit var rowPackUnderVolWarn: LinearLayout
    private lateinit var cbPackUnderVolWarn: CheckBox
    private lateinit var tvPackUnderVolWarn: TextView

    private lateinit var rowPackOverVolWarn: LinearLayout
    private lateinit var cbPackOverVolWarn: CheckBox
    private lateinit var tvPackOverVolWarn: TextView

    private lateinit var rowChgUnderTempWarn: LinearLayout
    private lateinit var cbChgUnderTempWarn: CheckBox
    private lateinit var tvChgUnderTempWarn: TextView

    private lateinit var rowChgOverTempWarn: LinearLayout
    private lateinit var cbChgOverTempWarn: CheckBox
    private lateinit var tvChgOverTempWarn: TextView

    private lateinit var rowDchgUnderTempWarn: LinearLayout
    private lateinit var cbDchgUnderTempWarn: CheckBox
    private lateinit var tvDchgUnderTempWarn: TextView

    private lateinit var rowDchgOverTempWarn: LinearLayout
    private lateinit var cbDchgOverTempWarn: CheckBox
    private lateinit var tvDchgOverTempWarn: TextView

    private lateinit var rowPreChgFetStatus: LinearLayout
    private lateinit var cbPreChgFetStatus: CheckBox
    private lateinit var tvPreChgFetStatus: TextView

    private lateinit var rowChgFetStatus: LinearLayout
    private lateinit var cbChgFetStatus: CheckBox
    private lateinit var tvChgFetStatus: TextView

    private lateinit var rowDchgFetStatus: LinearLayout
    private lateinit var cbDchgFetStatus: CheckBox
    private lateinit var tvDchgFetStatus: TextView

    private lateinit var rowResStatus: LinearLayout
    private lateinit var cbResStatus: CheckBox
    private lateinit var tvResStatus: TextView

    private lateinit var rowShortCktProt: LinearLayout
    private lateinit var cbShortCktProt: CheckBox
    private lateinit var tvShortCktProt: TextView

    private lateinit var rowDschgPeakProt: LinearLayout
    private lateinit var cbDschgPeakProt: CheckBox
    private lateinit var tvDschgPeakProt: TextView

    private lateinit var rowChgAuth: LinearLayout
    private lateinit var cbChgAuth: CheckBox
    private lateinit var tvChgAuth: TextView

    private lateinit var rowChgPeakProt: LinearLayout
    private lateinit var cbChgPeakProt: CheckBox
    private lateinit var tvChgPeakProt: TextView

    private lateinit var rowDI1: LinearLayout
    private lateinit var cbDI1: CheckBox
    private lateinit var tvDI1: TextView

    private lateinit var rowDI2: LinearLayout
    private lateinit var cbDI2: CheckBox
    private lateinit var tvDI2: TextView
    
    private lateinit var rowDO1: LinearLayout
    private lateinit var cbDO1: CheckBox
    private lateinit var tvDO1: TextView
    
    private lateinit var rowDO2: LinearLayout
    private lateinit var cbDO2: CheckBox
    private lateinit var tvDO2: TextView
    
    private lateinit var rowChargerDetection: LinearLayout
    private lateinit var cbChargerDetection: CheckBox
    private lateinit var tvChargerDetection: TextView
    
    private lateinit var rowCanCommDetection: LinearLayout
    private lateinit var cbCanCommDetection: CheckBox
    private lateinit var tvCanCommDetection: TextView
    
    private lateinit var rowCellBalFeatureStatus: LinearLayout
    private lateinit var cbCellBalFeatureStatus: CheckBox
    private lateinit var tvCellBalFeatureStatus: TextView
    
    private lateinit var rowImmoChg: LinearLayout
    private lateinit var cbImmoChg: CheckBox
    private lateinit var tvImmoChg: TextView
    
    private lateinit var rowImmoDchg: LinearLayout
    private lateinit var cbImmoDchg: CheckBox
    private lateinit var tvImmoDchg: TextView
    
    private lateinit var rowBuzzerStatus: LinearLayout
    private lateinit var cbBuzzerStatus: CheckBox
    private lateinit var tvBuzzerStatus: TextView
    
    private lateinit var rowSide_Stand_Ack: LinearLayout
    private lateinit var cbSide_Stand_Ack: CheckBox
    private lateinit var tvSide_Stand_Ack: TextView
    
    private lateinit var rowDirection_Ack: LinearLayout
    private lateinit var cbDirection_Ack: CheckBox
    private lateinit var tvDirection_Ack: TextView
    
    private lateinit var rowRide_Ack: LinearLayout
    private lateinit var cbRide_Ack: CheckBox
    private lateinit var tvRide_Ack: TextView
    
    private lateinit var rowHill_hold_Ack: LinearLayout
    private lateinit var cbHill_hold_Ack: CheckBox
    private lateinit var tvHill_hold_Ack: TextView
    
    private lateinit var rowWakeup_Ack: LinearLayout
    private lateinit var cbWakeup_Ack: CheckBox
    private lateinit var tvWakeup_Ack: TextView
    
    private lateinit var rowDriveError_Motor_hall: LinearLayout
    private lateinit var cbDriveError_Motor_hall: CheckBox
    private lateinit var tvDriveError_Motor_hall: TextView
    
    private lateinit var rowMotor_Stalling: LinearLayout
    private lateinit var cbMotor_Stalling: CheckBox
    private lateinit var tvMotor_Stalling: TextView
    
    private lateinit var rowMotor_Phase_loss: LinearLayout
    private lateinit var cbMotor_Phase_loss: CheckBox
    private lateinit var tvMotor_Phase_loss: TextView
    
    private lateinit var rowController_Over_Temeprature: LinearLayout
    private lateinit var cbController_Over_Temeprature: CheckBox
    private lateinit var tvController_Over_Temeprature: TextView
    
    private lateinit var rowMotor_Over_Temeprature: LinearLayout
    private lateinit var cbMotor_Over_Temeprature: CheckBox
    private lateinit var tvMotor_Over_Temeprature: TextView
    
    private lateinit var rowThrottle_Error: LinearLayout
    private lateinit var cbThrottle_Error: CheckBox
    private lateinit var tvThrottle_Error: TextView
    
    private lateinit var rowMOSFET_Protection: LinearLayout
    private lateinit var cbMOSFET_Protection: CheckBox
    private lateinit var tvMOSFET_Protection: TextView
    
    private lateinit var rowDriveStatus_Regenerative_Braking: LinearLayout
    private lateinit var cbDriveStatus_Regenerative_Braking: CheckBox
    private lateinit var tvDriveStatus_Regenerative_Braking: TextView
    
    private lateinit var rowModeR_Pulse: LinearLayout
    private lateinit var cbModeR_Pulse: CheckBox
    private lateinit var tvModeR_Pulse: TextView
    
    private lateinit var rowModeL_Pulse: LinearLayout
    private lateinit var cbModeL_Pulse: CheckBox
    private lateinit var tvModeL_Pulse: TextView
    
    private lateinit var rowBrake_Pulse: LinearLayout
    private lateinit var cbBrake_Pulse: CheckBox
    private lateinit var tvBrake_Pulse: TextView
    
    private lateinit var rowPark_Pulse: LinearLayout
    private lateinit var cbPark_Pulse: CheckBox
    private lateinit var tvPark_Pulse: TextView
    
    private lateinit var rowReverse_Pulse: LinearLayout
    private lateinit var cbReverse_Pulse: CheckBox
    private lateinit var tvReverse_Pulse: TextView
    
    private lateinit var rowSideStand_Pulse: LinearLayout
    private lateinit var cbSideStand_Pulse: CheckBox
    private lateinit var tvSideStand_Pulse: TextView
    
    private lateinit var rowForwardParking_Mode_Ack: LinearLayout
    private lateinit var cbForwardParking_Mode_Ack: CheckBox
    private lateinit var tvForwardParking_Mode_Ack: TextView
    
    private lateinit var rowDriveError_Controller_OverVoltag: LinearLayout
    private lateinit var cbDriveError_Controller_OverVoltag: CheckBox
    private lateinit var tvDriveError_Controller_OverVoltag: TextView
    
    private lateinit var rowController_Undervoltage: LinearLayout
    private lateinit var cbController_Undervoltage: CheckBox
    private lateinit var tvController_Undervoltage: TextView
    
    private lateinit var rowOvercurrent_Fault: LinearLayout
    private lateinit var cbOvercurrent_Fault: CheckBox
    private lateinit var tvOvercurrent_Fault: TextView
    
    private lateinit var rowDriveStatus1_ride: LinearLayout
    private lateinit var cbDriveStatus1_ride: CheckBox
    private lateinit var tvDriveStatus1_ride: TextView
    
    private lateinit var rowWakeup_Request: LinearLayout
    private lateinit var cbWakeup_Request: CheckBox
    private lateinit var tvWakeup_Request: TextView
    
    private lateinit var rowHill_Hold: LinearLayout
    private lateinit var cbHill_Hold: CheckBox
    private lateinit var tvHill_Hold: TextView
    
    private lateinit var rowReverse_REQUEST: LinearLayout
    private lateinit var cbReverse_REQUEST: CheckBox
    private lateinit var tvReverse_REQUEST: TextView
    
    private lateinit var rowForward_parkingmode_REQUEST: LinearLayout
    private lateinit var cbForward_parkingmode_REQUEST: CheckBox
    private lateinit var tvForward_parkingmode_REQUEST: TextView
    
    private lateinit var rowSide_stand_Req: LinearLayout
    private lateinit var cbSide_stand_Req: CheckBox
    private lateinit var tvSide_stand_Req: TextView
    
    private lateinit var rowBattery_charge_logic: LinearLayout
    private lateinit var cbBattery_charge_logic: CheckBox
    private lateinit var tvBattery_charge_logic: TextView
    
    private lateinit var rowRemote_cutoff: LinearLayout
    private lateinit var cbRemote_cutoff: CheckBox
    private lateinit var tvRemote_cutoff: TextView
    
    private lateinit var rowmode_limit: LinearLayout
    private lateinit var cbmode_limit: CheckBox
    private lateinit var tvmode_limit: TextView
    
    private lateinit var rowGeo_fencebuzzer: LinearLayout
    private lateinit var cbGeo_fencebuzzer: CheckBox
    private lateinit var tvGeo_fencebuzzer: TextView
    
    private lateinit var rowHoliday_mode: LinearLayout
    private lateinit var cbHoliday_mode: CheckBox
    private lateinit var tvHoliday_mode: TextView
    
    private lateinit var rowService_request: LinearLayout
    private lateinit var cbService_request: CheckBox
    private lateinit var tvService_request: TextView
    
    private lateinit var rowLow_Mode_REQUEST: LinearLayout
    private lateinit var cbLow_Mode_REQUEST: CheckBox
    private lateinit var tvLow_Mode_REQUEST: TextView
    
    private lateinit var rowMedium_Mode_REQUEST: LinearLayout
    private lateinit var cbMedium_Mode_REQUEST: CheckBox
    private lateinit var tvMedium_Mode_REQUEST: TextView
    
    private lateinit var rowUser_defind_mode_High_REQUEST: LinearLayout
    private lateinit var cbUser_defind_mode_High_REQUEST: CheckBox
    private lateinit var tvUser_defind_mode_High_REQUEST: TextView
    
    private lateinit var rowLimp_mode_REQUEST: LinearLayout
    private lateinit var cbLimp_mode_REQUEST: CheckBox
    private lateinit var tvLimp_mode_REQUEST: TextView

    private lateinit var rowSW_Version_MAJ: LinearLayout
    private lateinit var cbSW_Version_MAJ: CheckBox
    private lateinit var tvSW_Version_MAJ: TextView

    private lateinit var rowSW_Version_MIN: LinearLayout
    private lateinit var cbSW_Version_MIN: CheckBox
    private lateinit var tvSW_Version_MIN: TextView

    private lateinit var rowHW_Version_MAJ: LinearLayout
    private lateinit var cbHW_Version_MAJ: CheckBox
    private lateinit var tvHW_Version_MAJ: TextView

    private lateinit var rowHW_Version_MIN: LinearLayout
    private lateinit var cbHW_Version_MIN: CheckBox
    private lateinit var tvHW_Version_MIN: TextView

    private lateinit var rowMCU_Firmware_Id: LinearLayout
    private lateinit var cbMCU_Firmware_Id: CheckBox
    private lateinit var tvMCU_Firmware_Id: TextView
    
    // File saving
    private var saveFileUri: Uri? = null
    private var headersWritten = false
    private var job: Job? = null

    // Two new booleans for controlling UI logic
    private var isSelectionMode = false   // If true, shows checkboxes
    private var showSelectedOnly = false  // If true, only show rows with checked boxes

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
        val ConfigVerDecoder = eightBytesASCIIDecode("14", 2, 3, 4)
        val InternalFWVerDecoder = eightBytesASCIIDecode("14", 5, 6, 7)
        val InternalFWSubVerDecoder = eightBytesASCIIDecode("14", 8, 9)
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
        val HwVerDecoder = eightBytesASCIIDecode("06", 10, 11, 12)
        val FwVerDecoder = eightBytesASCIIDecode("06", 13, 14, 15)
        val FWSubVerDecoder = eightBytesASCIIDecode("06", 16, 17)
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
        val ChgStatus_chg_idleDecoder = eightBytesDecode("19", 1.0, 14)
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
        val SW_Version_MAJDecoder = eightBytesDecode("05", 1.0, 9)
        val SW_Version_MINDecoder = eightBytesDecode("05", 1.0, 10)
        val HW_Version_MAJDecoder = eightBytesDecode("05", 1.0, 11)
        val HW_Version_MINDecoder = eightBytesDecode("05", 1.0, 12)
        val MCU_Firmware_IdDecoder = eightBytesASCIIDecode("04", 15, 14, 13, 12, 11, 10, 9, 8)

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
        val Controller_Over_TemepratureDecoder = bitDecode("02", 8, 3)
        val Motor_Over_TemepratureDecoder = bitDecode("02", 8, 4)
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

        fun threeBitDecode(firstByteCheck: Int, bytePosition: Int, bit1: Int, bit2: Int, bit3: Int): (String) -> Int? {
            return { data ->
                if (data.length >= 2 * (bytePosition + 1) &&
                    data.substring(0, 2) == firstByteCheck.toString().padStart(2, '0')
                ) {
                    val byte = data.substring(2 * bytePosition, 2 * bytePosition + 2)
                    val bits = byte.toInt(16).toString(2).padStart(8, '0')
                    val resultBits = "${bits[7 - bit1]}${bits[7 - bit2]}${bits[7 - bit3]}"
                    resultBits.toInt(2)
                } else {
                    null
                }
            }
        }
        fun eightBytesASCIIDecode(firstByteCheck: String, vararg positions: Int): (String) -> String? {
            return { data ->
                if (data.length >= 2 * positions.size && data.substring(0, 2) == firstByteCheck) {
                    val bytes = positions.map { pos ->
                        val hexValue = data.substring(2 * pos, 2 * pos + 2)
                        val decimalValue = hexValue.toInt(16)
                        decimalValue.toChar()
                    }.joinToString("")
                    bytes
                } else {
                    null
                }
            }
        }
    }

    // ---------------------------------------------------------------------------------------------
    // Activity Lifecycle
    // ---------------------------------------------------------------------------------------------
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receive)

        // 1) Find row + checkbox + textview references for each parameter
        rowCellVol01      = findViewById(R.id.rowCellVol01)
        cbCellVol01       = findViewById(R.id.cbCellVol01)
        tvCellVol01       = findViewById(R.id.tvCellVol01)

        rowCellVol02      = findViewById(R.id.rowCellVol02)
        cbCellVol02       = findViewById(R.id.cbCellVol02)
        tvCellVol02       = findViewById(R.id.tvCellVol02)
        
        rowCellVol03      = findViewById(R.id.rowCellVol03)
        cbCellVol03       = findViewById(R.id.cbCellVol03)
        tvCellVol03       = findViewById(R.id.tvCellVol03)
        
        rowCellVol04      = findViewById(R.id.rowCellVol04)
        cbCellVol04       = findViewById(R.id.cbCellVol04)
        tvCellVol04       = findViewById(R.id.tvCellVol04)
        
        rowCellVol05      = findViewById(R.id.rowCellVol05)
        cbCellVol05       = findViewById(R.id.cbCellVol05)
        tvCellVol05       = findViewById(R.id.tvCellVol05)
        
        rowCellVol06      = findViewById(R.id.rowCellVol06)
        cbCellVol06       = findViewById(R.id.cbCellVol06)
        tvCellVol06       = findViewById(R.id.tvCellVol06)
        
        rowCellVol07      = findViewById(R.id.rowCellVol07)
        cbCellVol07       = findViewById(R.id.cbCellVol07)
        tvCellVol07       = findViewById(R.id.tvCellVol07)
        
        rowCellVol08      = findViewById(R.id.rowCellVol08)
        cbCellVol08       = findViewById(R.id.cbCellVol08)
        tvCellVol08       = findViewById(R.id.tvCellVol08)
        
        rowCellVol09      = findViewById(R.id.rowCellVol09)
        cbCellVol09       = findViewById(R.id.cbCellVol09)
        tvCellVol09       = findViewById(R.id.tvCellVol09)
        
        rowCellVol10      = findViewById(R.id.rowCellVol10)
        cbCellVol10       = findViewById(R.id.cbCellVol10)
        tvCellVol10       = findViewById(R.id.tvCellVol10)
        
        rowCellVol11      = findViewById(R.id.rowCellVol11)
        cbCellVol11       = findViewById(R.id.cbCellVol11)
        tvCellVol11       = findViewById(R.id.tvCellVol11)
        
        rowCellVol12      = findViewById(R.id.rowCellVol12)
        cbCellVol12       = findViewById(R.id.cbCellVol12)
        tvCellVol12       = findViewById(R.id.tvCellVol12)
        
        rowCellVol13      = findViewById(R.id.rowCellVol13)
        cbCellVol13       = findViewById(R.id.cbCellVol13)
        tvCellVol13       = findViewById(R.id.tvCellVol13)
        
        rowCellVol14      = findViewById(R.id.rowCellVol14)
        cbCellVol14       = findViewById(R.id.cbCellVol14)
        tvCellVol14       = findViewById(R.id.tvCellVol14)
        
        rowCellVol15      = findViewById(R.id.rowCellVol15)
        cbCellVol15       = findViewById(R.id.cbCellVol15)
        tvCellVol15       = findViewById(R.id.tvCellVol15)
        
        rowCellVol16      = findViewById(R.id.rowCellVol16)
        cbCellVol16       = findViewById(R.id.cbCellVol16)
        tvCellVol16       = findViewById(R.id.tvCellVol16)
        
        rowMaxCellVol     = findViewById(R.id.rowMaxCellVol)
        cbMaxCellVol      = findViewById(R.id.cbMaxCellVol)
        tvMaxCellVol      = findViewById(R.id.tvMaxCellVol)
        
        rowMinCellVol     = findViewById(R.id.rowMinCellVol)
        cbMinCellVol      = findViewById(R.id.cbMinCellVol)
        tvMinCellVol      = findViewById(R.id.tvMinCellVol)
        
        rowAvgCellVol     = findViewById(R.id.rowAvgCellVol)
        cbAvgCellVol      = findViewById(R.id.cbAvgCellVol)
        tvAvgCellVol      = findViewById(R.id.tvAvgCellVol)
        
        rowMaxVoltId      = findViewById(R.id.rowMaxVoltId)
        cbMaxVoltId       = findViewById(R.id.cbMaxVoltId)
        tvMaxVoltId       = findViewById(R.id.tvMaxVoltId)
        
        rowMinVoltId      = findViewById(R.id.rowMinVoltId)
        cbMinVoltId       = findViewById(R.id.cbMinVoltId)
        tvMinVoltId       = findViewById(R.id.tvMinVoltId)
        
        rowPackVol        = findViewById(R.id.rowPackVol)
        cbPackVol         = findViewById(R.id.cbPackVol)
        tvPackVol         = findViewById(R.id.tvPackVol)
        
        rowCycleCount     = findViewById(R.id.rowCycleCount)
        cbCycleCount      = findViewById(R.id.cbCycleCount)
        tvCycleCount      = findViewById(R.id.tvCycleCount)
        
        rowCellVolMinMaxDev = findViewById(R.id.rowCellVolMinMaxDev)
        cbCellVolMinMaxDev  = findViewById(R.id.cbCellVolMinMaxDev)
        tvCellVolMinMaxDev  = findViewById(R.id.tvCellVolMinMaxDev)
        
        rowSOC            = findViewById(R.id.rowSOC)
        cbSOC             = findViewById(R.id.cbSOC)
        tvSOC             = findViewById(R.id.tvSOC)
        
        rowSOCAh          = findViewById(R.id.rowSOCAh)
        cbSOCAh           = findViewById(R.id.cbSOCAh)
        tvSOCAh           = findViewById(R.id.tvSOCAh)
        
        rowSOH            = findViewById(R.id.rowSOH)
        cbSOH             = findViewById(R.id.cbSOH)
        tvSOH             = findViewById(R.id.tvSOH)
        
        rowBmsStatus      = findViewById(R.id.rowBmsStatus)
        cbBmsStatus       = findViewById(R.id.cbBmsStatus)
        tvBmsStatus       = findViewById(R.id.tvBmsStatus)
        
        rowLedStatus      = findViewById(R.id.rowLedStatus)
        cbLedStatus       = findViewById(R.id.cbLedStatus)
        tvLedStatus       = findViewById(R.id.tvLedStatus)
        
        rowActiveCellBalStatus = findViewById(R.id.rowActiveCellBalStatus)
        cbActiveCellBalStatus  = findViewById(R.id.cbActiveCellBalStatus)
        tvActiveCellBalStatus  = findViewById(R.id.tvActiveCellBalStatus)
        
        rowBMS_Serial_No_MUX = findViewById(R.id.rowBMS_Serial_No_MUX)
        cbBMS_Serial_No_MUX  = findViewById(R.id.cbBMS_Serial_No_MUX)
        tvBMS_Serial_No_MUX  = findViewById(R.id.tvBMS_Serial_No_MUX)
        
        rowBMS_Serial_No__1_7 = findViewById(R.id.rowBMS_Serial_No__1_7)
        cbBMS_Serial_No__1_7  = findViewById(R.id.cbBMS_Serial_No__1_7)
        tvBMS_Serial_No__1_7  = findViewById(R.id.tvBMS_Serial_No__1_7)
        
        rowLatchProtection = findViewById(R.id.rowLatchProtection)
        cbLatchProtection  = findViewById(R.id.cbLatchProtection)
        tvLatchProtection  = findViewById(R.id.tvLatchProtection)
        
        rowLatchType       = findViewById(R.id.rowLatchType)
        cbLatchType        = findViewById(R.id.cbLatchType)
        tvLatchType        = findViewById(R.id.tvLatchType)
        
        rowChargerType     = findViewById(R.id.rowChargerType)
        cbChargerType      = findViewById(R.id.cbChargerType)
        tvChargerType      = findViewById(R.id.tvChargerType)
        
        rowPcbTemp         = findViewById(R.id.rowPcbTemp)
        cbPcbTemp          = findViewById(R.id.cbPcbTemp)
        tvPcbTemp          = findViewById(R.id.tvPcbTemp)
        
        rowAfeTemp         = findViewById(R.id.rowAfeTemp)
        cbAfeTemp          = findViewById(R.id.cbAfeTemp)
        tvAfeTemp          = findViewById(R.id.tvAfeTemp)
        
        rowCellChemType    = findViewById(R.id.rowCellChemType)
        cbCellChemType     = findViewById(R.id.cbCellChemType)
        tvCellChemType     = findViewById(R.id.tvCellChemType)
        
        rowChg_Accumulative_Ah = findViewById(R.id.rowChg_Accumulative_Ah)
        cbChg_Accumulative_Ah  = findViewById(R.id.cbChg_Accumulative_Ah)
        tvChg_Accumulative_Ah  = findViewById(R.id.tvChg_Accumulative_Ah)
        
        rowDchg_Accumulative_Ah = findViewById(R.id.rowDchg_Accumulative_Ah)
        cbDchg_Accumulative_Ah  = findViewById(R.id.cbDchg_Accumulative_Ah)
        tvDchg_Accumulative_Ah  = findViewById(R.id.tvDchg_Accumulative_Ah)
        
        rowRefVol          = findViewById(R.id.rowRefVol)
        cbRefVol           = findViewById(R.id.cbRefVol)
        tvRefVol           = findViewById(R.id.tvRefVol)
        
        row_3v3Vol         = findViewById(R.id.row_3v3Vol)
        cb_3v3Vol          = findViewById(R.id.cb_3v3Vol)
        tv_3v3Vol          = findViewById(R.id.tv_3v3Vol)
        
        row_5vVol          = findViewById(R.id.row_5vVol)
        cb_5vVol           = findViewById(R.id.cb_5vVol)
        tv_5vVol           = findViewById(R.id.tv_5vVol)
        
        row_12vVol         = findViewById(R.id.row_12vVol)
        cb_12vVol          = findViewById(R.id.cb_12vVol)
        tv_12vVol          = findViewById(R.id.tv_12vVol)
        
        rowActual_SoC      = findViewById(R.id.rowActual_SoC)
        cbActual_SoC       = findViewById(R.id.cbActual_SoC)
        tvActual_SoC       = findViewById(R.id.tvActual_SoC)
        
        rowUsable_Capacity_Ah = findViewById(R.id.rowUsable_Capacity_Ah)
        cbUsable_Capacity_Ah  = findViewById(R.id.cbUsable_Capacity_Ah)
        tvUsable_Capacity_Ah  = findViewById(R.id.tvUsable_Capacity_Ah)
        
        rowConfigVer       = findViewById(R.id.rowConfigVer)
        cbConfigVer        = findViewById(R.id.cbConfigVer)
        tvConfigVer        = findViewById(R.id.tvConfigVer)
        
        rowInternalFWVer   = findViewById(R.id.rowInternalFWVer)
        cbInternalFWVer    = findViewById(R.id.cbInternalFWVer)
        tvInternalFWVer    = findViewById(R.id.tvInternalFWVer)
        
        rowInternalFWSubVer = findViewById(R.id.rowInternalFWSubVer)
        cbInternalFWSubVer  = findViewById(R.id.cbInternalFWSubVer)
        tvInternalFWSubVer  = findViewById(R.id.tvInternalFWSubVer)
        
        rowBHB_66049       = findViewById(R.id.rowBHB_66049)
        cbBHB_66049        = findViewById(R.id.cbBHB_66049)
        tvBHB_66049        = findViewById(R.id.tvBHB_66049)
        
        rowPackCurr        = findViewById(R.id.rowPackCurr)
        cbPackCurr         = findViewById(R.id.cbPackCurr)
        tvPackCurr         = findViewById(R.id.tvPackCurr)
        
        rowMaxTemp         = findViewById(R.id.rowMaxTemp)
        cbMaxTemp          = findViewById(R.id.cbMaxTemp)
        tvMaxTemp          = findViewById(R.id.tvMaxTemp)
        
        rowMinTemp         = findViewById(R.id.rowMinTemp)
        cbMinTemp          = findViewById(R.id.cbMinTemp)
        tvMinTemp          = findViewById(R.id.tvMinTemp)
        
        rowFetTemp         = findViewById(R.id.rowFetTemp)
        cbFetTemp          = findViewById(R.id.cbFetTemp)
        tvFetTemp          = findViewById(R.id.tvFetTemp)
        
        rowTemp1           = findViewById(R.id.rowTemp1)
        cbTemp1            = findViewById(R.id.cbTemp1)
        tvTemp1            = findViewById(R.id.tvTemp1)
        
        rowTemp2           = findViewById(R.id.rowTemp2)
        cbTemp2            = findViewById(R.id.cbTemp2)
        tvTemp2            = findViewById(R.id.tvTemp2)
        
        rowTemp3           = findViewById(R.id.rowTemp3)
        cbTemp3            = findViewById(R.id.cbTemp3)
        tvTemp3            = findViewById(R.id.tvTemp3)
        
        rowTemp4           = findViewById(R.id.rowTemp4)
        cbTemp4            = findViewById(R.id.cbTemp4)
        tvTemp4            = findViewById(R.id.tvTemp4)
        
        rowTemp5           = findViewById(R.id.rowTemp5)
        cbTemp5            = findViewById(R.id.cbTemp5)
        tvTemp5            = findViewById(R.id.tvTemp5)
        
        rowTemp6           = findViewById(R.id.rowTemp6)
        cbTemp6            = findViewById(R.id.cbTemp6)
        tvTemp6            = findViewById(R.id.tvTemp6)
        
        rowTemp7           = findViewById(R.id.rowTemp7)
        cbTemp7            = findViewById(R.id.cbTemp7)
        tvTemp7            = findViewById(R.id.tvTemp7)
        
        rowTemp8           = findViewById(R.id.rowTemp8)
        cbTemp8            = findViewById(R.id.cbTemp8)
        tvTemp8            = findViewById(R.id.tvTemp8)
        
        rowHwVer           = findViewById(R.id.rowHwVer)
        cbHwVer            = findViewById(R.id.cbHwVer)
        tvHwVer            = findViewById(R.id.tvHwVer)
        
        rowFwVer           = findViewById(R.id.rowFwVer)
        cbFwVer            = findViewById(R.id.cbFwVer)
        tvFwVer            = findViewById(R.id.tvFwVer)
        
        rowFWSubVer        = findViewById(R.id.rowFWSubVer)
        cbFWSubVer         = findViewById(R.id.cbFWSubVer)
        tvFWSubVer         = findViewById(R.id.tvFWSubVer)
        
        rowBtStatus_NC0PSM1CC2CV3Finish4 = findViewById(R.id.rowBtStatus_NC0PSM1CC2CV3Finish4)
        cbBtStatus_NC0PSM1CC2CV3Finish4  = findViewById(R.id.cbBtStatus_NC0PSM1CC2CV3Finish4)
        tvBtStatus_NC0PSM1CC2CV3Finish4  = findViewById(R.id.tvBtStatus_NC0PSM1CC2CV3Finish4)
        
        rowBt_liveMsg1Temp = findViewById(R.id.rowBt_liveMsg1Temp)
        cbBt_liveMsg1Temp  = findViewById(R.id.cbBt_liveMsg1Temp)
        tvBt_liveMsg1Temp  = findViewById(R.id.tvBt_liveMsg1Temp)
        
        rowBt_liveMsg_soc  = findViewById(R.id.rowBt_liveMsg_soc)
        cbBt_liveMsg_soc   = findViewById(R.id.cbBt_liveMsg_soc)
        tvBt_liveMsg_soc   = findViewById(R.id.tvBt_liveMsg_soc)
        
        rowBMS_status      = findViewById(R.id.rowBMS_status)
        cbBMS_status       = findViewById(R.id.cbBMS_status)
        tvBMS_status       = findViewById(R.id.tvBMS_status)
        
        rowDemand_voltage  = findViewById(R.id.rowDemand_voltage)
        cbDemand_voltage   = findViewById(R.id.cbDemand_voltage)
        tvDemand_voltage   = findViewById(R.id.tvDemand_voltage)
        
        rowDemand_Current  = findViewById(R.id.rowDemand_Current)
        cbDemand_Current   = findViewById(R.id.cbDemand_Current)
        tvDemand_Current   = findViewById(R.id.tvDemand_Current)
        
        rowMaxChgVoltgae   = findViewById(R.id.rowMaxChgVoltgae)
        cbMaxChgVoltgae    = findViewById(R.id.cbMaxChgVoltgae)
        tvMaxChgVoltgae    = findViewById(R.id.tvMaxChgVoltgae)
        
        rowMaxChgCurrent   = findViewById(R.id.rowMaxChgCurrent)
        cbMaxChgCurrent    = findViewById(R.id.cbMaxChgCurrent)
        tvMaxChgCurrent    = findViewById(R.id.tvMaxChgCurrent)
        
        rowActualChgVoltage = findViewById(R.id.rowActualChgVoltage)
        cbActualChgVoltage  = findViewById(R.id.cbActualChgVoltage)
        tvActualChgVoltage  = findViewById(R.id.tvActualChgVoltage)
        
        rowActualChgCurrent = findViewById(R.id.rowActualChgCurrent)
        cbActualChgCurrent  = findViewById(R.id.cbActualChgCurrent)
        tvActualChgCurrent  = findViewById(R.id.tvActualChgCurrent)
        
        rowCharging_end_cutoff_Curr = findViewById(R.id.rowCharging_end_cutoff_Curr)
        cbCharging_end_cutoff_Curr  = findViewById(R.id.cbCharging_end_cutoff_Curr)
        tvCharging_end_cutoff_Curr  = findViewById(R.id.tvCharging_end_cutoff_Curr)
        
        rowCHB_258         = findViewById(R.id.rowCHB_258)
        cbCHB_258          = findViewById(R.id.cbCHB_258)
        tvCHB_258          = findViewById(R.id.tvCHB_258)
        
        rowChgrNC0PSM1CC2CV3Finsh4 = findViewById(R.id.rowChgrNC0PSM1CC2CV3Finsh4)
        cbChgrNC0PSM1CC2CV3Finsh4  = findViewById(R.id.cbChgrNC0PSM1CC2CV3Finsh4)
        tvChgrNC0PSM1CC2CV3Finsh4  = findViewById(R.id.tvChgrNC0PSM1CC2CV3Finsh4)
        
        rowchgr_msg_temp   = findViewById(R.id.rowchgr_msg_temp)
        cbchgr_msg_temp    = findViewById(R.id.cbchgr_msg_temp)
        tvchgr_msg_temp    = findViewById(R.id.tvchgr_msg_temp)
        
        rowChgStatus_chg_idle = findViewById(R.id.rowChgStatus_chg_idle)
        cbChgStatus_chg_idle  = findViewById(R.id.cbChgStatus_chg_idle)
        tvChgStatus_chg_idle  = findViewById(R.id.tvChgStatus_chg_idle)
        
        rowchgrLiveMsgChgVolt = findViewById(R.id.rowchgrLiveMsgChgVolt)
        cbchgrLiveMsgChgVolt  = findViewById(R.id.cbchgrLiveMsgChgVolt)
        tvchgrLiveMsgChgVolt  = findViewById(R.id.tvchgrLiveMsgChgVolt)
        
        rowchgrLiveMsgChgCurrent = findViewById(R.id.rowchgrLiveMsgChgCurrent)
        cbchgrLiveMsgChgCurrent  = findViewById(R.id.cbchgrLiveMsgChgCurrent)
        tvchgrLiveMsgChgCurrent  = findViewById(R.id.tvchgrLiveMsgChgCurrent)
        
        rowChargeSOP       = findViewById(R.id.rowChargeSOP)
        cbChargeSOP        = findViewById(R.id.cbChargeSOP)
        tvChargeSOP        = findViewById(R.id.tvChargeSOP)
        
        rowDchgSOP         = findViewById(R.id.rowDchgSOP)
        cbDchgSOP          = findViewById(R.id.cbDchgSOP)
        tvDchgSOP          = findViewById(R.id.tvDchgSOP)
        
        rowDrive_Error_Flag = findViewById(R.id.rowDrive_Error_Flag)
        cbDrive_Error_Flag  = findViewById(R.id.cbDrive_Error_Flag)
        tvDrive_Error_Flag  = findViewById(R.id.tvDrive_Error_Flag)
        
        rowSet_Regen       = findViewById(R.id.rowSet_Regen)
        cbSet_Regen        = findViewById(R.id.cbSet_Regen)
        tvSet_Regen        = findViewById(R.id.tvSet_Regen)
        
        rowDCcurrentlimit  = findViewById(R.id.rowDCcurrentlimit)
        cbDCcurrentlimit   = findViewById(R.id.cbDCcurrentlimit)
        tvDCcurrentlimit   = findViewById(R.id.tvDCcurrentlimit)
        
        rowCustom_freq     = findViewById(R.id.rowCustom_freq)
        cbCustom_freq      = findViewById(R.id.cbCustom_freq)
        tvCustom_freq      = findViewById(R.id.tvCustom_freq)
        
        rowCustom_torque   = findViewById(R.id.rowCustom_torque)
        cbCustom_torque    = findViewById(R.id.cbCustom_torque)
        tvCustom_torque    = findViewById(R.id.tvCustom_torque)
        
        rowBuffer_speed    = findViewById(R.id.rowBuffer_speed)
        cbBuffer_speed     = findViewById(R.id.cbBuffer_speed)
        tvBuffer_speed     = findViewById(R.id.tvBuffer_speed)
        
        rowBase_speed      = findViewById(R.id.rowBase_speed)
        cbBase_speed       = findViewById(R.id.cbBase_speed)
        tvBase_speed       = findViewById(R.id.tvBase_speed)
        
        rowInitial_torque  = findViewById(R.id.rowInitial_torque)
        cbInitial_torque   = findViewById(R.id.cbInitial_torque)
        tvInitial_torque   = findViewById(R.id.tvInitial_torque)
        
        rowFinal_torque    = findViewById(R.id.rowFinal_torque)
        cbFinal_torque     = findViewById(R.id.cbFinal_torque)
        tvFinal_torque     = findViewById(R.id.tvFinal_torque)
        
        rowCluster_odo     = findViewById(R.id.rowCluster_odo)
        cbCluster_odo      = findViewById(R.id.cbCluster_odo)
        tvCluster_odo      = findViewById(R.id.tvCluster_odo)
        
        rowMode_Ack        = findViewById(R.id.rowMode_Ack)
        cbMode_Ack         = findViewById(R.id.cbMode_Ack)
        tvMode_Ack         = findViewById(R.id.tvMode_Ack)
        
        rowMotorSpeed      = findViewById(R.id.rowMotorSpeed)
        cbMotorSpeed       = findViewById(R.id.cbMotorSpeed)
        tvMotorSpeed       = findViewById(R.id.tvMotorSpeed)
        
        rowBatteryVoltage  = findViewById(R.id.rowBatteryVoltage)
        cbBatteryVoltage   = findViewById(R.id.cbBatteryVoltage)
        tvBatteryVoltage   = findViewById(R.id.tvBatteryVoltage)
        
        rowBatteryCurrent  = findViewById(R.id.rowBatteryCurrent)
        cbBatteryCurrent   = findViewById(R.id.cbBatteryCurrent)
        tvBatteryCurrent   = findViewById(R.id.tvBatteryCurrent)
        
        rowAC_Current      = findViewById(R.id.rowAC_Current)
        cbAC_Current       = findViewById(R.id.cbAC_Current)
        tvAC_Current       = findViewById(R.id.tvAC_Current)
        
        rowAC_Voltage      = findViewById(R.id.rowAC_Voltage)
        cbAC_Voltage       = findViewById(R.id.cbAC_Voltage)
        tvAC_Voltage       = findViewById(R.id.tvAC_Voltage)
        
        rowThrottle        = findViewById(R.id.rowThrottle)
        cbThrottle         = findViewById(R.id.cbThrottle)
        tvThrottle         = findViewById(R.id.tvThrottle)
        
        rowMCU_Temperature = findViewById(R.id.rowMCU_Temperature)
        cbMCU_Temperature  = findViewById(R.id.cbMCU_Temperature)
        tvMCU_Temperature  = findViewById(R.id.tvMCU_Temperature)
        
        rowMotor_Temperature = findViewById(R.id.rowMotor_Temperature)
        cbMotor_Temperature  = findViewById(R.id.cbMotor_Temperature)
        tvMotor_Temperature  = findViewById(R.id.tvMotor_Temperature)
        
        rowMCU_Fault_Code  = findViewById(R.id.rowMCU_Fault_Code)
        cbMCU_Fault_Code   = findViewById(R.id.cbMCU_Fault_Code)
        tvMCU_Fault_Code   = findViewById(R.id.tvMCU_Fault_Code)
        
        rowMCU_ID          = findViewById(R.id.rowMCU_ID)
        cbMCU_ID           = findViewById(R.id.cbMCU_ID)
        tvMCU_ID           = findViewById(R.id.tvMCU_ID)
        
        rowCluster_heartbeat = findViewById(R.id.rowCluster_heartbeat)
        cbCluster_heartbeat  = findViewById(R.id.cbCluster_heartbeat)
        tvCluster_heartbeat  = findViewById(R.id.tvCluster_heartbeat)
        
        rowOdo_Cluster     = findViewById(R.id.rowOdo_Cluster)
        cbOdo_Cluster      = findViewById(R.id.cbOdo_Cluster)
        tvOdo_Cluster      = findViewById(R.id.tvOdo_Cluster)

        rowSW_Version_MAJ     = findViewById(R.id.rowSW_Version_MAJ)
        cbSW_Version_MAJ      = findViewById(R.id.cbSW_Version_MAJ)
        tvSW_Version_MAJ      = findViewById(R.id.tvSW_Version_MAJ)

        rowSW_Version_MIN     = findViewById(R.id.rowSW_Version_MIN)
        cbSW_Version_MIN      = findViewById(R.id.cbSW_Version_MIN)
        tvSW_Version_MIN      = findViewById(R.id.tvSW_Version_MIN)

        rowHW_Version_MAJ     = findViewById(R.id.rowHW_Version_MAJ)
        cbHW_Version_MAJ      = findViewById(R.id.cbHW_Version_MAJ)
        tvHW_Version_MAJ      = findViewById(R.id.tvHW_Version_MAJ)

        rowHW_Version_MIN     = findViewById(R.id.rowHW_Version_MIN)
        cbHW_Version_MIN      = findViewById(R.id.cbHW_Version_MIN)
        tvHW_Version_MIN      = findViewById(R.id.tvHW_Version_MIN)

        rowMCU_Firmware_Id     = findViewById(R.id.rowMCU_Firmware_Id)
        cbMCU_Firmware_Id      = findViewById(R.id.cbMCU_Firmware_Id)
        tvMCU_Firmware_Id      = findViewById(R.id.tvMCU_Firmware_Id)
        
        rowIgnitionStatus  = findViewById(R.id.rowIgnitionStatus)
        cbIgnitionStatus   = findViewById(R.id.cbIgnitionStatus)
        tvIgnitionStatus   = findViewById(R.id.tvIgnitionStatus)
        
        rowLoadDetection   = findViewById(R.id.rowLoadDetection)
        cbLoadDetection    = findViewById(R.id.cbLoadDetection)
        tvLoadDetection    = findViewById(R.id.tvLoadDetection)
        
        rowKeystatus       = findViewById(R.id.rowKeystatus)
        cbKeystatus        = findViewById(R.id.cbKeystatus)
        tvKeystatus        = findViewById(R.id.tvKeystatus)
        
        rowKeyevents       = findViewById(R.id.rowKeyevents)
        cbKeyevents        = findViewById(R.id.cbKeyevents)
        tvKeyevents        = findViewById(R.id.tvKeyevents)
        
        rowCellUnderVolProt = findViewById(R.id.rowCellUnderVolProt)
        cbCellUnderVolProt  = findViewById(R.id.cbCellUnderVolProt)
        tvCellUnderVolProt  = findViewById(R.id.tvCellUnderVolProt)
        
        rowCellOverVolProt = findViewById(R.id.rowCellOverVolProt)
        cbCellOverVolProt  = findViewById(R.id.cbCellOverVolProt)
        tvCellOverVolProt  = findViewById(R.id.tvCellOverVolProt)
        
        rowPackUnderVolProt = findViewById(R.id.rowPackUnderVolProt)
        cbPackUnderVolProt  = findViewById(R.id.cbPackUnderVolProt)
        tvPackUnderVolProt  = findViewById(R.id.tvPackUnderVolProt)
        
        rowPackOverVolProt = findViewById(R.id.rowPackOverVolProt)
        cbPackOverVolProt  = findViewById(R.id.cbPackOverVolProt)
        tvPackOverVolProt  = findViewById(R.id.tvPackOverVolProt)
        
        rowChgUnderTempProt = findViewById(R.id.rowChgUnderTempProt)
        cbChgUnderTempProt  = findViewById(R.id.cbChgUnderTempProt)
        tvChgUnderTempProt  = findViewById(R.id.tvChgUnderTempProt)
        
        rowChgOverTempProt = findViewById(R.id.rowChgOverTempProt)
        cbChgOverTempProt  = findViewById(R.id.cbChgOverTempProt)
        tvChgOverTempProt  = findViewById(R.id.tvChgOverTempProt)
        
        rowDchgUnderTempProt = findViewById(R.id.rowDchgUnderTempProt)
        cbDchgUnderTempProt  = findViewById(R.id.cbDchgUnderTempProt)
        tvDchgUnderTempProt  = findViewById(R.id.tvDchgUnderTempProt)
        
        rowDchgOverTempProt = findViewById(R.id.rowDchgOverTempProt)
        cbDchgOverTempProt  = findViewById(R.id.cbDchgOverTempProt)
        tvDchgOverTempProt  = findViewById(R.id.tvDchgOverTempProt)
        
        rowCellOverDevProt = findViewById(R.id.rowCellOverDevProt)
        cbCellOverDevProt  = findViewById(R.id.cbCellOverDevProt)
        tvCellOverDevProt  = findViewById(R.id.tvCellOverDevProt)
        
        rowBattLowSocWarn  = findViewById(R.id.rowBattLowSocWarn)
        cbBattLowSocWarn   = findViewById(R.id.cbBattLowSocWarn)
        tvBattLowSocWarn   = findViewById(R.id.tvBattLowSocWarn)
        
        rowChgOverCurrProt = findViewById(R.id.rowChgOverCurrProt)
        cbChgOverCurrProt  = findViewById(R.id.cbChgOverCurrProt)
        tvChgOverCurrProt  = findViewById(R.id.tvChgOverCurrProt)
        
        rowDchgOverCurrProt = findViewById(R.id.rowDchgOverCurrProt)
        cbDchgOverCurrProt  = findViewById(R.id.cbDchgOverCurrProt)
        tvDchgOverCurrProt  = findViewById(R.id.tvDchgOverCurrProt)
        
        rowCellUnderVolWarn = findViewById(R.id.rowCellUnderVolWarn)
        cbCellUnderVolWarn  = findViewById(R.id.cbCellUnderVolWarn)
        tvCellUnderVolWarn  = findViewById(R.id.tvCellUnderVolWarn)
        
        rowCellOverVolWarn = findViewById(R.id.rowCellOverVolWarn)
        cbCellOverVolWarn  = findViewById(R.id.cbCellOverVolWarn)
        tvCellOverVolWarn  = findViewById(R.id.tvCellOverVolWarn)
        
        rowFetTempProt     = findViewById(R.id.rowFetTempProt)
        cbFetTempProt      = findViewById(R.id.cbFetTempProt)
        tvFetTempProt      = findViewById(R.id.tvFetTempProt)
        
        rowResSocProt      = findViewById(R.id.rowResSocProt)
        cbResSocProt       = findViewById(R.id.cbResSocProt)
        tvResSocProt       = findViewById(R.id.tvResSocProt)
        
        rowFetFailure      = findViewById(R.id.rowFetFailure)
        cbFetFailure       = findViewById(R.id.cbFetFailure)
        tvFetFailure       = findViewById(R.id.tvFetFailure)
        
        rowTempSenseFault  = findViewById(R.id.rowTempSenseFault)
        cbTempSenseFault   = findViewById(R.id.cbTempSenseFault)
        tvTempSenseFault   = findViewById(R.id.tvTempSenseFault)
        
        rowPackUnderVolWarn = findViewById(R.id.rowPackUnderVolWarn)
        cbPackUnderVolWarn  = findViewById(R.id.cbPackUnderVolWarn)
        tvPackUnderVolWarn  = findViewById(R.id.tvPackUnderVolWarn)
        
        rowPackOverVolWarn = findViewById(R.id.rowPackOverVolWarn)
        cbPackOverVolWarn  = findViewById(R.id.cbPackOverVolWarn)
        tvPackOverVolWarn  = findViewById(R.id.tvPackOverVolWarn)
        
        rowChgUnderTempWarn = findViewById(R.id.rowChgUnderTempWarn)
        cbChgUnderTempWarn  = findViewById(R.id.cbChgUnderTempWarn)
        tvChgUnderTempWarn  = findViewById(R.id.tvChgUnderTempWarn)
        
        rowChgOverTempWarn = findViewById(R.id.rowChgOverTempWarn)
        cbChgOverTempWarn  = findViewById(R.id.cbChgOverTempWarn)
        tvChgOverTempWarn  = findViewById(R.id.tvChgOverTempWarn)
        
        rowDchgUnderTempWarn = findViewById(R.id.rowDchgUnderTempWarn)
        cbDchgUnderTempWarn  = findViewById(R.id.cbDchgUnderTempWarn)
        tvDchgUnderTempWarn  = findViewById(R.id.tvDchgUnderTempWarn)
        
        rowDchgOverTempWarn = findViewById(R.id.rowDchgOverTempWarn)
        cbDchgOverTempWarn  = findViewById(R.id.cbDchgOverTempWarn)
        tvDchgOverTempWarn  = findViewById(R.id.tvDchgOverTempWarn)
        
        rowPreChgFetStatus = findViewById(R.id.rowPreChgFetStatus)
        cbPreChgFetStatus  = findViewById(R.id.cbPreChgFetStatus)
        tvPreChgFetStatus  = findViewById(R.id.tvPreChgFetStatus)
        
        rowChgFetStatus    = findViewById(R.id.rowChgFetStatus)
        cbChgFetStatus     = findViewById(R.id.cbChgFetStatus)
        tvChgFetStatus     = findViewById(R.id.tvChgFetStatus)
        
        rowDchgFetStatus   = findViewById(R.id.rowDchgFetStatus)
        cbDchgFetStatus    = findViewById(R.id.cbDchgFetStatus)
        tvDchgFetStatus    = findViewById(R.id.tvDchgFetStatus)
        
        rowResStatus       = findViewById(R.id.rowResStatus)
        cbResStatus        = findViewById(R.id.cbResStatus)
        tvResStatus        = findViewById(R.id.tvResStatus)
        
        rowShortCktProt    = findViewById(R.id.rowShortCktProt)
        cbShortCktProt     = findViewById(R.id.cbShortCktProt)
        tvShortCktProt     = findViewById(R.id.tvShortCktProt)
        
        rowDschgPeakProt   = findViewById(R.id.rowDschgPeakProt)
        cbDschgPeakProt    = findViewById(R.id.cbDschgPeakProt)
        tvDschgPeakProt    = findViewById(R.id.tvDschgPeakProt)
        
        rowChgAuth         = findViewById(R.id.rowChgAuth)
        cbChgAuth          = findViewById(R.id.cbChgAuth)
        tvChgAuth          = findViewById(R.id.tvChgAuth)
        
        rowChgPeakProt     = findViewById(R.id.rowChgPeakProt)
        cbChgPeakProt      = findViewById(R.id.cbChgPeakProt)
        tvChgPeakProt      = findViewById(R.id.tvChgPeakProt)
        
        rowDI1             = findViewById(R.id.rowDI1)
        cbDI1              = findViewById(R.id.cbDI1)
        tvDI1              = findViewById(R.id.tvDI1)
        
        rowDI2             = findViewById(R.id.rowDI2)
        cbDI2              = findViewById(R.id.cbDI2)
        tvDI2              = findViewById(R.id.tvDI2)
        
        rowDO1             = findViewById(R.id.rowDO1)
        cbDO1              = findViewById(R.id.cbDO1)
        tvDO1              = findViewById(R.id.tvDO1)
        
        rowDO2             = findViewById(R.id.rowDO2)
        cbDO2              = findViewById(R.id.cbDO2)
        tvDO2              = findViewById(R.id.tvDO2)
        
        rowChargerDetection = findViewById(R.id.rowChargerDetection)
        cbChargerDetection  = findViewById(R.id.cbChargerDetection)
        tvChargerDetection  = findViewById(R.id.tvChargerDetection)
        
        rowCanCommDetection = findViewById(R.id.rowCanCommDetection)
        cbCanCommDetection  = findViewById(R.id.cbCanCommDetection)
        tvCanCommDetection  = findViewById(R.id.tvCanCommDetection)
        
        rowCellBalFeatureStatus = findViewById(R.id.rowCellBalFeatureStatus)
        cbCellBalFeatureStatus  = findViewById(R.id.cbCellBalFeatureStatus)
        tvCellBalFeatureStatus  = findViewById(R.id.tvCellBalFeatureStatus)
        
        rowImmoChg         = findViewById(R.id.rowImmoChg)
        cbImmoChg          = findViewById(R.id.cbImmoChg)
        tvImmoChg          = findViewById(R.id.tvImmoChg)
        
        rowImmoDchg        = findViewById(R.id.rowImmoDchg)
        cbImmoDchg         = findViewById(R.id.cbImmoDchg)
        tvImmoDchg         = findViewById(R.id.tvImmoDchg)
        
        rowBuzzerStatus    = findViewById(R.id.rowBuzzerStatus)
        cbBuzzerStatus     = findViewById(R.id.cbBuzzerStatus)
        tvBuzzerStatus     = findViewById(R.id.tvBuzzerStatus)
        
        rowSide_Stand_Ack  = findViewById(R.id.rowSide_Stand_Ack)
        cbSide_Stand_Ack   = findViewById(R.id.cbSide_Stand_Ack)
        tvSide_Stand_Ack   = findViewById(R.id.tvSide_Stand_Ack)
        
        rowDirection_Ack   = findViewById(R.id.rowDirection_Ack)
        cbDirection_Ack    = findViewById(R.id.cbDirection_Ack)
        tvDirection_Ack    = findViewById(R.id.tvDirection_Ack)
        
        rowRide_Ack        = findViewById(R.id.rowRide_Ack)
        cbRide_Ack         = findViewById(R.id.cbRide_Ack)
        tvRide_Ack         = findViewById(R.id.tvRide_Ack)
        
        rowHill_hold_Ack   = findViewById(R.id.rowHill_hold_Ack)
        cbHill_hold_Ack    = findViewById(R.id.cbHill_hold_Ack)
        tvHill_hold_Ack    = findViewById(R.id.tvHill_hold_Ack)
        
        rowWakeup_Ack      = findViewById(R.id.rowWakeup_Ack)
        cbWakeup_Ack       = findViewById(R.id.cbWakeup_Ack)
        tvWakeup_Ack       = findViewById(R.id.tvWakeup_Ack)
        
        rowDriveError_Motor_hall = findViewById(R.id.rowDriveError_Motor_hall)
        cbDriveError_Motor_hall  = findViewById(R.id.cbDriveError_Motor_hall)
        tvDriveError_Motor_hall  = findViewById(R.id.tvDriveError_Motor_hall)
        
        rowMotor_Stalling  = findViewById(R.id.rowMotor_Stalling)
        cbMotor_Stalling   = findViewById(R.id.cbMotor_Stalling)
        tvMotor_Stalling   = findViewById(R.id.tvMotor_Stalling)
        
        rowMotor_Phase_loss = findViewById(R.id.rowMotor_Phase_loss)
        cbMotor_Phase_loss  = findViewById(R.id.cbMotor_Phase_loss)
        tvMotor_Phase_loss  = findViewById(R.id.tvMotor_Phase_loss)
        
        rowController_Over_Temeprature = findViewById(R.id.rowController_Over_Temeprature)
        cbController_Over_Temeprature  = findViewById(R.id.cbController_Over_Temeprature)
        tvController_Over_Temeprature  = findViewById(R.id.tvController_Over_Temeprature)
        
        rowMotor_Over_Temeprature = findViewById(R.id.rowMotor_Over_Temeprature)
        cbMotor_Over_Temeprature  = findViewById(R.id.cbMotor_Over_Temeprature)
        tvMotor_Over_Temeprature  = findViewById(R.id.tvMotor_Over_Temeprature)
        
        rowThrottle_Error  = findViewById(R.id.rowThrottle_Error)
        cbThrottle_Error   = findViewById(R.id.cbThrottle_Error)
        tvThrottle_Error   = findViewById(R.id.tvThrottle_Error)
        
        rowMOSFET_Protection = findViewById(R.id.rowMOSFET_Protection)
        cbMOSFET_Protection  = findViewById(R.id.cbMOSFET_Protection)
        tvMOSFET_Protection  = findViewById(R.id.tvMOSFET_Protection)
        
        rowDriveStatus_Regenerative_Braking = findViewById(R.id.rowDriveStatus_Regenerative_Braking)
        cbDriveStatus_Regenerative_Braking  = findViewById(R.id.cbDriveStatus_Regenerative_Braking)
        tvDriveStatus_Regenerative_Braking  = findViewById(R.id.tvDriveStatus_Regenerative_Braking)
        
        rowModeR_Pulse     = findViewById(R.id.rowModeR_Pulse)
        cbModeR_Pulse      = findViewById(R.id.cbModeR_Pulse)
        tvModeR_Pulse      = findViewById(R.id.tvModeR_Pulse)
        
        rowModeL_Pulse     = findViewById(R.id.rowModeL_Pulse)
        cbModeL_Pulse      = findViewById(R.id.cbModeL_Pulse)
        tvModeL_Pulse      = findViewById(R.id.tvModeL_Pulse)
        
        rowBrake_Pulse     = findViewById(R.id.rowBrake_Pulse)
        cbBrake_Pulse      = findViewById(R.id.cbBrake_Pulse)
        tvBrake_Pulse      = findViewById(R.id.tvBrake_Pulse)
        
        rowPark_Pulse      = findViewById(R.id.rowPark_Pulse)
        cbPark_Pulse       = findViewById(R.id.cbPark_Pulse)
        tvPark_Pulse       = findViewById(R.id.tvPark_Pulse)
        
        rowReverse_Pulse   = findViewById(R.id.rowReverse_Pulse)
        cbReverse_Pulse    = findViewById(R.id.cbReverse_Pulse)
        tvReverse_Pulse    = findViewById(R.id.tvReverse_Pulse)
        
        rowSideStand_Pulse = findViewById(R.id.rowSideStand_Pulse)
        cbSideStand_Pulse  = findViewById(R.id.cbSideStand_Pulse)
        tvSideStand_Pulse  = findViewById(R.id.tvSideStand_Pulse)
        
        rowForwardParking_Mode_Ack = findViewById(R.id.rowForwardParking_Mode_Ack)
        cbForwardParking_Mode_Ack  = findViewById(R.id.cbForwardParking_Mode_Ack)
        tvForwardParking_Mode_Ack  = findViewById(R.id.tvForwardParking_Mode_Ack)
        
        rowDriveError_Controller_OverVoltag = findViewById(R.id.rowDriveError_Controller_OverVoltag)
        cbDriveError_Controller_OverVoltag  = findViewById(R.id.cbDriveError_Controller_OverVoltag)
        tvDriveError_Controller_OverVoltag  = findViewById(R.id.tvDriveError_Controller_OverVoltag)
        
        rowController_Undervoltage = findViewById(R.id.rowController_Undervoltage)
        cbController_Undervoltage  = findViewById(R.id.cbController_Undervoltage)
        tvController_Undervoltage  = findViewById(R.id.tvController_Undervoltage)
        
        rowOvercurrent_Fault = findViewById(R.id.rowOvercurrent_Fault)
        cbOvercurrent_Fault  = findViewById(R.id.cbOvercurrent_Fault)
        tvOvercurrent_Fault  = findViewById(R.id.tvOvercurrent_Fault)
        
        rowDriveStatus1_ride = findViewById(R.id.rowDriveStatus1_ride)
        cbDriveStatus1_ride  = findViewById(R.id.cbDriveStatus1_ride)
        tvDriveStatus1_ride  = findViewById(R.id.tvDriveStatus1_ride)
        
        rowWakeup_Request    = findViewById(R.id.rowWakeup_Request)
        cbWakeup_Request     = findViewById(R.id.cbWakeup_Request)
        tvWakeup_Request     = findViewById(R.id.tvWakeup_Request)
        
        rowHill_Hold         = findViewById(R.id.rowHill_Hold)
        cbHill_Hold          = findViewById(R.id.cbHill_Hold)
        tvHill_Hold          = findViewById(R.id.tvHill_Hold)
        
        rowReverse_REQUEST   = findViewById(R.id.rowReverse_REQUEST)
        cbReverse_REQUEST    = findViewById(R.id.cbReverse_REQUEST)
        tvReverse_REQUEST    = findViewById(R.id.tvReverse_REQUEST)
        
        rowForward_parkingmode_REQUEST = findViewById(R.id.rowForward_parkingmode_REQUEST)
        cbForward_parkingmode_REQUEST  = findViewById(R.id.cbForward_parkingmode_REQUEST)
        tvForward_parkingmode_REQUEST  = findViewById(R.id.tvForward_parkingmode_REQUEST)
        
        rowSide_stand_Req    = findViewById(R.id.rowSide_stand_Req)
        cbSide_stand_Req     = findViewById(R.id.cbSide_stand_Req)
        tvSide_stand_Req     = findViewById(R.id.tvSide_stand_Req)
        
        rowBattery_charge_logic = findViewById(R.id.rowBattery_charge_logic)
        cbBattery_charge_logic  = findViewById(R.id.cbBattery_charge_logic)
        tvBattery_charge_logic  = findViewById(R.id.tvBattery_charge_logic)
        
        rowRemote_cutoff     = findViewById(R.id.rowRemote_cutoff)
        cbRemote_cutoff      = findViewById(R.id.cbRemote_cutoff)
        tvRemote_cutoff      = findViewById(R.id.tvRemote_cutoff)
        
        rowmode_limit        = findViewById(R.id.rowmode_limit)
        cbmode_limit         = findViewById(R.id.cbmode_limit)
        tvmode_limit         = findViewById(R.id.tvmode_limit)
        
        rowGeo_fencebuzzer   = findViewById(R.id.rowGeo_fencebuzzer)
        cbGeo_fencebuzzer    = findViewById(R.id.cbGeo_fencebuzzer)
        tvGeo_fencebuzzer    = findViewById(R.id.tvGeo_fencebuzzer)
        
        rowHoliday_mode      = findViewById(R.id.rowHoliday_mode)
        cbHoliday_mode       = findViewById(R.id.cbHoliday_mode)
        tvHoliday_mode       = findViewById(R.id.tvHoliday_mode)
        
        rowService_request   = findViewById(R.id.rowService_request)
        cbService_request    = findViewById(R.id.cbService_request)
        tvService_request    = findViewById(R.id.tvService_request)
        
        rowLow_Mode_REQUEST  = findViewById(R.id.rowLow_Mode_REQUEST)
        cbLow_Mode_REQUEST   = findViewById(R.id.cbLow_Mode_REQUEST)
        tvLow_Mode_REQUEST   = findViewById(R.id.tvLow_Mode_REQUEST)
        
        rowMedium_Mode_REQUEST = findViewById(R.id.rowMedium_Mode_REQUEST)
        cbMedium_Mode_REQUEST  = findViewById(R.id.cbMedium_Mode_REQUEST)
        tvMedium_Mode_REQUEST  = findViewById(R.id.tvMedium_Mode_REQUEST)
        
        rowUser_defind_mode_High_REQUEST = findViewById(R.id.rowUser_defind_mode_High_REQUEST)
        cbUser_defind_mode_High_REQUEST  = findViewById(R.id.cbUser_defind_mode_High_REQUEST)
        tvUser_defind_mode_High_REQUEST  = findViewById(R.id.tvUser_defind_mode_High_REQUEST)
        
        rowLimp_mode_REQUEST = findViewById(R.id.rowLimp_mode_REQUEST)
        cbLimp_mode_REQUEST  = findViewById(R.id.cbLimp_mode_REQUEST)
        tvLimp_mode_REQUEST  = findViewById(R.id.tvLimp_mode_REQUEST)

        // 2) Setup EditText for search
        val searchEditText: EditText = findViewById(R.id.searchEditText)
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val searchQuery = s.toString().lowercase(Locale.getDefault())
                // Re-apply the logic to show/hide rows
                updateParameterVisibility(searchQuery)
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        // 3) Buttons: Start/Stop/Save
        val startRecordingButton: Button = findViewById(R.id.startRecordingButton)
        val stopRecordingButton: Button = findViewById(R.id.stopRecordingButton)
        val saveLocationButton: Button = findViewById(R.id.saveLocationButton)

        startRecordingButton.setOnClickListener {
            if (saveFileUri != null) {
                startRecording()
            } else {
                Log.d(TAG, "Please select a location to save the file first.")
                Toast.makeText(this, "Please select a location first.", Toast.LENGTH_SHORT).show()
            }
        }
        stopRecordingButton.setOnClickListener { stopRecording() }
        saveLocationButton.setOnClickListener { openDirectoryChooser() }

        // 4) New Buttons: Enable Selection & Show Selected
        val enableSelectionButton: Button = findViewById(R.id.enableSelectionButton)
        val showSelectedButton: Button    = findViewById(R.id.showSelectedButton)

        enableSelectionButton.setOnClickListener {
            // Toggle isSelectionMode
            isSelectionMode = !isSelectionMode
            // Optionally change button text
            enableSelectionButton.text = if (isSelectionMode) "Disable Selection" else "Enable Selection"
            // Update UI
            updateCheckboxVisibility()
        }

        showSelectedButton.setOnClickListener {
            // Toggle showSelectedOnly
            showSelectedOnly = !showSelectedOnly
            // Optionally change button text
            showSelectedButton.text = if (showSelectedOnly) "Show All Parameters" else "Show Selected Parameters"
            // Re-apply visibility logic
            val searchQuery = searchEditText.text.toString().lowercase(Locale.getDefault())
            updateParameterVisibility(searchQuery)
        }

        // 5) If device address was provided, connect via BLE
        val deviceAddress = intent.getStringExtra(DEVICE_ADDRESS)
        if (deviceAddress != null) {
            setupBluetooth(deviceAddress)
        } else {
            Log.d(TAG, "Device address not provided")
        }

        // Initial UI update: everything hidden or shown based on layout defaults
        // If you want them visible initially, call updateCheckboxVisibility() & updateParameterVisibility("")
        updateCheckboxVisibility()
        updateParameterVisibility("")
    }

    // ---------------------------------------------------------------------------------------------
    // UI Visibility Methods
    // ---------------------------------------------------------------------------------------------

    /**
     * Shows/hides the CheckBoxes depending on isSelectionMode
     */
    private fun updateCheckboxVisibility() {
        val checkBoxes = listOf(
    cbCellVol01, cbPackCurr, cbIgnitionStatus, cbMode_Ack, 
    cbCellVol02, cbCellVol03, cbCellVol04, cbCellVol05, 
    cbCellVol06, cbCellVol07, cbCellVol08, cbCellVol09, 
    cbCellVol10, cbCellVol11, cbCellVol12, cbCellVol13, 
    cbCellVol14, cbCellVol15, cbCellVol16, cbMaxCellVol, 
    cbMinCellVol, cbAvgCellVol, cbMaxVoltId, cbMinVoltId, 
    cbPackVol, cbCycleCount, cbCellVolMinMaxDev, cbSOC, 
    cbSOCAh, cbSOH, cbBmsStatus, cbLedStatus, cbActiveCellBalStatus, 
    cbBMS_Serial_No_MUX, cbBMS_Serial_No__1_7, cbLatchProtection, 
    cbLatchType, cbChargerType, cbPcbTemp, cbAfeTemp, cbCellChemType, 
    cbChg_Accumulative_Ah, cbDchg_Accumulative_Ah, cbRefVol, cb_3v3Vol, 
    cb_5vVol, cb_12vVol, cbActual_SoC, cbUsable_Capacity_Ah, cbConfigVer, 
    cbInternalFWVer, cbInternalFWSubVer, cbBHB_66049, cbMaxTemp, 
    cbMinTemp, cbFetTemp, cbTemp1, cbTemp2, cbTemp3, cbTemp4, 
    cbTemp5, cbTemp6, cbTemp7, cbTemp8, cbHwVer, cbFwVer, cbFWSubVer, 
    cbBtStatus_NC0PSM1CC2CV3Finish4, cbBt_liveMsg1Temp, cbBt_liveMsg_soc, 
    cbBMS_status, cbDemand_voltage, cbDemand_Current, cbMaxChgVoltgae, 
    cbMaxChgCurrent, cbActualChgVoltage, cbActualChgCurrent, 
    cbCharging_end_cutoff_Curr, cbCHB_258, cbChgrNC0PSM1CC2CV3Finsh4, 
    cbchgr_msg_temp, cbChgStatus_chg_idle, cbchgrLiveMsgChgVolt, 
    cbchgrLiveMsgChgCurrent, cbChargeSOP, cbDchgSOP, cbDrive_Error_Flag, 
    cbSet_Regen, cbDCcurrentlimit, cbCustom_freq, cbCustom_torque, 
    cbBuffer_speed, cbBase_speed, cbInitial_torque, cbFinal_torque, 
    cbCluster_odo, cbMode_Ack, cbMotorSpeed, cbBatteryVoltage, 
    cbBatteryCurrent, cbAC_Current, cbAC_Voltage, cbThrottle, 
    cbMCU_Temperature, cbMotor_Temperature, cbMCU_Fault_Code, cbMCU_ID, 
    cbCluster_heartbeat, cbOdo_Cluster, cbSW_Version_MAJ, cbSW_Version_MIN, cbHW_Version_MAJ, cbHW_Version_MIN, cbMCU_Firmware_Id, cbIgnitionStatus, cbLoadDetection, 
    cbKeystatus, cbKeyevents, cbCellUnderVolProt, cbCellOverVolProt, 
    cbPackUnderVolProt, cbPackOverVolProt, cbChgUnderTempProt, 
    cbChgOverTempProt, cbDchgUnderTempProt, cbDchgOverTempProt, 
    cbCellOverDevProt, cbBattLowSocWarn, cbChgOverCurrProt, 
    cbDchgOverCurrProt, cbCellUnderVolWarn, cbCellOverVolWarn, 
    cbFetTempProt, cbResSocProt, cbFetFailure, cbTempSenseFault, 
    cbPackUnderVolWarn, cbPackOverVolWarn, cbChgUnderTempWarn, 
    cbChgOverTempWarn, cbDchgUnderTempWarn, cbDchgOverTempWarn, 
    cbPreChgFetStatus, cbChgFetStatus, cbDchgFetStatus, cbResStatus, 
    cbShortCktProt, cbDschgPeakProt, cbChgAuth, cbChgPeakProt, 
    cbDI1, cbDI2, cbDO1, cbDO2, cbChargerDetection, cbCanCommDetection, 
    cbCellBalFeatureStatus, cbImmoChg, cbImmoDchg, cbBuzzerStatus, 
    cbSide_Stand_Ack, cbDirection_Ack, cbRide_Ack, cbHill_hold_Ack, 
    cbWakeup_Ack, cbDriveError_Motor_hall, cbMotor_Stalling, 
    cbMotor_Phase_loss, cbController_Over_Temeprature, 
    cbMotor_Over_Temeprature, cbThrottle_Error, cbMOSFET_Protection, 
    cbDriveStatus_Regenerative_Braking, cbModeR_Pulse, cbModeL_Pulse, 
    cbBrake_Pulse, cbPark_Pulse, cbReverse_Pulse, cbSideStand_Pulse, 
    cbForwardParking_Mode_Ack, cbDriveError_Controller_OverVoltag, 
    cbController_Undervoltage, cbOvercurrent_Fault, cbDriveStatus1_ride, 
    cbWakeup_Request, cbHill_Hold, cbReverse_REQUEST, 
    cbForward_parkingmode_REQUEST, cbSide_stand_Req, cbBattery_charge_logic, 
    cbRemote_cutoff, cbmode_limit, cbGeo_fencebuzzer, cbHoliday_mode, 
    cbService_request, cbLow_Mode_REQUEST, cbMedium_Mode_REQUEST, 
    cbUser_defind_mode_High_REQUEST, cbLimp_mode_REQUEST
)
        checkBoxes.forEach { cb ->
            cb.visibility = if (isSelectionMode) View.VISIBLE else View.GONE
        }
    }

    /**
     * Updates which rows are visible based on search query + showSelectedOnly
     */
    private fun updateParameterVisibility(searchQuery: String) {
        // For convenience, make a list of (paramName, row, checkBox)
        val paramRows = listOf(
            Triple("cellvol01", rowCellVol01, cbCellVol01),
            Triple("packcurr",  rowPackCurr,  cbPackCurr),
            Triple("ignitionstatus", rowIgnitionStatus, cbIgnitionStatus),
            Triple("mode_ack",  rowMode_Ack,   cbMode_Ack),
            Triple("soc",       rowSOC,       cbSOC),
            Triple("socah",     rowSOCAh,     cbSOCAh),
            Triple("cellvol02", rowCellVol02, cbCellVol02),
            Triple("cellvol03", rowCellVol03, cbCellVol03),
            Triple("cellvol04", rowCellVol04, cbCellVol04),
            Triple("cellvol05", rowCellVol05, cbCellVol05),
            Triple("cellvol06", rowCellVol06, cbCellVol06),
            Triple("cellvol07", rowCellVol07, cbCellVol07),
            Triple("cellvol08", rowCellVol08, cbCellVol08),
            Triple("cellvol09", rowCellVol09, cbCellVol09),
            Triple("cellvol10", rowCellVol10, cbCellVol10),
            Triple("cellvol11", rowCellVol11, cbCellVol11),
            Triple("cellvol12", rowCellVol12, cbCellVol12),
            Triple("cellvol13", rowCellVol13, cbCellVol13),
            Triple("cellvol14", rowCellVol14, cbCellVol14),
            Triple("cellvol15", rowCellVol15, cbCellVol15),
            Triple("cellvol16", rowCellVol16, cbCellVol16),
            Triple("maxcellvol", rowMaxCellVol, cbMaxCellVol),
            Triple("mincellvol", rowMinCellVol, cbMinCellVol),
            Triple("avgcellvol", rowAvgCellVol, cbAvgCellVol),
            Triple("maxvoltid", rowMaxVoltId, cbMaxVoltId),
            Triple("minvoltid", rowMinVoltId, cbMinVoltId),
            Triple("packvol", rowPackVol, cbPackVol),
            Triple("cyclecount", rowCycleCount, cbCycleCount),
            Triple("cellvolminmaxdev", rowCellVolMinMaxDev, cbCellVolMinMaxDev),
            Triple("soh", rowSOH, cbSOH),
            Triple("bmsstatus", rowBmsStatus, cbBmsStatus),
            Triple("ledstatus", rowLedStatus, cbLedStatus),
            Triple("activecellbalstatus", rowActiveCellBalStatus, cbActiveCellBalStatus),
            Triple("bms_serial_no_mux", rowBMS_Serial_No_MUX, cbBMS_Serial_No_MUX),
            Triple("bms_serial_no__1_7", rowBMS_Serial_No__1_7, cbBMS_Serial_No__1_7),
            Triple("latchprotection", rowLatchProtection, cbLatchProtection),
            Triple("latchtype", rowLatchType, cbLatchType),
            Triple("chargertype", rowChargerType, cbChargerType),
            Triple("pcbtemp", rowPcbTemp, cbPcbTemp),
            Triple("afetemp", rowAfeTemp, cbAfeTemp),
            Triple("cellchemtype", rowCellChemType, cbCellChemType),
            Triple("chg_accumulative_ah", rowChg_Accumulative_Ah, cbChg_Accumulative_Ah),
            Triple("dchg_accumulative_ah", rowDchg_Accumulative_Ah, cbDchg_Accumulative_Ah),
            Triple("refvol", rowRefVol, cbRefVol),
            Triple("_3v3vol", row_3v3Vol, cb_3v3Vol),
            Triple("_5vvol", row_5vVol, cb_5vVol),
            Triple("_12vvol", row_12vVol, cb_12vVol),
            Triple("actual_soc", rowActual_SoC, cbActual_SoC),
            Triple("usable_capacity_ah", rowUsable_Capacity_Ah, cbUsable_Capacity_Ah),
            Triple("configver", rowConfigVer, cbConfigVer),
            Triple("internalfwver", rowInternalFWVer, cbInternalFWVer),
            Triple("internalfwsubver", rowInternalFWSubVer, cbInternalFWSubVer),
            Triple("bhb_66049", rowBHB_66049, cbBHB_66049),
            Triple("maxtemp", rowMaxTemp, cbMaxTemp),
            Triple("mintemp", rowMinTemp, cbMinTemp),
            Triple("fettemp", rowFetTemp, cbFetTemp),
            Triple("temp1", rowTemp1, cbTemp1),
            Triple("temp2", rowTemp2, cbTemp2),
            Triple("temp3", rowTemp3, cbTemp3),
            Triple("temp4", rowTemp4, cbTemp4),
            Triple("temp5", rowTemp5, cbTemp5),
            Triple("temp6", rowTemp6, cbTemp6),
            Triple("temp7", rowTemp7, cbTemp7),
            Triple("temp8", rowTemp8, cbTemp8),
            Triple("hwver", rowHwVer, cbHwVer),
            Triple("fwver", rowFwVer, cbFwVer),
            Triple("fwsubver", rowFWSubVer, cbFWSubVer),
            Triple("btstatus_nc0psm1cc2cv3finish4", rowBtStatus_NC0PSM1CC2CV3Finish4, cbBtStatus_NC0PSM1CC2CV3Finish4),
            Triple("bt_livemsg1temp", rowBt_liveMsg1Temp, cbBt_liveMsg1Temp),
            Triple("bt_livemsg_soc", rowBt_liveMsg_soc, cbBt_liveMsg_soc),
            Triple("bms_status", rowBMS_status, cbBMS_status),
            Triple("demand_voltage", rowDemand_voltage, cbDemand_voltage),
            Triple("demand_current", rowDemand_Current, cbDemand_Current),
            Triple("maxchgvolaae", rowMaxChgVoltgae, cbMaxChgVoltgae),
            Triple("maxchgcurrent", rowMaxChgCurrent, cbMaxChgCurrent),
            Triple("actualchgvoltage", rowActualChgVoltage, cbActualChgVoltage),
            Triple("actualchgcurrent", rowActualChgCurrent, cbActualChgCurrent),
            Triple("charging_end_cutoff_curr", rowCharging_end_cutoff_Curr, cbCharging_end_cutoff_Curr),
            Triple("chb_258", rowCHB_258, cbCHB_258),
            Triple("chgrnc0psm1cc2cv3finsh4", rowChgrNC0PSM1CC2CV3Finsh4, cbChgrNC0PSM1CC2CV3Finsh4),
            Triple("chgr_msg_temp", rowchgr_msg_temp, cbchgr_msg_temp),
            Triple("chgstatus_chg_idle", rowChgStatus_chg_idle, cbChgStatus_chg_idle),
            Triple("chgrlivemsgchgvolt", rowchgrLiveMsgChgVolt, cbchgrLiveMsgChgVolt),
            Triple("chgrlivemsgchgcurrent", rowchgrLiveMsgChgCurrent, cbchgrLiveMsgChgCurrent),
            Triple("chargesop", rowChargeSOP, cbChargeSOP),
            Triple("dchgsop", rowDchgSOP, cbDchgSOP),
            Triple("drive_error_flag", rowDrive_Error_Flag, cbDrive_Error_Flag),
            Triple("set_regen", rowSet_Regen, cbSet_Regen),
            Triple("dccurrentlimit", rowDCcurrentlimit, cbDCcurrentlimit),
            Triple("custom_freq", rowCustom_freq, cbCustom_freq),
            Triple("custom_torque", rowCustom_torque, cbCustom_torque),
            Triple("buffer_speed", rowBuffer_speed, cbBuffer_speed),
            Triple("base_speed", rowBase_speed, cbBase_speed),
            Triple("initial_torque", rowInitial_torque, cbInitial_torque),
            Triple("final_torque", rowFinal_torque, cbFinal_torque),
            Triple("cluster_odo", rowCluster_odo, cbCluster_odo),
            Triple("motor_speed", rowMotorSpeed, cbMotorSpeed),
            Triple("battery_voltage", rowBatteryVoltage, cbBatteryVoltage),
            Triple("battery_current", rowBatteryCurrent, cbBatteryCurrent),
            Triple("ac_current", rowAC_Current, cbAC_Current),
            Triple("ac_voltage", rowAC_Voltage, cbAC_Voltage),
            Triple("throttle", rowThrottle, cbThrottle),
            Triple("mcu_temperature", rowMCU_Temperature, cbMCU_Temperature),
            Triple("motor_temperature", rowMotor_Temperature, cbMotor_Temperature),
            Triple("mcu_fault_code", rowMCU_Fault_Code, cbMCU_Fault_Code),
            Triple("mcu_id", rowMCU_ID, cbMCU_ID),
            Triple("cluster_heartbeat", rowCluster_heartbeat, cbCluster_heartbeat),
            Triple("odo_cluster", rowOdo_Cluster, cbOdo_Cluster),
            Triple("sw_version_maj", rowSW_Version_MAJ, cbSW_Version_MAJ),
            Triple("sw_version_min", rowSW_Version_MIN, cbSW_Version_MIN),
            Triple("hw_version_maj", rowHW_Version_MAJ, cbHW_Version_MAJ),
            Triple("hw_version_min", rowHW_Version_MIN, cbHW_Version_MIN),
            Triple("mcu_firmware_id", rowMCU_Firmware_Id, cbMCU_Firmware_Id),
            Triple("load_detection", rowLoadDetection, cbLoadDetection),
            Triple("keystatus", rowKeystatus, cbKeystatus),
            Triple("keyevents", rowKeyevents, cbKeyevents),
            Triple("cellundervolprot", rowCellUnderVolProt, cbCellUnderVolProt),
            Triple("cellovervolprot", rowCellOverVolProt, cbCellOverVolProt),
            Triple("packundervolprot", rowPackUnderVolProt, cbPackUnderVolProt),
            Triple("packovervolprot", rowPackOverVolProt, cbPackOverVolProt),
            Triple("chgundertempprot", rowChgUnderTempProt, cbChgUnderTempProt),
            Triple("chgovertempprot", rowChgOverTempProt, cbChgOverTempProt),
            Triple("dchgundertempprot", rowDchgUnderTempProt, cbDchgUnderTempProt),
            Triple("dchgovertempprot", rowDchgOverTempProt, cbDchgOverTempProt),
            Triple("celloverdevprot", rowCellOverDevProt, cbCellOverDevProt),
            Triple("battlowsocwarn", rowBattLowSocWarn, cbBattLowSocWarn),
            Triple("chgovercurrprot", rowChgOverCurrProt, cbChgOverCurrProt),
            Triple("dchgovercurrprot", rowDchgOverCurrProt, cbDchgOverCurrProt),
            Triple("cellundervolwarn", rowCellUnderVolWarn, cbCellUnderVolWarn),
            Triple("cellovervolwarn", rowCellOverVolWarn, cbCellOverVolWarn),
            Triple("fettempprot", rowFetTempProt, cbFetTempProt),
            Triple("ressocprot", rowResSocProt, cbResSocProt),
            Triple("fetfailure", rowFetFailure, cbFetFailure),
            Triple("tempsensefault", rowTempSenseFault, cbTempSenseFault),
            Triple("packundervolwarn", rowPackUnderVolWarn, cbPackUnderVolWarn),
            Triple("packovervolwarn", rowPackOverVolWarn, cbPackOverVolWarn),
            Triple("chgundertempwarn", rowChgUnderTempWarn, cbChgUnderTempWarn),
            Triple("chgovertempwarn", rowChgOverTempWarn, cbChgOverTempWarn),
            Triple("dchgundertempwarn", rowDchgUnderTempWarn, cbDchgUnderTempWarn),
            Triple("dchgovertempwarn", rowDchgOverTempWarn, cbDchgOverTempWarn),
            Triple("prechgfetstatus", rowPreChgFetStatus, cbPreChgFetStatus),
            Triple("chgfetstatus", rowChgFetStatus, cbChgFetStatus),
            Triple("dchgfetstatus", rowDchgFetStatus, cbDchgFetStatus),
            Triple("resstatus", rowResStatus, cbResStatus),
            Triple("shortcktprot", rowShortCktProt, cbShortCktProt),
            Triple("dschgpeakprot", rowDschgPeakProt, cbDschgPeakProt),
            Triple("chgauth", rowChgAuth, cbChgAuth),
            Triple("chgpeakprot", rowChgPeakProt, cbChgPeakProt),
            Triple("di1", rowDI1, cbDI1),
            Triple("di2", rowDI2, cbDI2),
            Triple("do1", rowDO1, cbDO1),
            Triple("do2", rowDO2, cbDO2),
            Triple("chargerdetection", rowChargerDetection, cbChargerDetection),
            Triple("cancommdetection", rowCanCommDetection, cbCanCommDetection),
            Triple("cellbalfeaturestatus", rowCellBalFeatureStatus, cbCellBalFeatureStatus),
            Triple("immochg", rowImmoChg, cbImmoChg),
            Triple("immodchg", rowImmoDchg, cbImmoDchg),
            Triple("buzzerstatus", rowBuzzerStatus, cbBuzzerStatus),
            Triple("side_stand_ack", rowSide_Stand_Ack, cbSide_Stand_Ack),
            Triple("direction_ack", rowDirection_Ack, cbDirection_Ack),
            Triple("ride_ack", rowRide_Ack, cbRide_Ack),
            Triple("hill_hold_ack", rowHill_hold_Ack, cbHill_hold_Ack),
            Triple("wakeup_ack", rowWakeup_Ack, cbWakeup_Ack),
            Triple("driveerror_motor_hall", rowDriveError_Motor_hall, cbDriveError_Motor_hall),
            Triple("motor_stalling", rowMotor_Stalling, cbMotor_Stalling),
            Triple("motor_phase_loss", rowMotor_Phase_loss, cbMotor_Phase_loss),
            Triple("controller_over_temeprature", rowController_Over_Temeprature, cbController_Over_Temeprature),
            Triple("motor_over_temeprature", rowMotor_Over_Temeprature, cbMotor_Over_Temeprature),
            Triple("throttle_error", rowThrottle_Error, cbThrottle_Error),
            Triple("mosfet_protection", rowMOSFET_Protection, cbMOSFET_Protection),
            Triple("drivestatus_regenerative_braking", rowDriveStatus_Regenerative_Braking, cbDriveStatus_Regenerative_Braking),
            Triple("moder_pulse", rowModeR_Pulse, cbModeR_Pulse),
            Triple("model_pulse", rowModeL_Pulse, cbModeL_Pulse),
            Triple("brake_pulse", rowBrake_Pulse, cbBrake_Pulse),
            Triple("park_pulse", rowPark_Pulse, cbPark_Pulse),
            Triple("reverse_pulse", rowReverse_Pulse, cbReverse_Pulse),
            Triple("sidestand_pulse", rowSideStand_Pulse, cbSideStand_Pulse),
            Triple("forwardparking_mode_ack", rowForwardParking_Mode_Ack, cbForwardParking_Mode_Ack),
            Triple("driveerror_controller_overvoltag", rowDriveError_Controller_OverVoltag, cbDriveError_Controller_OverVoltag),
            Triple("controller_undervoltage", rowController_Undervoltage, cbController_Undervoltage),
            Triple("overcurrent_fault", rowOvercurrent_Fault, cbOvercurrent_Fault),
            Triple("drivestatus1_ride", rowDriveStatus1_ride, cbDriveStatus1_ride),
            Triple("wakeup_request", rowWakeup_Request, cbWakeup_Request),
            Triple("hill_hold", rowHill_Hold, cbHill_Hold),
            Triple("reverse_request", rowReverse_REQUEST, cbReverse_REQUEST),
            Triple("forward_parkingmode_request", rowForward_parkingmode_REQUEST, cbForward_parkingmode_REQUEST),
            Triple("side_stand_req", rowSide_stand_Req, cbSide_stand_Req),
            Triple("battery_charge_logic", rowBattery_charge_logic, cbBattery_charge_logic),
            Triple("remote_cutoff", rowRemote_cutoff, cbRemote_cutoff),
            Triple("mode_limit", rowmode_limit, cbmode_limit),
            Triple("geo_fencebuzzer", rowGeo_fencebuzzer, cbGeo_fencebuzzer),
            Triple("holiday_mode", rowHoliday_mode, cbHoliday_mode),
            Triple("service_request", rowService_request, cbService_request),
            Triple("low_mode_request", rowLow_Mode_REQUEST, cbLow_Mode_REQUEST),
            Triple("medium_mode_request", rowMedium_Mode_REQUEST, cbMedium_Mode_REQUEST),
            Triple("user_defind_mode_high_request", rowUser_defind_mode_High_REQUEST, cbUser_defind_mode_High_REQUEST),
            Triple("limp_mode_request", rowLimp_mode_REQUEST, cbLimp_mode_REQUEST)
        )

        // Show/hide each row
        for ((paramName, rowLayout, checkBox) in paramRows) {
            // 1) Does it match the search?
            val matchesSearch = searchQuery.isEmpty() || paramName.contains(searchQuery)

            // 2) If showSelectedOnly is true, also check if it's checked
            val isChecked = checkBox.isChecked

            // The row is visible if it matches the search query
            // AND either we are not in showSelectedOnly mode, or if we are, it's checked
            val shouldShow = matchesSearch && (!showSelectedOnly || isChecked)

            rowLayout.visibility = if (shouldShow) View.VISIBLE else View.GONE
        }
    }

    // ---------------------------------------------------------------------------------------------
    // BLE Setup & Callbacks
    // ---------------------------------------------------------------------------------------------
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
                    Log.d("Log", "Disconnected")
                }
            }

            override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                if (status == BluetoothGatt.GATT_SUCCESS) {
                    val service = gatt.getService(SERVICE_UUID)
                    val characteristic = service?.getCharacteristic(CHARACTERISTIC_UUID)
                    if (characteristic != null) {
                        gatt.setCharacteristicNotification(characteristic, true)
                        val descriptor = characteristic.getDescriptor(
                            UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                        )?.apply {
                            value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                        }
                        if (descriptor != null) {
                            gatt.writeDescriptor(descriptor)
                        }
                    } else {
                        Log.d("Log", "Service/Characteristic not found")
                    }
                } else {
                    Log.d("Log", "Service discovery failed")
                }
            }

            override fun onCharacteristicChanged(
                gatt: BluetoothGatt,
                characteristic: BluetoothGattCharacteristic
            ) {
                val rawData = characteristic.value
                val hexString = rawData.joinToString(separator = "") { "%02x".format(it) }

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
                val decodedChgStatus_chg_idle = ChgStatus_chg_idleDecoder(hexString)
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
                val decodedSW_Version_MAJ = SW_Version_MAJDecoder(hexString)
                val decodedSW_Version_MIN = SW_Version_MINDecoder(hexString)
                val decodedHW_Version_MAJ = HW_Version_MAJDecoder(hexString)
                val decodedHW_Version_MIN = HW_Version_MINDecoder(hexString)
                val decodedMCU_Firmware_Id = MCU_Firmware_IdDecoder(hexString)

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
                val decodedController_Over_Temeprature = Controller_Over_TemepratureDecoder(hexString)
                val decodedMotor_Over_Temeprature = Motor_Over_TemepratureDecoder(hexString)
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
                if (decodedChgStatus_chg_idle != null) {
                    lastValidChgStatus_chg_idle = decodedChgStatus_chg_idle
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
                if (decodedSW_Version_MAJ != null) {
                    lastValidSW_Version_MAJ = decodedSW_Version_MAJ
                }
                if (decodedSW_Version_MIN != null) {
                    lastValidSW_Version_MIN = decodedSW_Version_MIN
                }
                if (decodedHW_Version_MAJ != null) {
                    lastValidHW_Version_MAJ = decodedHW_Version_MAJ
                }
                if (decodedHW_Version_MIN != null) {
                    lastValidHW_Version_MIN = decodedHW_Version_MIN
                }
                if (decodedMCU_Firmware_Id != null) {
                    lastValidMCU_Firmware_Id = decodedMCU_Firmware_Id
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
                if (decodedController_Over_Temeprature != null) {
                    lastValidController_Over_Temeprature = decodedController_Over_Temeprature
                }
                if (decodedMotor_Over_Temeprature != null) {
                    lastValidMotor_Over_Temeprature = decodedMotor_Over_Temeprature
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

                // Update the UI
                runOnUiThread {
                    tvCellVol01.text       = "CellVol01: ${lastValidCellVol01 ?: "N/A"}"
                    tvPackCurr.text        = "PackCurr: ${lastValidPackCurr ?: "N/A"}"
                    tvMode_Ack.text        = "Mode_Ack: ${lastValidMode_Ack ?: "N/A"}"
                    tvSOC.text             = "SOC: ${lastValidSOC ?: "N/A"}"
                    tvSOCAh.text           = "SOCAh: ${lastValidSOCAh ?: "N/A"}"
                    tvCellVol02.text = "CellVol02: ${lastValidCellVol02 ?: "N/A"}"
                    tvCellVol03.text = "CellVol03: ${lastValidCellVol03 ?: "N/A"}"
                    tvCellVol04.text = "CellVol04: ${lastValidCellVol04 ?: "N/A"}"
                    tvCellVol05.text = "CellVol05: ${lastValidCellVol05 ?: "N/A"}"
                    tvCellVol06.text = "CellVol06: ${lastValidCellVol06 ?: "N/A"}"
                    tvCellVol07.text = "CellVol07: ${lastValidCellVol07 ?: "N/A"}"
                    tvCellVol08.text = "CellVol08: ${lastValidCellVol08 ?: "N/A"}"
                    tvCellVol09.text = "CellVol09: ${lastValidCellVol09 ?: "N/A"}"
                    tvCellVol10.text = "CellVol10: ${lastValidCellVol10 ?: "N/A"}"
                    tvCellVol11.text = "CellVol11: ${lastValidCellVol11 ?: "N/A"}"
                    tvCellVol12.text = "CellVol12: ${lastValidCellVol12 ?: "N/A"}"
                    tvCellVol13.text = "CellVol13: ${lastValidCellVol13 ?: "N/A"}"
                    tvCellVol14.text = "CellVol14: ${lastValidCellVol14 ?: "N/A"}"
                    tvCellVol15.text = "CellVol15: ${lastValidCellVol15 ?: "N/A"}"
                    tvCellVol16.text = "CellVol16: ${lastValidCellVol16 ?: "N/A"}"
                    tvMaxCellVol.text = "MaxCellVol: ${lastValidMaxCellVol ?: "N/A"}"
                    tvMinCellVol.text = "MinCellVol: ${lastValidMinCellVol ?: "N/A"}"
                    tvAvgCellVol.text = "AvgCellVol: ${lastValidAvgCellVol ?: "N/A"}"
                    tvMaxVoltId.text = "MaxVoltId: ${lastValidMaxVoltId ?: "N/A"}"
                    tvMinVoltId.text = "MinVoltId: ${lastValidMinVoltId ?: "N/A"}"
                    tvPackVol.text = "PackVol: ${lastValidPackVol ?: "N/A"}"
                    tvCycleCount.text = "CycleCount: ${lastValidCycleCount ?: "N/A"}"
                    tvCellVolMinMaxDev.text = "CellVolMinMaxDev: ${lastValidCellVolMinMaxDev ?: "N/A"}"
                    tvSOC.text = "SOC: ${lastValidSOC ?: "N/A"}"
                    tvSOCAh.text = "SOCAh: ${lastValidSOCAh ?: "N/A"}"
                    tvSOH.text = "SOH: ${lastValidSOH ?: "N/A"}"
                    tvBmsStatus.text = "BmsStatus: ${lastValidBmsStatus ?: "N/A"}"
                    tvLedStatus.text = "LedStatus: ${lastValidLedStatus ?: "N/A"}"
                    tvActiveCellBalStatus.text = "ActiveCellBalStatus: ${lastValidActiveCellBalStatus ?: "N/A"}"
                    tvBMS_Serial_No_MUX.text = "BMS_Serial_No_MUX: ${lastValidBMS_Serial_No_MUX ?: "N/A"}"
                    tvBMS_Serial_No__1_7.text = "BMS_Serial_No__1_7: ${lastValidBMS_Serial_No__1_7 ?: "N/A"}"
                    tvLatchProtection.text = "LatchProtection: ${lastValidLatchProtection ?: "N/A"}"
                    tvLatchType.text = "LatchType: ${lastValidLatchType ?: "N/A"}"
                    tvChargerType.text = "ChargerType: ${lastValidChargerType ?: "N/A"}"
                    tvPcbTemp.text = "PcbTemp: ${lastValidPcbTemp ?: "N/A"}"
                    tvAfeTemp.text = "AfeTemp: ${lastValidAfeTemp ?: "N/A"}"
                    tvCellChemType.text = "CellChemType: ${lastValidCellChemType ?: "N/A"}"
                    tvChg_Accumulative_Ah.text = "Chg_Accumulative_Ah: ${lastValidChg_Accumulative_Ah ?: "N/A"}"
                    tvDchg_Accumulative_Ah.text = "Dchg_Accumulative_Ah: ${lastValidDchg_Accumulative_Ah ?: "N/A"}"
                    tvRefVol.text = "RefVol: ${lastValidRefVol ?: "N/A"}"
                    tv_3v3Vol.text = "_3v3Vol: ${lastValid_3v3Vol ?: "N/A"}"
                    tv_5vVol.text = "_5vVol: ${lastValid_5vVol ?: "N/A"}"
                    tv_12vVol.text = "_12vVol: ${lastValid_12vVol ?: "N/A"}"
                    tvActual_SoC.text = "Actual_SoC: ${lastValidActual_SoC ?: "N/A"}"
                    tvUsable_Capacity_Ah.text = "Usable_Capacity_Ah: ${lastValidUsable_Capacity_Ah ?: "N/A"}"
                    tvConfigVer.text = "ConfigVer: ${lastValidConfigVer ?: "N/A"}"
                    tvInternalFWVer.text = "InternalFWVer: ${lastValidInternalFWVer ?: "N/A"}"
                    tvInternalFWSubVer.text = "InternalFWSubVer: ${lastValidInternalFWSubVer ?: "N/A"}"
                    tvBHB_66049.text = "BHB_66049: ${lastValidBHB_66049 ?: "N/A"}"
                    tvMaxTemp.text = "MaxTemp: ${lastValidMaxTemp ?: "N/A"}"
                    tvMinTemp.text = "MinTemp: ${lastValidMinTemp ?: "N/A"}"
                    tvFetTemp.text = "FetTemp: ${lastValidFetTemp ?: "N/A"}"
                    tvTemp1.text = "Temp1: ${lastValidTemp1 ?: "N/A"}"
                    tvTemp2.text = "Temp2: ${lastValidTemp2 ?: "N/A"}"
                    tvTemp3.text = "Temp3: ${lastValidTemp3 ?: "N/A"}"
                    tvTemp4.text = "Temp4: ${lastValidTemp4 ?: "N/A"}"
                    tvTemp5.text = "Temp5: ${lastValidTemp5 ?: "N/A"}"
                    tvTemp6.text = "Temp6: ${lastValidTemp6 ?: "N/A"}"
                    tvTemp7.text = "Temp7: ${lastValidTemp7 ?: "N/A"}"
                    tvTemp8.text = "Temp8: ${lastValidTemp8 ?: "N/A"}"
                    tvHwVer.text = "HwVer: ${lastValidHwVer ?: "N/A"}"
                    tvFwVer.text = "FwVer: ${lastValidFwVer ?: "N/A"}"
                    tvFWSubVer.text = "FWSubVer: ${lastValidFWSubVer ?: "N/A"}"
                    tvBtStatus_NC0PSM1CC2CV3Finish4.text = "BtStatus_NC0PSM1CC2CV3Finish4: ${lastValidBtStatus_NC0PSM1CC2CV3Finish4 ?: "N/A"}"
                    tvBt_liveMsg1Temp.text = "Bt_liveMsg1Temp: ${lastValidBt_liveMsg1Temp ?: "N/A"}"
                    tvBt_liveMsg_soc.text = "Bt_liveMsg_soc: ${lastValidBt_liveMsg_soc ?: "N/A"}"
                    tvBMS_status.text = "BMS_status: ${lastValidBMS_status ?: "N/A"}"
                    tvDemand_voltage.text = "Demand_voltage: ${lastValidDemand_voltage ?: "N/A"}"
                    tvDemand_Current.text = "Demand_Current: ${lastValidDemand_Current ?: "N/A"}"
                    tvMaxChgVoltgae.text = "MaxChgVoltgae: ${lastValidMaxChgVoltgae ?: "N/A"}"
                    tvMaxChgCurrent.text = "MaxChgCurrent: ${lastValidMaxChgCurrent ?: "N/A"}"
                    tvActualChgVoltage.text = "ActualChgVoltage: ${lastValidActualChgVoltage ?: "N/A"}"
                    tvActualChgCurrent.text = "ActualChgCurrent: ${lastValidActualChgCurrent ?: "N/A"}"
                    tvCharging_end_cutoff_Curr.text = "Charging_end_cutoff_Curr: ${lastValidCharging_end_cutoff_Curr ?: "N/A"}"
                    tvCHB_258.text = "CHB_258: ${lastValidCHB_258 ?: "N/A"}"
                    tvChgrNC0PSM1CC2CV3Finsh4.text = "ChgrNC0PSM1CC2CV3Finsh4: ${lastValidChgrNC0PSM1CC2CV3Finsh4 ?: "N/A"}"
                    tvchgr_msg_temp.text = "chgr_msg_temp: ${lastValidchgr_msg_temp ?: "N/A"}"
                    tvChgStatus_chg_idle.text = "ChgStatus_chg_idle: ${lastValidChgStatus_chg_idle ?: "N/A"}"
                    tvchgrLiveMsgChgVolt.text = "chgrLiveMsgChgVolt: ${lastValidchgrLiveMsgChgVolt ?: "N/A"}"
                    tvchgrLiveMsgChgCurrent.text = "chgrLiveMsgChgCurrent: ${lastValidchgrLiveMsgChgCurrent ?: "N/A"}"
                    tvChargeSOP.text = "ChargeSOP: ${lastValidChargeSOP ?: "N/A"}"
                    tvDchgSOP.text = "DchgSOP: ${lastValidDchgSOP ?: "N/A"}"
                    tvDrive_Error_Flag.text = "Drive_Error_Flag: ${lastValidDrive_Error_Flag ?: "N/A"}"
                    tvSet_Regen.text = "Set_Regen: ${lastValidSet_Regen ?: "N/A"}"
                    tvDCcurrentlimit.text = "DCcurrentlimit: ${lastValidDCcurrentlimit ?: "N/A"}"
                    tvCustom_freq.text = "Custom_freq: ${lastValidCustom_freq ?: "N/A"}"
                    tvCustom_torque.text = "Custom_torque: ${lastValidCustom_torque ?: "N/A"}"
                    tvBuffer_speed.text = "Buffer_speed: ${lastValidBuffer_speed ?: "N/A"}"
                    tvBase_speed.text = "Base_speed: ${lastValidBase_speed ?: "N/A"}"
                    tvInitial_torque.text = "Initial_torque: ${lastValidInitial_torque ?: "N/A"}"
                    tvFinal_torque.text = "Final_torque: ${lastValidFinal_torque ?: "N/A"}"
                    tvCluster_odo.text = "Cluster_odo: ${lastValidCluster_odo ?: "N/A"}"
                    tvMotorSpeed.text = "MotorSpeed: ${lastValidMotorSpeed ?: "N/A"}"
                    tvBatteryVoltage.text = "BatteryVoltage: ${lastValidBatteryVoltage ?: "N/A"}"
                    tvBatteryCurrent.text = "BatteryCurrent: ${lastValidBatteryCurrent ?: "N/A"}"
                    tvAC_Current.text = "AC_Current: ${lastValidAC_Current ?: "N/A"}"
                    tvAC_Voltage.text = "AC_Voltage: ${lastValidAC_Voltage ?: "N/A"}"
                    tvThrottle.text = "Throttle: ${lastValidThrottle ?: "N/A"}"
                    tvMCU_Temperature.text = "MCU_Temperature: ${lastValidMCU_Temperature ?: "N/A"}"
                    tvMotor_Temperature.text = "Motor_Temperature: ${lastValidMotor_Temperature ?: "N/A"}"
                    tvMCU_Fault_Code.text = "MCU_Fault_Code: ${lastValidMCU_Fault_Code ?: "N/A"}"
                    tvMCU_ID.text = "MCU_ID: ${lastValidMCU_ID ?: "N/A"}"
                    tvCluster_heartbeat.text = "Cluster_heartbeat: ${lastValidCluster_heartbeat ?: "N/A"}"
                    tvOdo_Cluster.text = "Odo_Cluster: ${lastValidOdo_Cluster ?: "N/A"}"
                    tvSW_Version_MAJ.text = "SW_Version_MAJ: ${lastValidSW_Version_MAJ ?: "N/A"}"
                    tvSW_Version_MIN.text = "SW_Version_MIN: ${lastValidSW_Version_MIN ?: "N/A"}"
                    tvHW_Version_MAJ.text = "HW_Version_MAJ: ${lastValidHW_Version_MAJ ?: "N/A"}"
                    tvHW_Version_MIN.text = "HW_Version_MIN: ${lastValidHW_Version_MIN ?: "N/A"}"
                    tvMCU_Firmware_Id.text = "MCU_Firmware_Id: ${lastValidMCU_Firmware_Id ?: "N/A"}"
                    tvIgnitionStatus.text = "IgnitionStatus: ${lastValidIgnitionStatus ?: "N/A"}"
                    tvLoadDetection.text = "LoadDetection: ${lastValidLoadDetection ?: "N/A"}"
                    tvKeystatus.text = "Keystatus: ${lastValidKeystatus ?: "N/A"}"
                    tvKeyevents.text = "Keyevents: ${lastValidKeyevents ?: "N/A"}"
                    tvCellUnderVolProt.text = "CellUnderVolProt: ${lastValidCellUnderVolProt ?: "N/A"}"
                    tvCellOverVolProt.text = "CellOverVolProt: ${lastValidCellOverVolProt ?: "N/A"}"
                    tvPackUnderVolProt.text = "PackUnderVolProt: ${lastValidPackUnderVolProt ?: "N/A"}"
                    tvPackOverVolProt.text = "PackOverVolProt: ${lastValidPackOverVolProt ?: "N/A"}"
                    tvChgUnderTempProt.text = "ChgUnderTempProt: ${lastValidChgUnderTempProt ?: "N/A"}"
                    tvChgOverTempProt.text = "ChgOverTempProt: ${lastValidChgOverTempProt ?: "N/A"}"
                    tvDchgUnderTempProt.text = "DchgUnderTempProt: ${lastValidDchgUnderTempProt ?: "N/A"}"
                    tvDchgOverTempProt.text = "DchgOverTempProt: ${lastValidDchgOverTempProt ?: "N/A"}"
                    tvCellOverDevProt.text = "CellOverDevProt: ${lastValidCellOverDevProt ?: "N/A"}"
                    tvBattLowSocWarn.text = "BattLowSocWarn: ${lastValidBattLowSocWarn ?: "N/A"}"
                    tvChgOverCurrProt.text = "ChgOverCurrProt: ${lastValidChgOverCurrProt ?: "N/A"}"
                    tvDchgOverCurrProt.text = "DchgOverCurrProt: ${lastValidDchgOverCurrProt ?: "N/A"}"
                    tvCellUnderVolWarn.text = "CellUnderVolWarn: ${lastValidCellUnderVolWarn ?: "N/A"}"
                    tvCellOverVolWarn.text = "CellOverVolWarn: ${lastValidCellOverVolWarn ?: "N/A"}"
                    tvFetTempProt.text = "FetTempProt: ${lastValidFetTempProt ?: "N/A"}"
                    tvResSocProt.text = "ResSocProt: ${lastValidResSocProt ?: "N/A"}"
                    tvFetFailure.text = "FetFailure: ${lastValidFetFailure ?: "N/A"}"
                    tvTempSenseFault.text = "TempSenseFault: ${lastValidTempSenseFault ?: "N/A"}"
                    tvPackUnderVolWarn.text = "PackUnderVolWarn: ${lastValidPackUnderVolWarn ?: "N/A"}"
                    tvPackOverVolWarn.text = "PackOverVolWarn: ${lastValidPackOverVolWarn ?: "N/A"}"
                    tvChgUnderTempWarn.text = "ChgUnderTempWarn: ${lastValidChgUnderTempWarn ?: "N/A"}"
                    tvChgOverTempWarn.text = "ChgOverTempWarn: ${lastValidChgOverTempWarn ?: "N/A"}"
                    tvDchgUnderTempWarn.text = "DchgUnderTempWarn: ${lastValidDchgUnderTempWarn ?: "N/A"}"
                    tvDchgOverTempWarn.text = "DchgOverTempWarn: ${lastValidDchgOverTempWarn ?: "N/A"}"
                    tvPreChgFetStatus.text = "PreChgFetStatus: ${lastValidPreChgFetStatus ?: "N/A"}"
                    tvChgFetStatus.text = "ChgFetStatus: ${lastValidChgFetStatus ?: "N/A"}"
                    tvDchgFetStatus.text = "DchgFetStatus: ${lastValidDchgFetStatus ?: "N/A"}"
                    tvResStatus.text = "ResStatus: ${lastValidResStatus ?: "N/A"}"
                    tvShortCktProt.text = "ShortCktProt: ${lastValidShortCktProt ?: "N/A"}"
                    tvDschgPeakProt.text = "DschgPeakProt: ${lastValidDschgPeakProt ?: "N/A"}"
                    tvChgAuth.text = "ChgAuth: ${lastValidChgAuth ?: "N/A"}"
                    tvChgPeakProt.text = "ChgPeakProt: ${lastValidChgPeakProt ?: "N/A"}"
                    tvDI1.text = "DI1: ${lastValidDI1 ?: "N/A"}"
                    tvDI2.text = "DI2: ${lastValidDI2 ?: "N/A"}"
                    tvDO1.text = "DO1: ${lastValidDO1 ?: "N/A"}"
                    tvDO2.text = "DO2: ${lastValidDO2 ?: "N/A"}"
                    tvChargerDetection.text = "ChargerDetection: ${lastValidChargerDetection ?: "N/A"}"
                    tvCanCommDetection.text = "CanCommDetection: ${lastValidCanCommDetection ?: "N/A"}"
                    tvCellBalFeatureStatus.text = "CellBalFeatureStatus: ${lastValidCellBalFeatureStatus ?: "N/A"}"
                    tvImmoChg.text = "ImmoChg: ${lastValidImmoChg ?: "N/A"}"
                    tvImmoDchg.text = "ImmoDchg: ${lastValidImmoDchg ?: "N/A"}"
                    tvBuzzerStatus.text = "BuzzerStatus: ${lastValidBuzzerStatus ?: "N/A"}"
                    tvSide_Stand_Ack.text = "Side_Stand_Ack: ${lastValidSide_Stand_Ack ?: "N/A"}"
                    tvDirection_Ack.text = "Direction_Ack: ${lastValidDirection_Ack ?: "N/A"}"
                    tvRide_Ack.text = "Ride_Ack: ${lastValidRide_Ack ?: "N/A"}"
                    tvHill_hold_Ack.text = "Hill_hold_Ack: ${lastValidHill_hold_Ack ?: "N/A"}"
                    tvWakeup_Ack.text = "Wakeup_Ack: ${lastValidWakeup_Ack ?: "N/A"}"
                    tvDriveError_Motor_hall.text = "DriveError_Motor_hall: ${lastValidDriveError_Motor_hall ?: "N/A"}"
                    tvMotor_Stalling.text = "Motor_Stalling: ${lastValidMotor_Stalling ?: "N/A"}"
                    tvMotor_Phase_loss.text = "Motor_Phase_loss: ${lastValidMotor_Phase_loss ?: "N/A"}"
                    tvController_Over_Temeprature.text = "Controller_Over_Temeprature: ${lastValidController_Over_Temeprature ?: "N/A"}"
                    tvMotor_Over_Temeprature.text = "Motor_Over_Temeprature: ${lastValidMotor_Over_Temeprature ?: "N/A"}"
                    tvThrottle_Error.text = "Throttle_Error: ${lastValidThrottle_Error ?: "N/A"}"
                    tvMOSFET_Protection.text = "MOSFET_Protection: ${lastValidMOSFET_Protection ?: "N/A"}"
                    tvDriveStatus_Regenerative_Braking.text = "DriveStatus_Regenerative_Braking: ${lastValidDriveStatus_Regenerative_Braking ?: "N/A"}"
                    tvModeR_Pulse.text = "ModeR_Pulse: ${lastValidModeR_Pulse ?: "N/A"}"
                    tvModeL_Pulse.text = "ModeL_Pulse: ${lastValidModeL_Pulse ?: "N/A"}"
                    tvBrake_Pulse.text = "Brake_Pulse: ${lastValidBrake_Pulse ?: "N/A"}"
                    tvPark_Pulse.text = "Park_Pulse: ${lastValidPark_Pulse ?: "N/A"}"
                    tvReverse_Pulse.text = "Reverse_Pulse: ${lastValidReverse_Pulse ?: "N/A"}"
                    tvSideStand_Pulse.text = "SideStand_Pulse: ${lastValidSideStand_Pulse ?: "N/A"}"
                    tvForwardParking_Mode_Ack.text = "ForwardParking_Mode_Ack: ${lastValidForwardParking_Mode_Ack ?: "N/A"}"
                    tvDriveError_Controller_OverVoltag.text = "DriveError_Controller_OverVoltag: ${lastValidDriveError_Controller_OverVoltag ?: "N/A"}"
                    tvController_Undervoltage.text = "Controller_Undervoltage: ${lastValidController_Undervoltage ?: "N/A"}"
                    tvOvercurrent_Fault.text = "Overcurrent_Fault: ${lastValidOvercurrent_Fault ?: "N/A"}"
                    tvDriveStatus1_ride.text = "DriveStatus1_ride: ${lastValidDriveStatus1_ride ?: "N/A"}"
                    tvWakeup_Request.text = "Wakeup_Request: ${lastValidWakeup_Request ?: "N/A"}"
                    tvHill_Hold.text = "Hill_Hold: ${lastValidHill_Hold ?: "N/A"}"
                    tvReverse_REQUEST.text = "Reverse_REQUEST: ${lastValidReverse_REQUEST ?: "N/A"}"
                    tvForward_parkingmode_REQUEST.text = "Forward_parkingmode_REQUEST: ${lastValidForward_parkingmode_REQUEST ?: "N/A"}"
                    tvSide_stand_Req.text = "Side_stand_Req: ${lastValidSide_stand_Req ?: "N/A"}"
                    tvBattery_charge_logic.text = "Battery_charge_logic: ${lastValidBattery_charge_logic ?: "N/A"}"
                    tvRemote_cutoff.text = "Remote_cutoff: ${lastValidRemote_cutoff ?: "N/A"}"
                    tvmode_limit.text = "mode_limit: ${lastValidmode_limit ?: "N/A"}"
                    tvGeo_fencebuzzer.text = "Geo_fencebuzzer: ${lastValidGeo_fencebuzzer ?: "N/A"}"
                    tvHoliday_mode.text = "Holiday_mode: ${lastValidHoliday_mode ?: "N/A"}"
                    tvService_request.text = "Service_request: ${lastValidService_request ?: "N/A"}"
                    tvLow_Mode_REQUEST.text = "Low_Mode_REQUEST: ${lastValidLow_Mode_REQUEST ?: "N/A"}"
                    tvMedium_Mode_REQUEST.text = "Medium_Mode_REQUEST: ${lastValidMedium_Mode_REQUEST ?: "N/A"}"
                    tvUser_defind_mode_High_REQUEST.text = "User_defind_mode_High_REQUEST: ${lastValidUser_defind_mode_High_REQUEST ?: "N/A"}"
                    tvLimp_mode_REQUEST.text = "Limp_mode_REQUEST: ${lastValidLimp_mode_REQUEST ?: "N/A"}"
                }
            }
        })
    }

    // ---------------------------------------------------------------------------------------------
    // CSV Recording
    // ---------------------------------------------------------------------------------------------
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
                    ChgStatus_chg_idle = lastValidChgStatus_chg_idle,
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
                    SW_Version_MAJ = lastValidSW_Version_MAJ,
                    SW_Version_MIN = lastValidSW_Version_MIN,
                    HW_Version_MAJ = lastValidHW_Version_MAJ,
                    HW_Version_MIN = lastValidHW_Version_MIN,
                    MCU_Firmware_Id = lastValidMCU_Firmware_Id,
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
                    Controller_Over_Temeprature = lastValidController_Over_Temeprature,
                    Motor_Over_Temeprature = lastValidMotor_Over_Temeprature,
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

                delay(500)  // Adjust based on how frequently you want to record
            }
        }
        Log.d("Log", "Recording started.")
    }

    private fun stopRecording() {
        job?.cancel()
        runOnUiThread {
            Log.d("Log", "Recording stopped.")
            Toast.makeText(this, "Recording stopped.", Toast.LENGTH_SHORT).show()
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
        val Usable_Capacity_Ah: Double?, val ConfigVer: String?, val InternalFWVer: String?, val InternalFWSubVer: String?,
        val BHB_66049: Double?, val MaxTemp: Double?, val MinTemp: Double?, val FetTemp: Double?,
        val Temp1: Double?, val Temp2: Double?, val Temp3: Double?, val Temp4: Double?,
        val Temp5: Double?, val Temp6: Double?, val Temp7: Double?, val Temp8: Double?, val HwVer: String?,
        val FwVer: String?, val FWSubVer: String?, val BtStatus_NC0PSM1CC2CV3Finish4: Double?, val Bt_liveMsg1Temp: Double?,
        val Bt_liveMsg_soc: Double?, val BMS_status: Double?, val Demand_voltage: Double?, val Demand_Current: Double?,
        val MaxChgVoltgae: Double?, val MaxChgCurrent: Double?, val ActualChgVoltage: Double?, val ActualChgCurrent: Double?,
        val Charging_end_cutoff_Curr: Double?, val CHB_258: Double?, val ChgrNC0PSM1CC2CV3Finsh4: Double?,
        val chgr_msg_temp: Double?, val ChgStatus_chg_idle: Double?, val chgrLiveMsgChgVolt: Double?, val chgrLiveMsgChgCurrent: Double?,
        val ChargeSOP: Double?, val DchgSOP: Double?, val Drive_Error_Flag: Double?, val Set_Regen: Double?,
        val DCcurrentlimit: Double?, val Custom_freq: Double?, val Custom_torque: Double?, val Buffer_speed: Double?,
        val Base_speed: Double?, val Initial_torque: Double?, val Final_torque: Double?, val Cluster_odo: Double?,
        val MotorSpeed: Double?, val BatteryVoltage: Double?, val BatteryCurrent: Double?, val AC_Current: Double?,
        val AC_Voltage: Double?, val Throttle: Double?, val MCU_Temperature: Double?, val Motor_Temperature: Double?,
        val MCU_Fault_Code: Double?, val MCU_ID: Double?, val Cluster_heartbeat: Double?, val Odo_Cluster: Double?, val SW_Version_MAJ: Double?, val SW_Version_MIN: Double?, val HW_Version_MAJ: Double?, val HW_Version_MIN: Double?, val MCU_Firmware_Id: String?,
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
        val Controller_Over_Temeprature: Int?,
        val Motor_Over_Temeprature: Int?,
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

    private fun saveDataToCSV(metrics: VehicleMetrics) {
        saveFileUri?.let { uri ->
            contentResolver.openOutputStream(uri, "wa")?.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    if (!headersWritten) {
                        writer.append("Timestamp,CellVol01,PackCurr,IgnitionStatus,Mode_Ack,CellVol02,CellVol03,CellVol04,CellVol05,CellVol06,CellVol07,CellVol08,CellVol09,CellVol10,CellVol11,CellVol12,CellVol13,CellVol14,CellVol15,CellVol16,MaxCellVol,MinCellVol,AvgCellVol,MaxVoltId,MinVoltId,PackVol,CycleCount,CellVolMinMaxDev,SOC,SOCAh,SOH,BmsStatus,LedStatus,ActiveCellBalStatus,BMS_Serial_No_MUX,BMS_Serial_No__1_7,LatchProtection,LatchType,ChargerType,PcbTemp,AfeTemp,CellChemType,Chg_Accumulative_Ah,Dchg_Accumulative_Ah,RefVol,_3v3Vol,_5vVol,_12vVol,Actual_SoC,Usable_Capacity_Ah,ConfigVer,InternalFWVer,InternalFWSubVer,BHB_66049,MaxTemp,MinTemp,FetTemp,Temp1,Temp2,Temp3,Temp4,Temp5,Temp6,Temp7,Temp8,HwVer,FwVer,FWSubVer,BtStatus_NC0PSM1CC2CV3Finish4,Bt_liveMsg1Temp,Bt_liveMsg_soc,BMS_status,Demand_voltage,Demand_Current,MaxChgVoltgae,MaxChgCurrent,ActualChgVoltage,ActualChgCurrent,Charging_end_cutoff_Curr,CHB_258,ChgrNC0PSM1CC2CV3Finsh4,chgr_msg_temp,ChgStatus_chg_idle,chgrLiveMsgChgVolt,chgrLiveMsgChgCurrent,ChargeSOP,DchgSOP,Drive_Error_Flag,Set_Regen,DCcurrentlimit,Custom_freq,Custom_torque,Buffer_speed,Base_speed,Initial_torque,Final_torque,Cluster_odo,MotorSpeed,BatteryVoltage,BatteryCurrent,AC_Current,AC_Voltage,Throttle,MCU_Temperature,Motor_Temperature,MCU_Fault_Code,MCU_ID,Cluster_heartbeat,Odo_Cluster,SW_Version_MAJ,SW_Version_MIN,HW_Version_MAJ,HW_Version_MIN,MCU_Firmware_Id,LoadDetection,Keystatus,Keyevents,CellUnderVolProt,CellOverVolProt,PackUnderVolProt,PackOverVolProt,ChgUnderTempProt,ChgOverTempProt,DchgUnderTempProt,DchgOverTempProt,CellOverDevProt,BattLowSocWarn,ChgOverCurrProt,DchgOverCurrProt,CellUnderVolWarn,CellOverVolWarn,FetTempProt,ResSocProt,FetFailure,TempSenseFault,PackUnderVolWarn,PackOverVolWarn,ChgUnderTempWarn,ChgOverTempWarn,DchgUnderTempWarn,DchgOverTempWarn,PreChgFetStatus,ChgFetStatus,DchgFetStatus,ResStatus,ShortCktProt,DschgPeakProt,ChgAuth,ChgPeakProt,DI1,DI2,DO1,DO2,ChargerDetection,CanCommDetection,CellBalFeatureStatus,ImmoChg,ImmoDchg,BuzzerStatus,Side_Stand_Ack,Direction_Ack,Ride_Ack,Hill_hold_Ack,Wakeup_Ack,DriveError_Motor_hall,Motor_Stalling,Motor_Phase_loss,Controller_Over_Temeprature,Motor_Over_Temeprature,Throttle_Error,MOSFET_Protection,DriveStatus_Regenerative_Braking,ModeR_Pulse,ModeL_Pulse,Brake_Pulse,Park_Pulse,Reverse_Pulse,SideStand_Pulse,ForwardParking_Mode_Ack,DriveError_Controller_OverVoltag,Controller_Undervoltage,Overcurrent_Fault,DriveStatus1_ride,Wakeup_Request,Hill_Hold,Reverse_REQUEST,Forward_parkingmode_REQUEST,Side_stand_Req,Battery_charge_logic,Remote_cutoff,mode_limit,Geo_fencebuzzer,Holiday_mode,Service_request,Low_Mode_REQUEST,Medium_Mode_REQUEST,User_defind_mode_High_REQUEST,Limp_mode_REQUEST\n")
                        headersWritten = true
                    }
                    val timestamp = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault()).format(Date())

                    writer.append(
    "$timestamp,${metrics.CellVol01 ?: ""},${metrics.PackCurr ?: ""},${metrics.IgnitionStatus ?: ""},${metrics.Mode_Ack ?: ""},${metrics.CellVol02 ?: ""},${metrics.CellVol03 ?: ""},${metrics.CellVol04 ?: ""},${metrics.CellVol05 ?: ""},${metrics.CellVol06 ?: ""},${metrics.CellVol07 ?: ""},${metrics.CellVol08 ?: ""},${metrics.CellVol09 ?: ""},${metrics.CellVol10 ?: ""},${metrics.CellVol11 ?: ""},${metrics.CellVol12 ?: ""},${metrics.CellVol13 ?: ""},${metrics.CellVol14 ?: ""},${metrics.CellVol15 ?: ""},${metrics.CellVol16 ?: ""},${metrics.MaxCellVol ?: ""},${metrics.MinCellVol ?: ""},${metrics.AvgCellVol ?: ""},${metrics.MaxVoltId ?: ""},${metrics.MinVoltId ?: ""},${metrics.PackVol ?: ""},${metrics.CycleCount ?: ""},${metrics.CellVolMinMaxDev ?: ""},${metrics.SOC ?: ""},${metrics.SOCAh ?: ""},${metrics.SOH ?: ""},${metrics.BmsStatus ?: ""},${metrics.LedStatus ?: ""},${metrics.ActiveCellBalStatus ?: ""},${metrics.BMS_Serial_No_MUX ?: ""},${metrics.BMS_Serial_No__1_7 ?: ""},${metrics.LatchProtection ?: ""},${metrics.LatchType ?: ""},${metrics.ChargerType ?: ""},${metrics.PcbTemp ?: ""},${metrics.AfeTemp ?: ""},${metrics.CellChemType ?: ""},${metrics.Chg_Accumulative_Ah ?: ""},${metrics.Dchg_Accumulative_Ah ?: ""},${metrics.RefVol ?: ""},${metrics._3v3Vol ?: ""},${metrics._5vVol ?: ""},${metrics._12vVol ?: ""},${metrics.Actual_SoC ?: ""},${metrics.Usable_Capacity_Ah ?: ""},${metrics.ConfigVer ?: ""},${metrics.InternalFWVer ?: ""},${metrics.InternalFWSubVer ?: ""},${metrics.BHB_66049 ?: ""},${metrics.MaxTemp ?: ""},${metrics.MinTemp ?: ""},${metrics.FetTemp ?: ""},${metrics.Temp1 ?: ""},${metrics.Temp2 ?: ""},${metrics.Temp3 ?: ""},${metrics.Temp4 ?: ""},${metrics.Temp5 ?: ""},${metrics.Temp6 ?: ""},${metrics.Temp7 ?: ""},${metrics.Temp8 ?: ""},${metrics.HwVer ?: ""},${metrics.FwVer ?: ""},${metrics.FWSubVer ?: ""},${metrics.BtStatus_NC0PSM1CC2CV3Finish4 ?: ""},${metrics.Bt_liveMsg1Temp ?: ""},${metrics.Bt_liveMsg_soc ?: ""},${metrics.BMS_status ?: ""},${metrics.Demand_voltage ?: ""},${metrics.Demand_Current ?: ""},${metrics.MaxChgVoltgae ?: ""},${metrics.MaxChgCurrent ?: ""},${metrics.ActualChgVoltage ?: ""},${metrics.ActualChgCurrent ?: ""},${metrics.Charging_end_cutoff_Curr ?: ""},${metrics.CHB_258 ?: ""},${metrics.ChgrNC0PSM1CC2CV3Finsh4 ?: ""},${metrics.chgr_msg_temp ?: ""},${metrics.ChgStatus_chg_idle ?: ""},${metrics.chgrLiveMsgChgVolt ?: ""},${metrics.chgrLiveMsgChgCurrent ?: ""},${metrics.ChargeSOP ?: ""},${metrics.DchgSOP ?: ""},${metrics.Drive_Error_Flag ?: ""},${metrics.Set_Regen ?: ""},${metrics.DCcurrentlimit ?: ""},${metrics.Custom_freq ?: ""},${metrics.Custom_torque ?: ""},${metrics.Buffer_speed ?: ""},${metrics.Base_speed ?: ""},${metrics.Initial_torque ?: ""},${metrics.Final_torque ?: ""},${metrics.Cluster_odo ?: ""},${metrics.MotorSpeed ?: ""},${metrics.BatteryVoltage ?: ""},${metrics.BatteryCurrent ?: ""},${metrics.AC_Current ?: ""},${metrics.AC_Voltage ?: ""},${metrics.Throttle ?: ""},${metrics.MCU_Temperature ?: ""},${metrics.Motor_Temperature ?: ""},${metrics.MCU_Fault_Code ?: ""},${metrics.MCU_ID ?: ""},${metrics.Cluster_heartbeat ?: ""},${metrics.Odo_Cluster ?: ""},${metrics.SW_Version_MAJ ?: ""},${metrics.SW_Version_MIN ?: ""},${metrics.HW_Version_MAJ ?: ""},${metrics.HW_Version_MIN ?: ""},${metrics.MCU_Firmware_Id ?: ""},${metrics.LoadDetection ?: ""},${metrics.Keystatus ?: ""},${metrics.Keyevents ?: ""},${metrics.CellUnderVolProt ?: ""},${metrics.CellOverVolProt ?: ""},${metrics.PackUnderVolProt ?: ""},${metrics.PackOverVolProt ?: ""},${metrics.ChgUnderTempProt ?: ""},${metrics.ChgOverTempProt ?: ""},${metrics.DchgUnderTempProt ?: ""},${metrics.DchgOverTempProt ?: ""},${metrics.CellOverDevProt ?: ""},${metrics.BattLowSocWarn ?: ""},${metrics.ChgOverCurrProt ?: ""},${metrics.DchgOverCurrProt ?: ""},${metrics.CellUnderVolWarn ?: ""},${metrics.CellOverVolWarn ?: ""},${metrics.FetTempProt ?: ""},${metrics.ResSocProt ?: ""},${metrics.FetFailure ?: ""},${metrics.TempSenseFault ?: ""},${metrics.PackUnderVolWarn ?: ""},${metrics.PackOverVolWarn ?: ""},${metrics.ChgUnderTempWarn ?: ""},${metrics.ChgOverTempWarn ?: ""},${metrics.DchgUnderTempWarn ?: ""},${metrics.DchgOverTempWarn ?: ""},${metrics.PreChgFetStatus ?: ""},${metrics.ChgFetStatus ?: ""},${metrics.DchgFetStatus ?: ""},${metrics.ResStatus ?: ""},${metrics.ShortCktProt ?: ""},${metrics.DschgPeakProt ?: ""},${metrics.ChgAuth ?: ""},${metrics.ChgPeakProt ?: ""},${metrics.DI1 ?: ""},${metrics.DI2 ?: ""},${metrics.DO1 ?: ""},${metrics.DO2 ?: ""},${metrics.ChargerDetection ?: ""},${metrics.CanCommDetection ?: ""},${metrics.CellBalFeatureStatus ?: ""},${metrics.ImmoChg ?: ""},${metrics.ImmoDchg ?: ""},${metrics.BuzzerStatus ?: ""},${metrics.Side_Stand_Ack ?: ""},${metrics.Direction_Ack ?: ""},${metrics.Ride_Ack ?: ""},${metrics.Hill_hold_Ack ?: ""},${metrics.Wakeup_Ack ?: ""},${metrics.DriveError_Motor_hall ?: ""},${metrics.Motor_Stalling ?: ""},${metrics.Motor_Phase_loss ?: ""},${metrics.Controller_Over_Temeprature ?: ""},${metrics.Motor_Over_Temeprature ?: ""},${metrics.Throttle_Error ?: ""},${metrics.MOSFET_Protection ?: ""},${metrics.DriveStatus_Regenerative_Braking ?: ""},${metrics.ModeR_Pulse ?: ""},${metrics.ModeL_Pulse ?: ""},${metrics.Brake_Pulse ?: ""},${metrics.Park_Pulse ?: ""},${metrics.Reverse_Pulse ?: ""},${metrics.SideStand_Pulse ?: ""},${metrics.ForwardParking_Mode_Ack ?: ""},${metrics.DriveError_Controller_OverVoltag ?: ""},${metrics.Controller_Undervoltage ?: ""},${metrics.Overcurrent_Fault ?: ""},${metrics.DriveStatus1_ride ?: ""},${metrics.Wakeup_Request ?: ""},${metrics.Hill_Hold ?: ""},${metrics.Reverse_REQUEST ?: ""},${metrics.Forward_parkingmode_REQUEST ?: ""},${metrics.Side_stand_Req ?: ""},${metrics.Battery_charge_logic ?: ""},${metrics.Remote_cutoff ?: ""},${metrics.mode_limit ?: ""},${metrics.Geo_fencebuzzer ?: ""},${metrics.Holiday_mode ?: ""},${metrics.Service_request ?: ""},${metrics.Low_Mode_REQUEST ?: ""},${metrics.Medium_Mode_REQUEST ?: ""},${metrics.User_defind_mode_High_REQUEST ?: ""},${metrics.Limp_mode_REQUEST ?: ""}\n"
)
                }
            }
        }
    }

    // ---------------------------------------------------------------------------------------------
    // File Save Location
    // ---------------------------------------------------------------------------------------------
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
                Log.d("Log", "File save location selected.")
                Toast.makeText(this, "Save location selected.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        bluetoothGatt?.close()
    }
}