import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Button } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import { NativeModules } from 'react-native';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const { FileSaveModule } = NativeModules;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [CellVol01, setCellVol01] = useState<number | null>(null);
  const [CellVol02, setCellVol02] = useState<number | null>(null);
  const [CellVol03, setCellVol03] = useState<number | null>(null);
  const [CellVol04, setCellVol04] = useState<number | null>(null);
  const [CellVol05, setCellVol05] = useState<number | null>(null);
  const [CellVol06, setCellVol06] = useState<number | null>(null);
  const [CellVol07, setCellVol07] = useState<number | null>(null);
  const [CellVol08, setCellVol08] = useState<number | null>(null);
  const [CellVol09, setCellVol09] = useState<number | null>(null);
  const [CellVol10, setCellVol10] = useState<number | null>(null);
  const [CellVol11, setCellVol11] = useState<number | null>(null);
  const [CellVol12, setCellVol12] = useState<number | null>(null);
  const [CellVol13, setCellVol13] = useState<number | null>(null);
  const [CellVol14, setCellVol14] = useState<number | null>(null);
  const [CellVol15, setCellVol15] = useState<number | null>(null);
  const [CellVol16, setCellVol16] = useState<number | null>(null);

  const [MaxCellVol, setMaxCellVol] = useState<number | null>(null);
  const [MinCellVol, setMinCellVol] = useState<number | null>(null);
  const [AvgCellVol, setAvgCellVol] = useState<number | null>(null);
  const [MaxVoltId, setMaxVoltId] = useState<number | null>(null);
  const [MinVoltId, setMinVoltId] = useState<number | null>(null);
  const [PackVol, setPackVol] = useState<number | null>(null);
  const [CycleCount, setCycleCount] = useState<number | null>(null);
  const [CellVolMinMaxDev, setCellVolMinMaxDev] = useState<number | null>(null);
  const [SOC, setSOC] = useState<number | null>(null);
  const [SOCAh, setSOCAh] = useState<number | null>(null);
  const [SOH, setSOH] = useState<number | null>(null);
  const [BmsStatus, setBmsStatus] = useState<number | null>(null);
  const [LedStatus, setLedStatus] = useState<number | null>(null);
  const [ActiveCellBalStatus, setActiveCellBalStatus] = useState<number | null>(null);
  const [BMS_Serial_No_MUX, setBMS_Serial_No_MUX] = useState<number | null>(null);
  const [BMS_Serial_No__1_7, setBMS_Serial_No__1_7] = useState<number | null>(null);
  const [LatchProtection, setLatchProtection] = useState<number | null>(null);
  const [LatchType, setLatchType] = useState<number | null>(null);
  const [ChargerType, setChargerType] = useState<number | null>(null);
  const [PcbTemp, setPcbTemp] = useState<number | null>(null);
  const [AfeTemp, setAfeTemp] = useState<number | null>(null);
  const [CellChemType, setCellChemType] = useState<number | null>(null);
  const [Chg_Accumulative_Ah, setChg_Accumulative_Ah] = useState<number | null>(null);
  const [Dchg_Accumulative_Ah, setDchg_Accumulative_Ah] = useState<number | null>(null);
  const [RefVol, setRefVol] = useState<number | null>(null);
  const [_3v3Vol, set_3v3Vol] = useState<number | null>(null);
  const [_5vVol, set_5vVol] = useState<number | null>(null);
  const [_12vVol, set_12vVol] = useState<number | null>(null);
  const [Actual_SoC, setActual_SoC] = useState<number | null>(null);
  const [Usable_Capacity_Ah, setUsable_Capacity_Ah] = useState<number | null>(null);
  const [ConfigVer, setConfigVer] = useState<number | null>(null);
  const [InternalFWVer, setInternalFWVer] = useState<number | null>(null);
  const [InternalFWSubVer, setInternalFWSubVer] = useState<number | null>(null);
  const [BHB_66049, setBHB_66049] = useState<number | null>(null);
  const [PackCurr, setPackCurr] = useState<number | null>(null);
  const [MaxTemp, setMaxTemp] = useState<number | null>(null);
  const [MinTemp, setMinTemp] = useState<number | null>(null);
  const [FetTemp, setFetTemp] = useState<number | null>(null);
  const [Temp1, setTemp1] = useState<number | null>(null);
  const [Temp2, setTemp2] = useState<number | null>(null);
  const [Temp3, setTemp3] = useState<number | null>(null);
  const [Temp4, setTemp4] = useState<number | null>(null);
  const [Temp5, setTemp5] = useState<number | null>(null);
  const [Temp6, setTemp6] = useState<number | null>(null);
  const [Temp7, setTemp7] = useState<number | null>(null);
  const [Temp8, setTemp8] = useState<number | null>(null);
  const [HwVer, setHwVer] = useState<number | null>(null);
  const [FwVer, setFwVer] = useState<number | null>(null);
  const [FWSubVer, setFWSubVer] = useState<number | null>(null);
  const [BtStatus_NC0PSM1CC2CV3Finish4, setBtStatus_NC0PSM1CC2CV3Finish4] = useState<number | null>(null);
  const [Bt_liveMsg1Temp, setBt_liveMsg1Temp] = useState<number | null>(null);
  const [Bt_liveMsg_soc, setBt_liveMsg_soc] = useState<number | null>(null);
  const [BMS_status, setBMS_status] = useState<number | null>(null);
  const [Demand_voltage, setDemand_voltage] = useState<number | null>(null);
  const [Demand_Current, setDemand_Current] = useState<number | null>(null);
  const [MaxChgVoltgae, setMaxChgVoltgae] = useState<number | null>(null);
  const [MaxChgCurrent, setMaxChgCurrent] = useState<number | null>(null);
  const [ActualChgVoltage, setActualChgVoltage] = useState<number | null>(null);
  const [ActualChgCurrent, setActualChgCurrent] = useState<number | null>(null);
  const [Charging_end_cutoff_Curr, setCharging_end_cutoff_Curr] = useState<number | null>(null);
  const [CHB_258, setCHB_258] = useState<number | null>(null);
  const [ChgrNC0PSM1CC2CV3Finsh4, setChgrNC0PSM1CC2CV3Finsh4] = useState<number | null>(null);
  const [chgr_msg_temp, setchgr_msg_temp] = useState<number | null>(null);
  const [chgStatus_chg_idle, setchgStatus_chg_idle] = useState<number | null>(null);
  const [chgrLiveMsgChgVolt, setchgrLiveMsgChgVolt] = useState<number | null>(null);
  const [chgrLiveMsgChgCurrent, setchgrLiveMsgChgCurrent] = useState<number | null>(null);
  const [MotorSpeed, setMotorSpeed] = useState<number | null>(null);
  const [BatteryVoltage, setBatteryVoltage] = useState<number | null>(null);
  const [BatteryCurrent, setBatteryCurrent] = useState<number | null>(null);
  const [AC_Current, setAC_Current] = useState<number | null>(null);
  const [AC_Voltage, setAC_Voltage] = useState<number | null>(null);
  const [Throttle, setThrottle] = useState<number | null>(null);
  const [MCU_Temperature, setMCU_Temperature] = useState<number | null>(null);
  const [Motor_Temperature, setMotor_Temperature] = useState<number | null>(null);
  const [MCU_Fault_Code, setMCU_Fault_Code] = useState<number | null>(null);
  const [MCU_ID, setMCU_ID] = useState<number | null>(null);
  const [Cluster_heartbeat, setCluster_heartbeat] = useState<number | null>(null);
  const [Odo_Cluster, setOdo_Cluster] = useState<number | null>(null);
  const [IgnitionStatus, setIgnitionStatus] = useState<number | null>(null);
  const [LoadDetection, setLoadDetection] = useState<number | null>(null);
  const [Keystatus, setKeystatus] = useState<number | null>(null);
  const [keyevents, setkeyevents] = useState<number | null>(null);
  const [CellUnderVolProt, setCellUnderVolProt] = useState<number | null>(null);
  const [CellOverVolProt, setCellOverVolProt] = useState<number | null>(null);
  const [PackUnderVolProt, setPackUnderVolProt] = useState<number | null>(null);
  const [PackOverVolProt, setPackOverVolProt] = useState<number | null>(null);
  const [ChgUnderTempProt, setChgUnderTempProt] = useState<number | null>(null);
  const [ChgOverTempProt, setChgOverTempProt] = useState<number | null>(null);
  const [DchgUnderTempProt, setDchgUnderTempProt] = useState<number | null>(null);
  const [DchgOverTempProt, setDchgOverTempProt] = useState<number | null>(null);
  const [CellOverDevProt, setCellOverDevProt] = useState<number | null>(null);
  const [BattLowSocWarn, setBattLowSocWarn] = useState<number | null>(null);
  const [ChgOverCurrProt, setChgOverCurrProt] = useState<number | null>(null);
  const [DchgOverCurrProt, setDchgOverCurrProt] = useState<number | null>(null);
  const [CellUnderVolWarn, setCellUnderVolWarn] = useState<number | null>(null);
  const [CellOverVolWarn, setCellOverVolWarn] = useState<number | null>(null);
  const [FetTempProt, setFetTempProt] = useState<number | null>(null);
  const [ResSocProt, setResSocProt] = useState<number | null>(null);
  const [FetFailure, setFetFailure] = useState<number | null>(null);
  const [TempSenseFault, setTempSenseFault] = useState<number | null>(null);
  const [PackUnderVolWarn, setPackUnderVolWarn] = useState<number | null>(null);
  const [PackOverVolWarn, setPackOverVolWarn] = useState<number | null>(null);
  const [ChgUnderTempWarn, setChgUnderTempWarn] = useState<number | null>(null);
  const [ChgOverTempWarn, setChgOverTempWarn] = useState<number | null>(null);
  const [DchgUnderTempWarn, setDchgUnderTempWarn] = useState<number | null>(null);
  const [DchgOverTempWarn, setDchgOverTempWarn] = useState<number | null>(null);
  const [PreChgFetStatus, setPreChgFetStatus] = useState<number | null>(null);
  const [ChgFetStatus, setChgFetStatus] = useState<number | null>(null);
  const [DchgFetStatus, setDchgFetStatus] = useState<number | null>(null);
  const [ResStatus, setResStatus] = useState<number | null>(null);
  const [ShortCktProt, setShortCktProt] = useState<number | null>(null);
  const [DschgPeakProt, setDschgPeakProt] = useState<number | null>(null);
  const [ChgAuth, setChgAuth] = useState<number | null>(null);
  const [ChgPeakProt, setChgPeakProt] = useState<number | null>(null);
  const [DI1, setDI1] = useState<number | null>(null);
  const [DI2, setDI2] = useState<number | null>(null);
  const [DO1, setDO1] = useState<number | null>(null);
  const [DO2, setDO2] = useState<number | null>(null);
  const [ChargerDetection, setChargerDetection] = useState<number | null>(null);
  const [CanCommDetection, setCanCommDetection] = useState<number | null>(null);
  const [CellBalFeatureStatus, setCellBalFeatureStatus] = useState<number | null>(null);
  const [ImmoChg, setImmoChg] = useState<number | null>(null);
  const [ImmoDchg, setImmoDchg] = useState<number | null>(null);
  const [BuzzerStatus, setBuzzerStatus] = useState<number | null>(null);
  const [Side_Stand_Ack, setSide_Stand_Ack] = useState<number | null>(null);
  const [Direction_Ack, setDirection_Ack] = useState<number | null>(null);
  const [Ride_Ack, setRide_Ack] = useState<number | null>(null);
  const [Hill_hold_Ack, setHill_hold_Ack] = useState<number | null>(null);
  const [Wakeup_Ack, setWakeup_Ack] = useState<number | null>(null);
  const [DriveError_Motor_hall, setDriveError_Motor_hall] = useState<number | null>(null);
  const [Motor_Stalling, setMotor_Stalling] = useState<number | null>(null);
  const [Motor_Phase_loss, setMotor_Phase_loss] = useState<number | null>(null);
  const [Controller_Over_Temeprature, setController_Over_Temeprature] = useState<number | null>(null);
  const [Motor_Over_Temeprature, setMotor_Over_Temeprature] = useState<number | null>(null);
  const [Throttle_Error, setThrottle_Error] = useState<number | null>(null);
  const [MOSFET_Protection, setMOSFET_Protection] = useState<number | null>(null);
  const [DriveStatus_Regenerative_Braking, setDriveStatus_Regenerative_Braking] = useState<number | null>(null);
  const [ModeR_Pulse, setModeR_Pulse] = useState<number | null>(null);
  const [ModeL_Pulse, setModeL_Pulse] = useState<number | null>(null);
  const [Brake_Pulse, setBrake_Pulse] = useState<number | null>(null);
  const [Park_Pulse, setPark_Pulse] = useState<number | null>(null);
  const [Reverse_Pulse, setReverse_Pulse] = useState<number | null>(null);
  const [SideStand_Pulse, setSideStand_Pulse] = useState<number | null>(null);
  const [ForwardParking_Mode_Ack, setForwardParking_Mode_Ack] = useState<number | null>(null);
  const [DriveError_Controller_OverVoltag, setDriveError_Controller_OverVoltag] = useState<number | null>(null);
  const [Controller_Undervoltage, setController_Undervoltage] = useState<number | null>(null);
  const [Overcurrent_Fault, setOvercurrent_Fault] = useState<number | null>(null);
  const [DriveStatus1_ride, setDriveStatus1_ride] = useState<number | null>(null);
  const [Wakeup_Request, setWakeup_Request] = useState<number | null>(null);
  const [Hill_Hold, setHill_Hold] = useState<number | null>(null);
  const [Reverse_REQUEST, setReverse_REQUEST] = useState<number | null>(null);
  const [Forward_parkingmode_REQUEST, setForward_parkingmode_REQUEST] = useState<number | null>(null);
  const [Side_stand_Req, setSide_stand_Req] = useState<number | null>(null);
  const [Battery_charge_logic, setBattery_charge_logic] = useState<number | null>(null);
  const [Remote_cutoff, setRemote_cutoff] = useState<number | null>(null);
  const [mode_limit, setmode_limit] = useState<number | null>(null);
  const [Geo_fencebuzzer, setGeo_fencebuzzer] = useState<number | null>(null);
  const [Holiday_mode, setHoliday_mode] = useState<number | null>(null);
  const [Service_request, setService_request] = useState<number | null>(null);
  const [Low_Mode_REQUEST, setLow_Mode_REQUEST] = useState<number | null>(null);
  const [Medium_Mode_REQUEST, setMedium_Mode_REQUEST] = useState<number | null>(null);
  const [User_defind_mode_High_REQUEST, setUser_defind_mode_High_REQUEST] = useState<string | null>(null);
  const [Limp_mode_REQUEST, setLimp_mode_REQUEST] = useState<number | null>(null);
  const [ChargeSOP, setChargeSOP] = useState<number | null>(null);
  const [DchgSOP, setDchgSOP] = useState<number | null>(null);
  const [Drive_Error_Flag, setDrive_Error_Flag] = useState<number | null>(null);
  const [Set_Regen, setSet_Regen] = useState<number | null>(null);
  const [DCcurrentlimit, setDCcurrentlimit] = useState<number | null>(null);
  const [Custom_freq, setCustom_freq] = useState<number | null>(null);
  const [Custom_torque, setCustom_torque] = useState<number | null>(null);
  const [Buffer_speed, setBuffer_speed] = useState<number | null>(null);
  const [Base_speed, setBase_speed] = useState<number | null>(null);
  const [Initial_torque, setInitial_torque] = useState<number | null>(null);
  const [Final_torque, setFinal_torque] = useState<number | null>(null);
  const [Cluster_odo, setCluster_odo] = useState<number | null>(null);

  const [Mode_Ack, setMode_Ack] = useState<number | null>(null);

  const [fileUri, setFileUri] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const recordingRef = useRef(recording);
  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    const setupSubscription = async () => {
      await device.monitorCharacteristicForService('00FF', 'FF01', (error, characteristic) => {
        if (error) {
          Alert.alert("Subscription Error", error.message);
          return;
        }
        if (characteristic?.value) {
          const data = Buffer.from(characteristic.value, 'base64').toString('hex');
          decodeData(data, recordingRef.current);
        }
      });
      return () => device.cancelConnection();
    };
    setupSubscription();
  }, [device]);

  const tempStorage = useRef({
    CellVol01: [],
    CellVol02: [],
    CellVol03: [],
    CellVol04: [],
    CellVol05: [],
    CellVol06: [],
    CellVol07: [],
    CellVol08: [],
    CellVol09: [],
    CellVol10: [],
    CellVol11: [],
    CellVol12: [],
    CellVol13: [],
    CellVol14: [],
    CellVol15: [],
    CellVol16: [],
    MaxCellVol: [],
    MinCellVol: [],
    AvgCellVol: [],
    MaxVoltId: [],
    MinVoltId: [],
    PackVol: [],
    CycleCount: [],
    CellVolMinMaxDev: [],
    SOC: [],
    SOCAh: [],
    SOH: [],
    BmsStatus: [],
    LedStatus: [],
    ActiveCellBalStatus: [],
    BMS_Serial_No_MUX: [],
    BMS_Serial_No__1_7: [],
    LatchProtection: [],
    LatchType: [],
    ChargerType: [],
    PcbTemp: [],
    AfeTemp: [],
    CellChemType: [],
    Chg_Accumulative_Ah: [],
    Dchg_Accumulative_Ah: [],
    RefVol: [],
    _3v3Vol: [],
    _5vVol: [],
    _12vVol: [],
    Actual_SoC: [],
    Usable_Capacity_Ah: [],
    ConfigVer: [],
    InternalFWVer: [],
    InternalFWSubVer: [],
    BHB_66049: [],
    PackCurr: [],
    MaxTemp: [],
    MinTemp: [],
    FetTemp: [],
    Temp1: [],
    Temp2: [],
    Temp3: [],
    Temp4: [],
    Temp5: [],
    Temp6: [],
    Temp7: [],
    Temp8: [],
    HwVer: [],
    FwVer: [],
    FWSubVer: [],
    BtStatus_NC0PSM1CC2CV3Finish4: [],
    Bt_liveMsg1Temp: [],
    Bt_liveMsg_soc: [],
    BMS_status: [],
    Demand_voltage: [],
    Demand_Current: [],
    MaxChgVoltgae: [],
    MaxChgCurrent: [],
    ActualChgVoltage: [],
    ActualChgCurrent: [],
    Charging_end_cutoff_Curr: [],
    CHB_258: [],
    ChgrNC0PSM1CC2CV3Finsh4: [],
    chgr_msg_temp: [],
    chgStatus_chg_idle: [],
    chgrLiveMsgChgVolt: [],
    chgrLiveMsgChgCurrent: [],
    MotorSpeed: [],
    BatteryVoltage: [],
    BatteryCurrent: [],
    AC_Current: [],
    AC_Voltage: [],
    Throttle: [],
    MCU_Temperature: [],
    Motor_Temperature: [],
    MCU_Fault_Code: [],
    MCU_ID: [],
    Cluster_heartbeat: [],
    Odo_Cluster: [],
    IgnitionStatus: [],
    LoadDetection: [],
    Keystatus: [],
    keyevents: [],
    CellUnderVolProt: [],
    CellOverVolProt: [],
    PackUnderVolProt: [],
    PackOverVolProt: [],
    ChgUnderTempProt: [],
    ChgOverTempProt: [],
    DchgUnderTempProt: [],
    DchgOverTempProt: [],
    CellOverDevProt: [],
    BattLowSocWarn: [],
    ChgOverCurrProt: [],
    DchgOverCurrProt: [],
    CellUnderVolWarn: [],
    CellOverVolWarn: [],
    FetTempProt: [],
    ResSocProt: [],
    FetFailure: [],
    TempSenseFault: [],
    PackUnderVolWarn: [],
    PackOverVolWarn: [],
    ChgUnderTempWarn: [],
    ChgOverTempWarn: [],
    DchgUnderTempWarn: [],
    DchgOverTempWarn: [],
    PreChgFetStatus: [],
    ChgFetStatus: [],
    DchgFetStatus: [],
    ResStatus: [],
    ShortCktProt: [],
    DschgPeakProt: [],
    ChgAuth: [],
    ChgPeakProt: [],
    DI1: [],
    DI2: [],
    DO1: [],
    DO2: [],
    ChargerDetection: [],
    CanCommDetection: [],
    CellBalFeatureStatus: [],
    ImmoChg: [],
    ImmoDchg: [],
    BuzzerStatus: [],
    Side_Stand_Ack: [],
    Direction_Ack: [],
    Ride_Ack: [],
    Hill_hold_Ack: [],
    Wakeup_Ack: [],
    DriveError_Motor_hall: [],
    Motor_Stalling: [],
    Motor_Phase_loss: [],
    Controller_Over_Temeprature: [],
    Motor_Over_Temeprature: [],
    Throttle_Error: [],
    MOSFET_Protection: [],
    DriveStatus_Regenerative_Braking: [],
    ModeR_Pulse: [],
    ModeL_Pulse: [],
    Brake_Pulse: [],
    Park_Pulse: [],
    Reverse_Pulse: [],
    SideStand_Pulse: [],
    ForwardParking_Mode_Ack: [],
    DriveError_Controller_OverVoltag: [],
    Controller_Undervoltage: [],
    Overcurrent_Fault: [],
    DriveStatus1_ride: [],
    Wakeup_Request: [],
    Hill_Hold: [],
    Reverse_REQUEST: [],
    Forward_parkingmode_REQUEST: [],
    Side_stand_Req: [],
    Battery_charge_logic: [],
    Remote_cutoff: [],
    mode_limit: [],
    Geo_fencebuzzer: [],
    Holiday_mode: [],
    Service_request: [],
    Low_Mode_REQUEST: [],
    Medium_Mode_REQUEST: [],
    User_defind_mode_High_REQUEST: [],
    Limp_mode_REQUEST: [],
    ChargeSOP: [],
    DchgSOP: [],
    Drive_Error_Flag: [],
    Set_Regen: [],
    DCcurrentlimit: [],
    Custom_freq: [],
    Custom_torque: [],
    Buffer_speed: [],
    Base_speed: [],
    Initial_torque: [],
    Final_torque: [],
    Cluster_odo: [],
    Mode_Ack: [],
    isFirstCycle: true,
    firstLocalTime: null
  });
  
  const decodeData = (data: string, currentRecording: boolean) => {
    const packetNumberHex = data.substring(0, 2);
    const LocalTime = formatLocalTime();
    // Annmon Part-1
    const CellVol01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    const CellVol02 = eight_bytes_decode('07', 0.0001, 9, 10)(data);
    const CellVol03 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
    const CellVol04 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
    const CellVol05 = eight_bytes_decode('10', 0.0001, 6, 7)(data);
    const CellVol06 = eight_bytes_decode('10', 0.0001, 8, 9)(data);
    const CellVol07 = eight_bytes_decode('10', 0.0001, 10, 11)(data);
    const CellVol08 = eight_bytes_decode('10', 0.0001, 12, 13)(data);
    const CellVol09 = eight_bytes_decode('08', 0.0001, 4, 5)(data);
    const CellVol10 = eight_bytes_decode('08', 0.0001, 6, 7)(data);
    const CellVol11 = eight_bytes_decode('08', 0.0001, 8, 9)(data);
    const CellVol12 = eight_bytes_decode('08', 0.0001, 10, 11)(data);
    const CellVol13 = eight_bytes_decode('08', 0.0001, 12, 13)(data);
    const CellVol14 = eight_bytes_decode('08', 0.0001, 14, 15)(data);
    const CellVol15 = eight_bytes_decode('08', 0.0001, 16, 17)(data);
    const CellVol16 = eight_bytes_decode('08', 0.0001, 18, 19)(data);
    const MaxCellVol = eight_bytes_decode('09', 0.001, 1, 2)(data);
    const MinCellVol = eight_bytes_decode('09', 0.001, 3, 4)(data);
    const AvgCellVol = eight_bytes_decode('09', 0.001, 5, 6)(data);
    const MaxVoltId = eight_bytes_decode('09', 1, 7)(data);
    const MinVoltId = eight_bytes_decode('09', 1, 8)(data);
    const PackVol = eight_bytes_decode('09', 0.001, 13, 14, 15, 16)(data);
    const CycleCount = eight_bytes_decode('07', 0.001, 15, 16)(data);
    const CellVolMinMaxDev = eight_bytes_decode('08', 1 ,2, 3)(data);
    const SOC = eight_bytes_decode('09', 1, 17)(data);
    const SOCAh = eight_bytes_decode('10', 0.001, 1, 2, 3, 4)(data);
    const SOH = eight_bytes_decode('09', 1, 18)(data);
    const BmsStatus = eight_bytes_decode('10', 1 , 5)(data);
 
    // Srijanani part
    const LedStatus = eight_bytes_decode('11', 1 , 1)(data);
    const ActiveCellBalStatus = eight_bytes_decode('10', 1 , 17, 18, 19)(data);
    const BMS_Serial_No_MUX = eight_bytes_decode('16', 1 , 4)(data);
    const BMS_Serial_No__1_7 = eight_bytes_decode('16', 1 , 5, 6, 7, 8, 9, 10)(data);
    const LatchProtection = eight_bytes_decode('11', 1 , 11)(data);
    const LatchType = eight_bytes_decode('11', 1 , 12)(data);
    const ChargerType = eight_bytes_decode('11', 1 , 13)(data);
    const PcbTemp = signed_eight_bytes_decode('11', 1 , 14)(data);
    const AfeTemp = signed_eight_bytes_decode('11', 1 , 15)(data);
    const CellChemType = eight_bytes_decode('11', 1 , 16)(data);
    const Chg_Accumulative_Ah = eight_bytes_decode('12', 0.001 , 8, 9, 10, 11)(data);
    const Dchg_Accumulative_Ah = eight_bytes_decode('12', 0.001 , 12, 13, 14, 15)(data);
    const RefVol = eight_bytes_decode('12', 0.001 , 16, 17)(data);
    const _3v3Vol = eight_bytes_decode('12', 0.001 , 18, 19)(data);
    const _5vVol = eight_bytes_decode('13', 0.001 , 1, 2)(data);
    const _12vVol = eight_bytes_decode('14', 0.01 , 10, 11, 12, 13)(data);
    const Actual_SoC = eight_bytes_decode('14', 0.01 , 10, 11, 12, 13)(data);
    const Usable_Capacity_Ah = eight_bytes_decode('14', 0.001 , 14, 15, 16, 17)(data);
    const ConfigVer = eight_bytes_decode('14', 1 , 2, 3, 4)(data);
    const InternalFWVer = eight_bytes_decode('14', 1 , 5, 6, 7)(data);
    const InternalFWSubVer = eight_bytes_decode('14', 1 , 8, 9)(data);
    const BHB_66049 = eight_bytes_decode('14', 1 , 3, 4, 5)(data);
 
    // Annmon Part-2
    const PackCurr = signed_eight_bytes_decode('09', 0.001, 9, 10, 11, 12)(data); // Range of this parameter, also incluse negative values, so separate function
    const MaxTemp = signed_eight_bytes_decode('07', 1, 17)(data);
    const MinTemp = signed_eight_bytes_decode('07', 1, 18)(data);
    const FetTemp = signed_eight_bytes_decode('09', 1, 19)(data);
    const Temp1 = signed_eight_bytes_decode('11', 1, 3)(data);
    const Temp2 = signed_eight_bytes_decode('11', 1, 4)(data);
    const Temp3 = signed_eight_bytes_decode('11', 1, 5)(data);
    const Temp4 = signed_eight_bytes_decode('11', 1, 6)(data);
    const Temp5 = signed_eight_bytes_decode('11', 1, 7)(data);
    const Temp6 = signed_eight_bytes_decode('11', 1, 8)(data);
    const Temp7 = signed_eight_bytes_decode('11', 1, 9)(data);
    const Temp8 = signed_eight_bytes_decode('11', 1, 10)(data);
    const HwVer = eight_bytes_decode('06', 1, 10, 11, 12)(data);
    const FwVer = eight_bytes_decode('06', 1, 13, 14, 15)(data);
    const FWSubVer = eight_bytes_decode('06', 1, 16, 17)(data);
    const BtStatus_NC0PSM1CC2CV3Finish4 = eight_bytes_decode('17', 1 , 9)(data);
    const Bt_liveMsg1Temp = signed_eight_bytes_decode('17', 1 , 10)(data);
    const Bt_liveMsg_soc = eight_bytes_decode('17', 1 , 11)(data);
    const BMS_status = eight_bytes_decode('17', 1 , 12)(data);
    const Demand_voltage = eight_bytes_decode('17', 0.01 , 13, 14)(data);
    const Demand_Current = eight_bytes_decode('17', 0.01 , 15, 16)(data);
    const MaxChgVoltgae = eight_bytes_decode('18', 0.01, 14, 15)(data);
    const MaxChgCurrent = eight_bytes_decode('18', 0.01, 16, 17)(data);
    const ActualChgVoltage = eight_bytes_decode('18', 0.01,18, 19)(data);
    const ActualChgCurrent = signed_eight_bytes_decode('19', 0.01, 1, 2)(data);
    const Charging_end_cutoff_Curr = eight_bytes_decode('17', 0.01, 17, 18)(data);
    const CHB_258 = eight_bytes_decode('20', 1, 8, 9)(data);
    const ChgrNC0PSM1CC2CV3Finsh4 = eight_bytes_decode('19', 1, 11)(data);
    const chgr_msg_temp = eight_bytes_decode('19', 1, 12)(data);
    const chgStatus_chg_idle = eight_bytes_decode('19', 1, 14)(data);
    const chgrLiveMsgChgVolt = eight_bytes_decode('19', 0.01, 15, 16)(data);
    const chgrLiveMsgChgCurrent = eight_bytes_decode('19', 0.01, 17, 18)(data);
    const ChargeSOP = eight_bytes_decode('13', 1, 5, 6, 7, 8)(data);
    const DchgSOP = eight_bytes_decode('13', 1, 9, 10, 11, 12)(data);
    const Drive_Error_Flag = eight_bytes_decode('02', 1, 11)(data);
    const Set_Regen = eight_bytes_decode('03', 1, 13)(data);
    const DCcurrentlimit = eight_bytes_decode('03', 1, 14)(data);
    const Custom_freq = eight_bytes_decode('03', 1, 17, 16)(data);
    const Custom_torque = eight_bytes_decode('03', 1, 18)(data);
    const Buffer_speed = eight_bytes_decode('03', 1, 3, 2)(data);
    const Base_speed = eight_bytes_decode('04', 1, 5, 4)(data);
    const Initial_torque = eight_bytes_decode('04', 1, 19)(data);
    const Final_torque = eight_bytes_decode('04', 1, 1)(data);
    const Cluster_odo = eight_bytes_decode('05', 1, 15, 14, 13)(data);

    const Mode_Ack = three_bit_decode(2, 7, 2, 1, 0)(data);

        // Sanjith Gowda did from below here
        const MotorSpeed = eight_bytes_decode('01',1,2,1)(data);
        const BatteryVoltage = eight_bytes_decode('01',1,3)(data);
        const BatteryCurrent = eight_bytes_decode('01',1,5,4)(data);
        const AC_Current = eight_bytes_decode('01',1,14,15)(data);
        const AC_Voltage = eight_bytes_decode('02',1,5,4)(data);
        const Throttle = eight_bytes_decode('02',1,6)(data);    
        const MCU_Temperature = eight_bytes_decode('02',1,15,14)(data);  
        const Motor_Temperature = eight_bytes_decode('02',1,16)(data);
        const MCU_Fault_Code = eight_bytes_decode('02',1,17)(data);
        const MCU_ID = eight_bytes_decode('02',1,19,18)(data);
        const Cluster_heartbeat = eight_bytes_decode('05',1,5)(data);
        const Odo_Cluster = eight_bytes_decode('05',1,15,14,13)(data);
        // bit parameters starts here (Adarsh M C did from below here)
        const IgnitionStatus = bit_decode('11', 18, 0)(data);
        const LoadDetection = bit_decode('11', 18, 6)(data);
        //18F20310
        const Keystatus = bit_decode('11', 19, 0)(data);
        // 18F20314
        const keyevents = bit_decode('06', 18, 1)(data);
        // 0x9
        const CellUnderVolProt = bit_decode('10', 14, 0)(data);
        const CellOverVolProt = bit_decode('10', 14, 1)(data);
        const PackUnderVolProt = bit_decode('10', 14, 2)(data);
        const PackOverVolProt = bit_decode('10', 14, 3)(data);
        const ChgUnderTempProt = bit_decode('10', 14, 4)(data);
        const ChgOverTempProt = bit_decode('10', 14, 5)(data);
        const DchgUnderTempProt = bit_decode('10', 14, 6)(data);
        const DchgOverTempProt = bit_decode('10', 14, 7)(data);
        const CellOverDevProt = bit_decode('10', 15, 0)(data);
        const BattLowSocWarn = bit_decode('10', 15, 1)(data);
        const ChgOverCurrProt = bit_decode('10', 15, 2)(data);
        const DchgOverCurrProt = bit_decode('10', 15, 3)(data);
        const CellUnderVolWarn = bit_decode('10', 15, 4)(data);
        const CellOverVolWarn = bit_decode('10', 15, 5)(data);
        const FetTempProt = bit_decode('10', 15, 6)(data);
        const ResSocProt = bit_decode('10', 15, 7)(data);
        const FetFailure = bit_decode('10', 16, 0)(data);
        const TempSenseFault = bit_decode('10', 16, 1)(data);
        const PackUnderVolWarn = bit_decode('10', 16, 2)(data);
        const PackOverVolWarn = bit_decode('10', 16, 3)(data);
        const ChgUnderTempWarn = bit_decode('10', 16, 4)(data);
        const ChgOverTempWarn = bit_decode('10', 16, 5)(data);
        const DchgUnderTempWarn = bit_decode('10', 16, 6)(data);
        const DchgOverTempWarn = bit_decode('10', 16, 7)(data);
        const PreChgFetStatus = bit_decode('11', 2, 0)(data);
        const ChgFetStatus = bit_decode('11', 2, 1)(data);
        const DchgFetStatus = bit_decode('11', 2, 2)(data);
        const ResStatus = bit_decode('11', 2, 3)(data);
        const ShortCktProt = bit_decode('11', 2, 7)(data);
        const DschgPeakProt = bit_decode('11', 2, 6)(data);
        const ChgAuth = bit_decode('11', 2, 4)(data);
        const ChgPeakProt = bit_decode('11', 2, 5)(data);
        // 0xC
        const DI1 = bit_decode('11', 18, 1)(data);
        const DI2 = bit_decode('11', 18, 2)(data);
        const DO1 = bit_decode('11', 18, 3)(data);
        const DO2 = bit_decode('11', 18, 4)(data);
        const ChargerDetection = bit_decode('11', 18, 5)(data);
        const CanCommDetection = bit_decode('11', 18, 7)(data);
        const CellBalFeatureStatus = bit_decode('11', 16, 0)(data);
        const ImmoChg = bit_decode('11', 16, 1)(data);
        const ImmoDchg = bit_decode('11', 16, 2)(data);
        const BuzzerStatus = bit_decode('11', 16, 3)(data);
        // 18530902
        const Side_Stand_Ack = bit_decode('02', 7, 3)(data);
        const Direction_Ack = bit_decode('02', 7, 4)(data);
        const Ride_Ack = bit_decode('02', 7, 5)(data);
        const Hill_hold_Ack = bit_decode('02', 7, 6)(data);
        const Wakeup_Ack = bit_decode('02', 7, 7)(data);
        const DriveError_Motor_hall = bit_decode('02', 8, 0)(data);
        const Motor_Stalling = bit_decode('02', 8, 1)(data);
        const Motor_Phase_loss = bit_decode('02', 8, 2)(data);
        const Controller_Over_Temeprature = bit_decode('02', 8, 3)(data);
        const Motor_Over_Temeprature = bit_decode('02', 8, 4)(data);
        const Throttle_Error = bit_decode('02', 8, 5)(data);
        const MOSFET_Protection = bit_decode('02', 8, 6)(data);
        const DriveStatus_Regenerative_Braking = bit_decode('02', 9, 0)(data);
        const ModeR_Pulse = bit_decode('02', 9, 1)(data);
        const ModeL_Pulse = bit_decode('02', 9, 2)(data);
        const Brake_Pulse = bit_decode('02', 9, 3)(data);
        const Park_Pulse = bit_decode('02', 9, 4)(data);
        const Reverse_Pulse = bit_decode('02', 9, 5)(data);
        const SideStand_Pulse = bit_decode('02', 9, 6)(data);
        const ForwardParking_Mode_Ack = bit_decode('02', 9, 7)(data);
        const DriveError_Controller_OverVoltag = bit_decode('02', 10, 0)(data);
        const Controller_Undervoltage = bit_decode('02', 10, 1)(data);
        const Overcurrent_Fault = bit_decode('02', 10, 2)(data);
        // 18F20309
        const DriveStatus1_ride = bit_decode('03', 11, 0)(data);
        const Wakeup_Request = bit_decode('03', 11, 2)(data);
        const Hill_Hold = bit_decode('03', 11, 3)(data);
        const Reverse_REQUEST = bit_decode('03', 12, 0)(data);
        const Forward_parkingmode_REQUEST = bit_decode('03', 12, 1)(data);
        const Side_stand_Req = bit_decode('03', 11, 1)(data);
        // 18F20316
        const Battery_charge_logic = bit_decode('05', 16, 1)(data);
        //18F60101
        const Remote_cutoff = bit_decode('06', 2, 0)(data);
        const mode_limit = bit_decode('06', 2, 1)(data);
        const Geo_fencebuzzer = bit_decode('06', 2, 2)(data);
        const Holiday_mode = bit_decode('06', 2, 3)(data);
        const Service_request = bit_decode('06', 2, 4)(data);
        // Annmon part 3
        const Low_Mode_REQUEST = bit_decode('03', 11, 4)(data);
        const Medium_Mode_REQUEST = bit_decode('03', 11, 5)(data);
        const User_defind_mode_High_REQUEST = bit_decode('03', 11, 6)(data);
        const Limp_mode_REQUEST = bit_decode('03', 11, 7)(data);

    if (CellVol01 !== null) {
      tempStorage.current.CellVol01.push(CellVol01);
      setCellVol01(CellVol01); 
    }
    if (CellVol02 !== null) {
      tempStorage.current.CellVol02.push(CellVol02);
      setCellVol02(CellVol02);
    }
    if (CellVol03 !== null) {
      tempStorage.current.CellVol03.push(CellVol03);
      setCellVol03(CellVol03);
    }
    if (CellVol04 !== null) {
      tempStorage.current.CellVol04.push(CellVol04);
      setCellVol04(CellVol04);
    }
    if (CellVol05 !== null) {
      tempStorage.current.CellVol05.push(CellVol05);
      setCellVol05(CellVol05);
    }
    if (CellVol06 !== null) {
      tempStorage.current.CellVol06.push(CellVol06);
      setCellVol06(CellVol06);
    }
    if (CellVol07 !== null) {
      tempStorage.current.CellVol07.push(CellVol07);
      setCellVol07(CellVol07);
    }
    if (CellVol08 !== null) {
      tempStorage.current.CellVol08.push(CellVol08);
      setCellVol08(CellVol08);
    }
    if (CellVol09 !== null) {
      tempStorage.current.CellVol09.push(CellVol09);
      setCellVol09(CellVol09);
    }
    if (CellVol10 !== null) {
      tempStorage.current.CellVol10.push(CellVol10);
      setCellVol10(CellVol10);
    }
    if (CellVol11 !== null) {
      tempStorage.current.CellVol11.push(CellVol11);
      setCellVol11(CellVol11);
    }
    if (CellVol12 !== null) {
      tempStorage.current.CellVol12.push(CellVol12);
      setCellVol12(CellVol12);
    }
    if (CellVol13 !== null) {
      tempStorage.current.CellVol13.push(CellVol13);
      setCellVol13(CellVol13);
    }
    if (CellVol14 !== null) {
      tempStorage.current.CellVol14.push(CellVol14);
      setCellVol14(CellVol14);
    }
    if (CellVol15 !== null) {
      tempStorage.current.CellVol15.push(CellVol15);
      setCellVol15(CellVol15);
    }
    if (CellVol16 !== null) {
      tempStorage.current.CellVol16.push(CellVol16);
      setCellVol16(CellVol16);
    }
    if (MaxCellVol !== null) {
      tempStorage.current.MaxCellVol.push(MaxCellVol);
      setMaxCellVol(MaxCellVol);
    }
    if (MinCellVol !== null) {
      tempStorage.current.MinCellVol.push(MinCellVol);
      setMinCellVol(MinCellVol);
    }
    if (AvgCellVol !== null) {
      tempStorage.current.AvgCellVol.push(AvgCellVol);
      setAvgCellVol(AvgCellVol);
    }
    if (MaxVoltId !== null) {
      tempStorage.current.MaxVoltId.push(MaxVoltId);
      setMaxVoltId(MaxVoltId);
    }
    if (MinVoltId !== null) {
      tempStorage.current.MinVoltId.push(MinVoltId);
      setMinVoltId(MinVoltId);
    }
    if (PackVol !== null) {
      tempStorage.current.PackVol.push(PackVol);
      setPackVol(PackVol);
    }
    if (CycleCount !== null) {
      tempStorage.current.CycleCount.push(CycleCount);
      setCycleCount(CycleCount);
    }
    if (CellVolMinMaxDev !== null) {
      tempStorage.current.CellVolMinMaxDev.push(CellVolMinMaxDev);
      setCellVolMinMaxDev(CellVolMinMaxDev);
    }
    if (SOC !== null) {
      tempStorage.current.SOC.push(SOC);
      setSOC(SOC);
    }
    if (SOCAh !== null) {
      tempStorage.current.SOCAh.push(SOCAh);
      setSOCAh(SOCAh);
    }
    if (SOH !== null) {
      tempStorage.current.SOH.push(SOH);
      setSOH(SOH);
    }
    if (BmsStatus !== null) {
      tempStorage.current.BmsStatus.push(BmsStatus);
      setBmsStatus(BmsStatus);
    }
    if (LedStatus !== null) {
      tempStorage.current.LedStatus.push(LedStatus);
      setLedStatus(LedStatus);
    }
    if (ActiveCellBalStatus !== null) {
      tempStorage.current.ActiveCellBalStatus.push(ActiveCellBalStatus);
      setActiveCellBalStatus(ActiveCellBalStatus);
    }
    if (BMS_Serial_No_MUX !== null) {
      tempStorage.current.BMS_Serial_No_MUX.push(BMS_Serial_No_MUX);
      setBMS_Serial_No_MUX(BMS_Serial_No_MUX);
    }
    if (BMS_Serial_No__1_7 !== null) {
      tempStorage.current.BMS_Serial_No__1_7.push(BMS_Serial_No__1_7);
      setBMS_Serial_No__1_7(BMS_Serial_No__1_7);
    }
    if (LatchProtection !== null) {
      tempStorage.current.LatchProtection.push(LatchProtection);
      setLatchProtection(LatchProtection);
    }
    if (LatchType !== null) {
      tempStorage.current.LatchType.push(LatchType);
      setLatchType(LatchType);
    }
    if (ChargerType !== null) {
      tempStorage.current.ChargerType.push(ChargerType);
      setChargerType(ChargerType);
    }
    if (PcbTemp !== null) {
      tempStorage.current.PcbTemp.push(PcbTemp);
      setPcbTemp(PcbTemp);
    }
    if (AfeTemp !== null) {
      tempStorage.current.AfeTemp.push(AfeTemp);
      setAfeTemp(AfeTemp);
    }
    if (CellChemType !== null) {
      tempStorage.current.CellChemType.push(CellChemType);
      setCellChemType(CellChemType);
    }
    if (Chg_Accumulative_Ah !== null) {
      tempStorage.current.Chg_Accumulative_Ah.push(Chg_Accumulative_Ah);
      setChg_Accumulative_Ah(Chg_Accumulative_Ah);
    }
    if (Dchg_Accumulative_Ah !== null) {
      tempStorage.current.Dchg_Accumulative_Ah.push(Dchg_Accumulative_Ah);
      setDchg_Accumulative_Ah(Dchg_Accumulative_Ah);
    }
    if (RefVol !== null) {
      tempStorage.current.RefVol.push(RefVol);
      setRefVol(RefVol);
    }
    if (_3v3Vol !== null) {
      tempStorage.current._3v3Vol.push(_3v3Vol);
      set_3v3Vol(_3v3Vol);
    }
    if (_5vVol !== null) {
      tempStorage.current._5vVol.push(_5vVol);
      set_5vVol(_5vVol);
    }
    if (_12vVol !== null) {
      tempStorage.current._12vVol.push(_12vVol);
      set_12vVol(_12vVol);
    }
    if (Actual_SoC !== null) {
      tempStorage.current.Actual_SoC.push(Actual_SoC);
      setActual_SoC(Actual_SoC);
    }
    if (Usable_Capacity_Ah !== null) {
      tempStorage.current.Usable_Capacity_Ah.push(Usable_Capacity_Ah);
      setUsable_Capacity_Ah(Usable_Capacity_Ah);
    }
    if (ConfigVer !== null) {
      tempStorage.current.ConfigVer.push(ConfigVer);
      setConfigVer(ConfigVer);
    }
    if (InternalFWVer !== null) {
      tempStorage.current.InternalFWVer.push(InternalFWVer);
      setInternalFWVer(InternalFWVer);
    }
    if (InternalFWSubVer !== null) {
      tempStorage.current.InternalFWSubVer.push(InternalFWSubVer);
      setInternalFWSubVer(InternalFWSubVer);
    }
    if (PackCurr !== null) {
      tempStorage.current.PackCurr.push(PackCurr);
      setPackCurr(PackCurr);
    }
    if (MaxTemp !== null) {
      tempStorage.current.MaxTemp.push(MaxTemp);
      setMaxTemp(MaxTemp);
    }
    if (MinTemp !== null) {
      tempStorage.current.MinTemp.push(MinTemp);
      setMinTemp(MinTemp);
    }
    if (FetTemp !== null) {
      tempStorage.current.FetTemp.push(FetTemp);
      setFetTemp(FetTemp);
    }
    if (Temp1 !== null) {
      tempStorage.current.Temp1.push(Temp1);
      setTemp1(Temp1);
    }
    if (Temp2 !== null) {
      tempStorage.current.Temp2.push(Temp2);
      setTemp2(Temp2);
    }
    if (Temp3 !== null) {
      tempStorage.current.Temp3.push(Temp3);
      setTemp3(Temp3);
    }
    if (Temp4 !== null) {
      tempStorage.current.Temp4.push(Temp4);
      setTemp4(Temp4);
    }
    if (Temp5 !== null) {
      tempStorage.current.Temp5.push(Temp5);
      setTemp5(Temp5);
    }
    if (Temp6 !== null) {
      tempStorage.current.Temp6.push(Temp6);
      setTemp6(Temp6);
    }
    if (Temp7 !== null) {
      tempStorage.current.Temp7.push(Temp7);
      setTemp7(Temp7);
    }
    if (Temp8 !== null) {
      tempStorage.current.Temp8.push(Temp8);
      setTemp8(Temp8);
    }
    if (HwVer !== null) {
      tempStorage.current.HwVer.push(HwVer);
      setHwVer(HwVer);
    }
    if (FwVer !== null) {
      tempStorage.current.FwVer.push(FwVer);
      setFwVer(FwVer);
    }
    if (FWSubVer !== null) {
      tempStorage.current.FWSubVer.push(FWSubVer);
      setFWSubVer(FWSubVer);
    }
    if (BtStatus_NC0PSM1CC2CV3Finish4 !== null) {
      tempStorage.current.BtStatus_NC0PSM1CC2CV3Finish4.push(BtStatus_NC0PSM1CC2CV3Finish4);
      setBtStatus_NC0PSM1CC2CV3Finish4(BtStatus_NC0PSM1CC2CV3Finish4);
    }
    if (Bt_liveMsg1Temp !== null) {
      tempStorage.current.Bt_liveMsg1Temp.push(Bt_liveMsg1Temp);
      setBt_liveMsg1Temp(Bt_liveMsg1Temp);
    }
    if (Bt_liveMsg_soc !== null) {
      tempStorage.current.Bt_liveMsg_soc.push(Bt_liveMsg_soc);
      setBt_liveMsg_soc(Bt_liveMsg_soc);
    }
    if (BMS_status !== null) {
      tempStorage.current.BMS_status.push(BMS_status);
      setBMS_status(BMS_status);
    }
    if (Demand_voltage !== null) {
      tempStorage.current.Demand_voltage.push(Demand_voltage);
      setDemand_voltage(Demand_voltage);
    }
    if (Demand_Current !== null) {
      tempStorage.current.Demand_Current.push(Demand_Current);
      setDemand_Current(Demand_Current);
    }
    if (MaxChgVoltgae !== null) {
      tempStorage.current.MaxChgVoltgae.push(MaxChgVoltgae);
      setMaxChgVoltgae(MaxChgVoltgae);
    }
    if (MaxChgCurrent !== null) {
      tempStorage.current.MaxChgCurrent.push(MaxChgCurrent);
      setMaxChgCurrent(MaxChgCurrent);
    }
    if (ActualChgVoltage !== null) {
      tempStorage.current.ActualChgVoltage.push(ActualChgVoltage);
      setActualChgVoltage(ActualChgVoltage);
    }
    if (ActualChgCurrent !== null) {
      tempStorage.current.ActualChgCurrent.push(ActualChgCurrent);
      setActualChgCurrent(ActualChgCurrent);
    }
    if (Charging_end_cutoff_Curr !== null) {
      tempStorage.current.Charging_end_cutoff_Curr.push(Charging_end_cutoff_Curr);
      setCharging_end_cutoff_Curr(Charging_end_cutoff_Curr);
    }
    if (CHB_258 !== null) {
      tempStorage.current.CHB_258.push(CHB_258);
      setCHB_258(CHB_258);
    }
    if (ChgrNC0PSM1CC2CV3Finsh4 !== null) {
      tempStorage.current.ChgrNC0PSM1CC2CV3Finsh4.push(ChgrNC0PSM1CC2CV3Finsh4);
      setChgrNC0PSM1CC2CV3Finsh4(ChgrNC0PSM1CC2CV3Finsh4);
    }
    if (chgr_msg_temp !== null) {
      tempStorage.current.chgr_msg_temp.push(chgr_msg_temp);
      setchgr_msg_temp(chgr_msg_temp);
    }
    if (chgStatus_chg_idle !== null) {
      tempStorage.current.chgStatus_chg_idle.push(chgStatus_chg_idle);
      setchgStatus_chg_idle(chgStatus_chg_idle);
    }
    if (chgrLiveMsgChgVolt !== null) {
      tempStorage.current.chgrLiveMsgChgVolt.push(chgrLiveMsgChgVolt);
      setchgrLiveMsgChgVolt(chgrLiveMsgChgVolt);
    }
    if (chgrLiveMsgChgCurrent !== null) {
      tempStorage.current.chgrLiveMsgChgCurrent.push(chgrLiveMsgChgCurrent);
      setchgrLiveMsgChgCurrent(chgrLiveMsgChgCurrent);
    }
    if (MotorSpeed !== null) {
      tempStorage.current.MotorSpeed.push(MotorSpeed);
      setMotorSpeed(MotorSpeed);
    }
    if (BatteryVoltage !== null) {
      tempStorage.current.BatteryVoltage.push(BatteryVoltage);
      setBatteryVoltage(BatteryVoltage);
    }
    if (BatteryCurrent !== null) {
      tempStorage.current.BatteryCurrent.push(BatteryCurrent);
      setBatteryCurrent(BatteryCurrent);
    }
    if (AC_Current !== null) {
      tempStorage.current.AC_Current.push(AC_Current);
      setAC_Current(AC_Current);
    }
    if (AC_Voltage !== null) {
      tempStorage.current.AC_Voltage.push(AC_Voltage);
      setAC_Voltage(AC_Voltage);
    }
    if (Throttle !== null) {
      tempStorage.current.Throttle.push(Throttle);
      setThrottle(Throttle);
    }
    if (MCU_Temperature !== null) {
      tempStorage.current.MCU_Temperature.push(MCU_Temperature);
      setMCU_Temperature(MCU_Temperature);
    }
    if (Motor_Temperature !== null) {
      tempStorage.current.Motor_Temperature.push(Motor_Temperature);
      setMotor_Temperature(Motor_Temperature);
    }
    if (MCU_Fault_Code !== null) {
      tempStorage.current.MCU_Fault_Code.push(MCU_Fault_Code);
      setMCU_Fault_Code(MCU_Fault_Code);
    }
    if (MCU_ID !== null) {
      tempStorage.current.MCU_ID.push(MCU_ID);
      setMCU_ID(MCU_ID);
    }
    if (Cluster_heartbeat !== null) {
      tempStorage.current.Cluster_heartbeat.push(Cluster_heartbeat);
      setCluster_heartbeat(Cluster_heartbeat);
    }
    if (Odo_Cluster !== null) {
      tempStorage.current.Odo_Cluster.push(Odo_Cluster);
      setOdo_Cluster(Odo_Cluster);
    }
    if (IgnitionStatus !== null) {
      tempStorage.current.IgnitionStatus.push(IgnitionStatus);
      setIgnitionStatus(IgnitionStatus);
    }
    if (LoadDetection !== null) {
      tempStorage.current.LoadDetection.push(LoadDetection);
      setLoadDetection(LoadDetection);
    }
    if (Keystatus !== null) {
      tempStorage.current.Keystatus.push(Keystatus);
      setKeystatus(Keystatus);
    }
    if (keyevents !== null) {
      tempStorage.current.keyevents.push(keyevents);
      setkeyevents(keyevents);
    }
    if (CellUnderVolProt !== null) {
      tempStorage.current.CellUnderVolProt.push(CellUnderVolProt);
      setCellUnderVolProt(CellUnderVolProt);
    }
    if (CellOverVolProt !== null) {
      tempStorage.current.CellOverVolProt.push(CellOverVolProt);
      setCellOverVolProt(CellOverVolProt);
    }
    if (PackUnderVolProt !== null) {
      tempStorage.current.PackUnderVolProt.push(PackUnderVolProt);
      setPackUnderVolProt(PackUnderVolProt);
    }
    if (PackOverVolProt !== null) {
      tempStorage.current.PackOverVolProt.push(PackOverVolProt);
      setPackOverVolProt(PackOverVolProt);
    }
    if (ChgUnderTempProt !== null) {
      tempStorage.current.ChgUnderTempProt.push(ChgUnderTempProt);
      setChgUnderTempProt(ChgUnderTempProt);
    }
    if (ChgOverTempProt !== null) {
      tempStorage.current.ChgOverTempProt.push(ChgOverTempProt);
      setChgOverTempProt(ChgOverTempProt);
    }
    if (DchgUnderTempProt !== null) {
      tempStorage.current.DchgUnderTempProt.push(DchgUnderTempProt);
      setDchgUnderTempProt(DchgUnderTempProt);
    }
    if (DchgOverTempProt !== null) {
      tempStorage.current.DchgOverTempProt.push(DchgOverTempProt);
      setDchgOverTempProt(DchgOverTempProt);
    }
    if (CellOverDevProt !== null) {
      tempStorage.current.CellOverDevProt.push(CellOverDevProt);
      setCellOverDevProt(CellOverDevProt);
    }
    if (BattLowSocWarn !== null) {
      tempStorage.current.BattLowSocWarn.push(BattLowSocWarn);
      setBattLowSocWarn(BattLowSocWarn);
    }
    if (ChgOverCurrProt !== null) {
      tempStorage.current.ChgOverCurrProt.push(ChgOverCurrProt);
      setChgOverCurrProt(ChgOverCurrProt);
    }
    if (DchgOverCurrProt !== null) {
      tempStorage.current.DchgOverCurrProt.push(DchgOverCurrProt);
      setDchgOverCurrProt(DchgOverCurrProt);
    }
    if (CellUnderVolWarn !== null) {
      tempStorage.current.CellUnderVolWarn.push(CellUnderVolWarn);
      setCellUnderVolWarn(CellUnderVolWarn);
    }
    if (CellOverVolWarn !== null) {
      tempStorage.current.CellOverVolWarn.push(CellOverVolWarn);
      setCellOverVolWarn(CellOverVolWarn);
    }
    if (FetTempProt !== null) {
      tempStorage.current.FetTempProt.push(FetTempProt);
      setFetTempProt(FetTempProt);
    }
    if (ResSocProt !== null) {
      tempStorage.current.ResSocProt.push(ResSocProt);
      setResSocProt(ResSocProt);
    }
    if (FetFailure !== null) {
      tempStorage.current.FetFailure.push(FetFailure);
      setFetFailure(FetFailure);
    }
    if (TempSenseFault !== null) {
      tempStorage.current.TempSenseFault.push(TempSenseFault);
      setTempSenseFault(TempSenseFault);
    }
    if (PackUnderVolWarn !== null) {
      tempStorage.current.PackUnderVolWarn.push(PackUnderVolWarn);
      setPackUnderVolWarn(PackUnderVolWarn);
    }
    if (PackOverVolWarn !== null) {
      tempStorage.current.PackOverVolWarn.push(PackOverVolWarn);
      setPackOverVolWarn(PackOverVolWarn);
    }
    if (ChgUnderTempWarn !== null) {
      tempStorage.current.ChgUnderTempWarn.push(ChgUnderTempWarn);
      setChgUnderTempWarn(ChgUnderTempWarn);
    }
    if (ChgOverTempWarn !== null) {
      tempStorage.current.ChgOverTempWarn.push(ChgOverTempWarn);
      setChgOverTempWarn(ChgOverTempWarn);
    }
    if (DchgUnderTempWarn !== null) {
      tempStorage.current.DchgUnderTempWarn.push(DchgUnderTempWarn);
      setDchgUnderTempWarn(DchgUnderTempWarn);
    }
    if (DchgOverTempWarn !== null) {
      tempStorage.current.DchgOverTempWarn.push(DchgOverTempWarn);
      setDchgOverTempWarn(DchgOverTempWarn);
    }
    if (PreChgFetStatus !== null) {
      tempStorage.current.PreChgFetStatus.push(PreChgFetStatus);
      setPreChgFetStatus(PreChgFetStatus);
    }
    if (ChgFetStatus !== null) {
      tempStorage.current.ChgFetStatus.push(ChgFetStatus);
      setChgFetStatus(ChgFetStatus);
    }
    if (DchgFetStatus !== null) {
      tempStorage.current.DchgFetStatus.push(DchgFetStatus);
      setDchgFetStatus(DchgFetStatus);
    }
    if (ResStatus !== null) {
      tempStorage.current.ResStatus.push(ResStatus);
      setResStatus(ResStatus);
    }
    if (ShortCktProt !== null) {
      tempStorage.current.ShortCktProt.push(ShortCktProt);
      setShortCktProt(ShortCktProt);
    }
    if (DschgPeakProt !== null) {
      tempStorage.current.DschgPeakProt.push(DschgPeakProt);
      setDschgPeakProt(DschgPeakProt);
    }
    if (ChgAuth !== null) {
      tempStorage.current.ChgAuth.push(ChgAuth);
      setChgAuth(ChgAuth);
    }
    if (ChgPeakProt !== null) {
      tempStorage.current.ChgPeakProt.push(ChgPeakProt);
      setChgPeakProt(ChgPeakProt);
    }
    if (DI1 !== null) {
      tempStorage.current.DI1.push(DI1);
      setDI1(DI1);
    }
    if (DI2 !== null) {
      tempStorage.current.DI2.push(DI2);
      setDI2(DI2);
    }
    if (DO1 !== null) {
      tempStorage.current.DO1.push(DO1);
      setDO1(DO1);
    }
    if (DO2 !== null) {
      tempStorage.current.DO2.push(DO2);
      setDO2(DO2);
    }
    if (ChargerDetection !== null) {
      tempStorage.current.ChargerDetection.push(ChargerDetection);
      setChargerDetection(ChargerDetection);
    }
    if (CanCommDetection !== null) {
      tempStorage.current.CanCommDetection.push(CanCommDetection);
      setCanCommDetection(CanCommDetection);
    }
    if (CellBalFeatureStatus !== null) {
      tempStorage.current.CellBalFeatureStatus.push(CellBalFeatureStatus);
      setCellBalFeatureStatus(CellBalFeatureStatus);
    }
    if (ImmoChg !== null) {
      tempStorage.current.ImmoChg.push(ImmoChg);
      setImmoChg(ImmoChg);
    }
    if (ImmoDchg !== null) {
      tempStorage.current.ImmoDchg.push(ImmoDchg);
      setImmoDchg(ImmoDchg);
    }
    if (BuzzerStatus !== null) {
      tempStorage.current.BuzzerStatus.push(BuzzerStatus);
      setBuzzerStatus(BuzzerStatus);
    }
    if (Side_Stand_Ack !== null) {
      tempStorage.current.Side_Stand_Ack.push(Side_Stand_Ack);
      setSide_Stand_Ack(Side_Stand_Ack);
    }
    if (Direction_Ack !== null) {
      tempStorage.current.Direction_Ack.push(Direction_Ack);
      setDirection_Ack(Direction_Ack);
    }
    if (Ride_Ack !== null) {
      tempStorage.current.Ride_Ack.push(Ride_Ack);
      setRide_Ack(Ride_Ack);
    }
    if (Hill_hold_Ack !== null) {
      tempStorage.current.Hill_hold_Ack.push(Hill_hold_Ack);
      setHill_hold_Ack(Hill_hold_Ack);
    }
    if (Wakeup_Ack !== null) {
      tempStorage.current.Wakeup_Ack.push(Wakeup_Ack);
      setWakeup_Ack(Wakeup_Ack);
    }
    if (DriveError_Motor_hall !== null) {
      tempStorage.current.DriveError_Motor_hall.push(DriveError_Motor_hall);
      setDriveError_Motor_hall(DriveError_Motor_hall);
    }
    if (Motor_Stalling !== null) {
      tempStorage.current.Motor_Stalling.push(Motor_Stalling);
      setMotor_Stalling(Motor_Stalling);
    }
    if (Motor_Phase_loss !== null) {
      tempStorage.current.Motor_Phase_loss.push(Motor_Phase_loss);
      setMotor_Phase_loss(Motor_Phase_loss);
    }
    if (Controller_Over_Temeprature !== null) {
      tempStorage.current.Controller_Over_Temeprature.push(Controller_Over_Temeprature); // CHECK LATER
      setController_Over_Temeprature(Controller_Over_Temeprature);
    }
    if (Motor_Over_Temeprature !== null) {
      tempStorage.current.Motor_Over_Temeprature.push(Motor_Over_Temeprature);
      setMotor_Over_Temeprature(Motor_Over_Temeprature);
    }
    if (Throttle_Error !== null) {
      tempStorage.current.Throttle_Error.push(Throttle_Error);
      setThrottle_Error(Throttle_Error);
    }
    if (MOSFET_Protection !== null) {
      tempStorage.current.MOSFET_Protection.push(MOSFET_Protection);
      setMOSFET_Protection(MOSFET_Protection);
    }
    if (DriveStatus_Regenerative_Braking !== null) {
      tempStorage.current.DriveStatus_Regenerative_Braking.push(DriveStatus_Regenerative_Braking);
      setDriveStatus_Regenerative_Braking(DriveStatus_Regenerative_Braking);
    }
    if (ModeR_Pulse !== null) {
      tempStorage.current.ModeR_Pulse.push(ModeR_Pulse);
      setModeR_Pulse(ModeR_Pulse);
    }
    if (ModeL_Pulse !== null) {
      tempStorage.current.ModeL_Pulse.push(ModeL_Pulse);
      setModeL_Pulse(ModeL_Pulse);
    }
    if (Brake_Pulse !== null) {
      tempStorage.current.Brake_Pulse.push(Brake_Pulse);
      setBrake_Pulse(Brake_Pulse);
    }
    if (Park_Pulse !== null) {
      tempStorage.current.Park_Pulse.push(Park_Pulse);
      setPark_Pulse(Park_Pulse);
    }
    if (Reverse_Pulse !== null) {
      tempStorage.current.Reverse_Pulse.push(Reverse_Pulse);
      setReverse_Pulse(Reverse_Pulse);
    }
    if (SideStand_Pulse !== null) {
      tempStorage.current.SideStand_Pulse.push(SideStand_Pulse);
      setSideStand_Pulse(SideStand_Pulse);
    }
    if (ForwardParking_Mode_Ack !== null) {
      tempStorage.current.ForwardParking_Mode_Ack.push(ForwardParking_Mode_Ack);
      setForwardParking_Mode_Ack(ForwardParking_Mode_Ack);
    }
    if (DriveError_Controller_OverVoltag !== null) {
      tempStorage.current.DriveError_Controller_OverVoltag.push(DriveError_Controller_OverVoltag);
      setDriveError_Controller_OverVoltag(DriveError_Controller_OverVoltag);
    }
    if (Controller_Undervoltage !== null) {
      tempStorage.current.Controller_Undervoltage.push(Controller_Undervoltage);
      setController_Undervoltage(Controller_Undervoltage);
    }
    if (Overcurrent_Fault !== null) {
      tempStorage.current.Overcurrent_Fault.push(Overcurrent_Fault);
      setOvercurrent_Fault(Overcurrent_Fault);
    }
    if (DriveStatus1_ride !== null) {
      tempStorage.current.DriveStatus1_ride.push(DriveStatus1_ride);
      setDriveStatus1_ride(DriveStatus1_ride);
    }
    if (Wakeup_Request !== null) {
      tempStorage.current.Wakeup_Request.push(Wakeup_Request);
      setWakeup_Request(Wakeup_Request);
    }
    if (Hill_Hold !== null) {
      tempStorage.current.Hill_Hold.push(Hill_Hold);
      setHill_Hold(Hill_Hold);
    }
    if (Reverse_REQUEST !== null) {
      tempStorage.current.Reverse_REQUEST.push(Reverse_REQUEST);
      setReverse_REQUEST(Reverse_REQUEST);
    }
    if (Forward_parkingmode_REQUEST !== null) {
      tempStorage.current.Forward_parkingmode_REQUEST.push(Forward_parkingmode_REQUEST);
      setForward_parkingmode_REQUEST(Forward_parkingmode_REQUEST);
    }
    if (Side_stand_Req !== null) {
      tempStorage.current.Side_stand_Req.push(Side_stand_Req);
      setSide_stand_Req(Side_stand_Req);
    }
    if (Battery_charge_logic !== null) {
      tempStorage.current.Battery_charge_logic.push(Battery_charge_logic);
      setBattery_charge_logic(Battery_charge_logic);
    }
    if (Remote_cutoff !== null) {
      tempStorage.current.Remote_cutoff.push(Remote_cutoff);
      setRemote_cutoff(Remote_cutoff);
    }
    if (mode_limit !== null) {
      tempStorage.current.mode_limit.push(mode_limit);
      setmode_limit(mode_limit);
    }
    if (Geo_fencebuzzer !== null) {
      tempStorage.current.Geo_fencebuzzer.push(Geo_fencebuzzer);
      setGeo_fencebuzzer(Geo_fencebuzzer);
    }
    if (Holiday_mode !== null) {
      tempStorage.current.Holiday_mode.push(Holiday_mode);
      setHoliday_mode(Holiday_mode);
    }
    if (Service_request !== null) {
      tempStorage.current.Service_request.push(Service_request);
      setService_request(Service_request);
    }
    if (Low_Mode_REQUEST !== null) {
      tempStorage.current.Low_Mode_REQUEST.push(Low_Mode_REQUEST);
      setLow_Mode_REQUEST(Low_Mode_REQUEST);
    }
    if (Medium_Mode_REQUEST !== null) {
      tempStorage.current.Medium_Mode_REQUEST.push(Medium_Mode_REQUEST);
      setMedium_Mode_REQUEST(Medium_Mode_REQUEST);
    }
    if (User_defind_mode_High_REQUEST !== null) {
      tempStorage.current.User_defind_mode_High_REQUEST.push(User_defind_mode_High_REQUEST);
      setUser_defind_mode_High_REQUEST(User_defind_mode_High_REQUEST);
    }
    if (Limp_mode_REQUEST !== null) {
      tempStorage.current.Limp_mode_REQUEST.push(Limp_mode_REQUEST);
      setLimp_mode_REQUEST(Limp_mode_REQUEST);
    }
    if (ChargeSOP !== null) {
      tempStorage.current.ChargeSOP.push(ChargeSOP);
      setChargeSOP(ChargeSOP);
    }
    if (DchgSOP !== null) {
      tempStorage.current.DchgSOP.push(DchgSOP);
      setDchgSOP(DchgSOP);
    }
    if (Drive_Error_Flag !== null) {
      tempStorage.current.Drive_Error_Flag.push(Drive_Error_Flag);
      setDrive_Error_Flag(Drive_Error_Flag);
    }
    if (Set_Regen !== null) {
      tempStorage.current.Set_Regen.push(Set_Regen);
      setSet_Regen(Set_Regen);
    }
    if (DCcurrentlimit !== null) {
      tempStorage.current.DCcurrentlimit.push(DCcurrentlimit);
      setDCcurrentlimit(DCcurrentlimit);
    }
    if (Custom_freq !== null) {
      tempStorage.current.Custom_freq.push(Custom_freq);
      setCustom_freq(Custom_freq);
    }
    if (Custom_torque !== null) {
      tempStorage.current.Custom_torque.push(Custom_torque);
      setCustom_torque(Custom_torque);
    }
    if (Buffer_speed !== null) {
      tempStorage.current.Buffer_speed.push(Buffer_speed);
      setBuffer_speed(Buffer_speed);
    }
    if (Base_speed !== null) {
      tempStorage.current.Base_speed.push(Base_speed);
      setBase_speed(Base_speed);
    }
    if (Initial_torque !== null) {
      tempStorage.current.Initial_torque.push(Initial_torque);
      setInitial_torque(Initial_torque);
    }
    if (Final_torque !== null) {
      tempStorage.current.Final_torque.push(Final_torque);
      setFinal_torque(Final_torque);
    }
    if (Cluster_odo !== null) {
      tempStorage.current.Cluster_odo.push(Cluster_odo);
      setCluster_odo(Cluster_odo);
    }
    if (Mode_Ack !== null) {
      tempStorage.current.Mode_Ack.push(Mode_Ack);
      setMode_Ack(Mode_Ack); 
    }

    if (packetNumberHex === '01' && tempStorage.current.isFirstCycle) {
      tempStorage.current.firstLocalTime = LocalTime;
    }

    if (packetNumberHex === '20') {
      tempStorage.current.CellVol01.forEach((CellVol01, index) => {
        const CellVol02 = tempStorage.current.CellVol02[index] ?? "N/A";
        const CellVol03 = tempStorage.current.CellVol03[index] ?? "N/A";
        const CellVol04 = tempStorage.current.CellVol04[index] ?? "N/A";
        const CellVol05 = tempStorage.current.CellVol05[index] ?? "N/A";
        const CellVol06 = tempStorage.current.CellVol06[index] ?? "N/A";
        const CellVol07 = tempStorage.current.CellVol07[index] ?? "N/A";
        const CellVol08 = tempStorage.current.CellVol08[index] ?? "N/A";
        const CellVol09 = tempStorage.current.CellVol09[index] ?? "N/A";
        const CellVol10 = tempStorage.current.CellVol10[index] ?? "N/A";
        const CellVol11 = tempStorage.current.CellVol11[index] ?? "N/A";
        const CellVol12 = tempStorage.current.CellVol12[index] ?? "N/A";
        const CellVol13 = tempStorage.current.CellVol13[index] ?? "N/A";
        const CellVol14 = tempStorage.current.CellVol14[index] ?? "N/A";
        const CellVol15 = tempStorage.current.CellVol15[index] ?? "N/A";
        const CellVol16 = tempStorage.current.CellVol16[index] ?? "N/A";

        const MaxCellVol = tempStorage.current.MaxCellVol[index] ?? "N/A";
        const MinCellVol = tempStorage.current.MinCellVol[index] ?? "N/A";
        const AvgCellVol = tempStorage.current.AvgCellVol[index] ?? "N/A";
        const MaxVoltId = tempStorage.current.MaxVoltId[index] ?? "N/A";
        const MinVoltId = tempStorage.current.MinVoltId[index] ?? "N/A";
        const PackVol = tempStorage.current.PackVol[index] ?? "N/A";
        const CycleCount = tempStorage.current.CycleCount[index] ?? "N/A";
        const CellVolMinMaxDev = tempStorage.current.CellVolMinMaxDev[index] ?? "N/A";
        const SOC = tempStorage.current.SOC[index] ?? "N/A";
        const SOCAh = tempStorage.current.SOCAh[index] ?? "N/A";
        const SOH = tempStorage.current.SOH[index] ?? "N/A";
        const BmsStatus = tempStorage.current.BmsStatus[index] ?? "N/A";
        const LedStatus = tempStorage.current.LedStatus[index] ?? "N/A";
        const ActiveCellBalStatus = tempStorage.current.ActiveCellBalStatus[index] ?? "N/A";
        const BMS_Serial_No_MUX = tempStorage.current.BMS_Serial_No_MUX[index] ?? "N/A";
        const BMS_Serial_No__1_7 = tempStorage.current.BMS_Serial_No__1_7[index] ?? "N/A";
        const LatchProtection = tempStorage.current.LatchProtection[index] ?? "N/A";
        const LatchType = tempStorage.current.LatchType[index] ?? "N/A";
        const ChargerType = tempStorage.current.ChargerType[index] ?? "N/A";
        const PcbTemp = tempStorage.current.PcbTemp[index] ?? "N/A";
        const AfeTemp = tempStorage.current.AfeTemp[index] ?? "N/A";
        const CellChemType = tempStorage.current.CellChemType[index] ?? "N/A";
        const Chg_Accumulative_Ah = tempStorage.current.Chg_Accumulative_Ah[index] ?? "N/A";
        const Dchg_Accumulative_Ah = tempStorage.current.Dchg_Accumulative_Ah[index] ?? "N/A";
        const RefVol = tempStorage.current.RefVol[index] ?? "N/A";
        const _3v3Vol = tempStorage.current._3v3Vol[index] ?? "N/A";
        const _5vVol = tempStorage.current._5vVol[index] ?? "N/A";
        const _12vVol = tempStorage.current._12vVol[index] ?? "N/A";
        const Actual_SoC = tempStorage.current.Actual_SoC[index] ?? "N/A";
        const Usable_Capacity_Ah = tempStorage.current.Usable_Capacity_Ah[index] ?? "N/A";
        const ConfigVer = tempStorage.current.ConfigVer[index] ?? "N/A";
        const InternalFWVer = tempStorage.current.InternalFWVer[index] ?? "N/A";
        const InternalFWSubVer = tempStorage.current.InternalFWSubVer[index] ?? "N/A";
        const BHB_66049 = tempStorage.current.BHB_66049[index] ?? "N/A";
        const PackCurr = tempStorage.current.PackCurr[index] ?? "N/A";
        const MaxTemp = tempStorage.current.MaxTemp[index] ?? "N/A";
        const MinTemp = tempStorage.current.MinTemp[index] ?? "N/A";
        const FetTemp = tempStorage.current.FetTemp[index] ?? "N/A";
        const Temp1 = tempStorage.current.Temp1[index] ?? "N/A";
        const Temp2 = tempStorage.current.Temp2[index] ?? "N/A";
        const Temp3 = tempStorage.current.Temp3[index] ?? "N/A";
        const Temp4 = tempStorage.current.Temp4[index] ?? "N/A";
        const Temp5 = tempStorage.current.Temp5[index] ?? "N/A";
        const Temp6 = tempStorage.current.Temp6[index] ?? "N/A";
        const Temp7 = tempStorage.current.Temp7[index] ?? "N/A";
        const Temp8 = tempStorage.current.Temp8[index] ?? "N/A";
        const HwVer = tempStorage.current.HwVer[index] ?? "N/A";
        const FwVer = tempStorage.current.FwVer[index] ?? "N/A";
        const FWSubVer = tempStorage.current.FWSubVer[index] ?? "N/A";
        const BtStatus_NC0PSM1CC2CV3Finish4 = tempStorage.current.BtStatus_NC0PSM1CC2CV3Finish4[index] ?? "N/A";
        const Bt_liveMsg1Temp = tempStorage.current.Bt_liveMsg1Temp[index] ?? "N/A";
        const Bt_liveMsg_soc = tempStorage.current.Bt_liveMsg_soc[index] ?? "N/A";
        const BMS_status = tempStorage.current.BMS_status[index] ?? "N/A";
        const Demand_voltage = tempStorage.current.Demand_voltage[index] ?? "N/A";
        const Demand_Current = tempStorage.current.Demand_Current[index] ?? "N/A";
        const MaxChgVoltgae = tempStorage.current.MaxChgVoltgae[index] ?? "N/A";
        const MaxChgCurrent = tempStorage.current.MaxChgCurrent[index] ?? "N/A";
        const ActualChgVoltage = tempStorage.current.ActualChgVoltage[index] ?? "N/A";
        const ActualChgCurrent = tempStorage.current.ActualChgCurrent[index] ?? "N/A";
        const Charging_end_cutoff_Curr = tempStorage.current.Charging_end_cutoff_Curr[index] ?? "N/A";
        const CHB_258 = tempStorage.current.CHB_258[index] ?? "N/A";
        const ChgrNC0PSM1CC2CV3Finsh4 = tempStorage.current.ChgrNC0PSM1CC2CV3Finsh4[index] ?? "N/A";
        const chgr_msg_temp = tempStorage.current.chgr_msg_temp[index] ?? "N/A";
        const chgStatus_chg_idle = tempStorage.current.chgStatus_chg_idle[index] ?? "N/A";
        const chgrLiveMsgChgVolt = tempStorage.current.chgrLiveMsgChgVolt[index] ?? "N/A";
        const chgrLiveMsgChgCurrent = tempStorage.current.chgrLiveMsgChgCurrent[index] ?? "N/A";
        const MotorSpeed = tempStorage.current.MotorSpeed[index] ?? "N/A";
        const BatteryVoltage = tempStorage.current.BatteryVoltage[index] ?? "N/A";
        const BatteryCurrent = tempStorage.current.BatteryCurrent[index] ?? "N/A";
        const AC_Current = tempStorage.current.AC_Current[index] ?? "N/A";
        const AC_Voltage = tempStorage.current.AC_Voltage[index] ?? "N/A";
        const Throttle = tempStorage.current.Throttle[index] ?? "N/A";
        const MCU_Temperature = tempStorage.current.MCU_Temperature[index] ?? "N/A";
        const Motor_Temperature = tempStorage.current.Motor_Temperature[index] ?? "N/A";
        const MCU_Fault_Code = tempStorage.current.MCU_Fault_Code[index] ?? "N/A";
        const MCU_ID = tempStorage.current.MCU_ID[index] ?? "N/A";
        const Cluster_heartbeat = tempStorage.current.Cluster_heartbeat[index] ?? "N/A";
        const Odo_Cluster = tempStorage.current.Odo_Cluster[index] ?? "N/A";
        const IgnitionStatus = tempStorage.current.IgnitionStatus[index] ?? "N/A";
        const LoadDetection = tempStorage.current.LoadDetection[index] ?? "N/A";
        const Keystatus = tempStorage.current.Keystatus[index] ?? "N/A";
        const keyevents = tempStorage.current.keyevents[index] ?? "N/A";
        const CellUnderVolProt = tempStorage.current.CellUnderVolProt[index] ?? "N/A";
        const CellOverVolProt = tempStorage.current.CellOverVolProt[index] ?? "N/A";
        const PackUnderVolProt = tempStorage.current.PackUnderVolProt[index] ?? "N/A";
        const PackOverVolProt = tempStorage.current.PackOverVolProt[index] ?? "N/A";
        const ChgUnderTempProt = tempStorage.current.ChgUnderTempProt[index] ?? "N/A";
        const ChgOverTempProt = tempStorage.current.ChgOverTempProt[index] ?? "N/A";
        const DchgUnderTempProt = tempStorage.current.DchgUnderTempProt[index] ?? "N/A";
        const DchgOverTempProt = tempStorage.current.DchgOverTempProt[index] ?? "N/A";
        const CellOverDevProt = tempStorage.current.CellOverDevProt[index] ?? "N/A";
        const BattLowSocWarn = tempStorage.current.BattLowSocWarn[index] ?? "N/A";
        const ChgOverCurrProt = tempStorage.current.ChgOverCurrProt[index] ?? "N/A";
        const DchgOverCurrProt = tempStorage.current.DchgOverCurrProt[index] ?? "N/A";
        const CellUnderVolWarn = tempStorage.current.CellUnderVolWarn[index] ?? "N/A";
        const CellOverVolWarn = tempStorage.current.CellOverVolWarn[index] ?? "N/A";
        const FetTempProt = tempStorage.current.FetTempProt[index] ?? "N/A";
        const ResSocProt = tempStorage.current.ResSocProt[index] ?? "N/A";
        const FetFailure = tempStorage.current.FetFailure[index] ?? "N/A";
        const TempSenseFault = tempStorage.current.TempSenseFault[index] ?? "N/A";
        const PackUnderVolWarn = tempStorage.current.PackUnderVolWarn[index] ?? "N/A";
        const PackOverVolWarn = tempStorage.current.PackOverVolWarn[index] ?? "N/A";
        const ChgUnderTempWarn = tempStorage.current.ChgUnderTempWarn[index] ?? "N/A";
        const ChgOverTempWarn = tempStorage.current.ChgOverTempWarn[index] ?? "N/A";
        const DchgUnderTempWarn = tempStorage.current.DchgUnderTempWarn[index] ?? "N/A";
        const DchgOverTempWarn = tempStorage.current.DchgOverTempWarn[index] ?? "N/A";
        const PreChgFetStatus = tempStorage.current.PreChgFetStatus[index] ?? "N/A";
        const ChgFetStatus = tempStorage.current.ChgFetStatus[index] ?? "N/A";
        const DchgFetStatus = tempStorage.current.DchgFetStatus[index] ?? "N/A";
        const ResStatus = tempStorage.current.ResStatus[index] ?? "N/A";
        const ShortCktProt = tempStorage.current.ShortCktProt[index] ?? "N/A";
        const DschgPeakProt = tempStorage.current.DschgPeakProt[index] ?? "N/A";
        const ChgAuth = tempStorage.current.ChgAuth[index] ?? "N/A";
        const ChgPeakProt = tempStorage.current.ChgPeakProt[index] ?? "N/A";
        const DI1 = tempStorage.current.DI1[index] ?? "N/A";
        const DI2 = tempStorage.current.DI2[index] ?? "N/A";
        const DO1 = tempStorage.current.DO1[index] ?? "N/A";
        const DO2 = tempStorage.current.DO2[index] ?? "N/A";
        const ChargerDetection = tempStorage.current.ChargerDetection[index] ?? "N/A";
        const CanCommDetection = tempStorage.current.CanCommDetection[index] ?? "N/A";
        const CellBalFeatureStatus = tempStorage.current.CellBalFeatureStatus[index] ?? "N/A";
        const ImmoChg = tempStorage.current.ImmoChg[index] ?? "N/A";
        const ImmoDchg = tempStorage.current.ImmoDchg[index] ?? "N/A";
        const BuzzerStatus = tempStorage.current.BuzzerStatus[index] ?? "N/A";
        const Side_Stand_Ack = tempStorage.current.Side_Stand_Ack[index] ?? "N/A";
        const Direction_Ack = tempStorage.current.Direction_Ack[index] ?? "N/A";
        const Ride_Ack = tempStorage.current.Ride_Ack[index] ?? "N/A";
        const Hill_hold_Ack = tempStorage.current.Hill_hold_Ack[index] ?? "N/A";
        const Wakeup_Ack = tempStorage.current.Wakeup_Ack[index] ?? "N/A";
        const DriveError_Motor_hall = tempStorage.current.DriveError_Motor_hall[index] ?? "N/A";
        const Motor_Stalling = tempStorage.current.Motor_Stalling[index] ?? "N/A";
        const Motor_Phase_loss = tempStorage.current.Motor_Phase_loss[index] ?? "N/A";
        const Controller_Over_Temeprature = tempStorage.current.Controller_Over_Temeprature[index] ?? "N/A";
        const Motor_Over_Temeprature = tempStorage.current.Motor_Over_Temeprature[index] ?? "N/A";
        const Throttle_Error = tempStorage.current.Throttle_Error[index] ?? "N/A";
        const MOSFET_Protection = tempStorage.current.MOSFET_Protection[index] ?? "N/A";
        const DriveStatus_Regenerative_Braking = tempStorage.current.DriveStatus_Regenerative_Braking[index] ?? "N/A";
        const ModeR_Pulse = tempStorage.current.ModeR_Pulse[index] ?? "N/A";
        const ModeL_Pulse = tempStorage.current.ModeL_Pulse[index] ?? "N/A";
        const Brake_Pulse = tempStorage.current.Brake_Pulse[index] ?? "N/A";
        const Park_Pulse = tempStorage.current.Park_Pulse[index] ?? "N/A";
        const Reverse_Pulse = tempStorage.current.Reverse_Pulse[index] ?? "N/A";
        const SideStand_Pulse = tempStorage.current.SideStand_Pulse[index] ?? "N/A";
        const ForwardParking_Mode_Ack = tempStorage.current.ForwardParking_Mode_Ack[index] ?? "N/A";
        const DriveError_Controller_OverVoltag = tempStorage.current.DriveError_Controller_OverVoltag[index] ?? "N/A";
        const Controller_Undervoltage = tempStorage.current.Controller_Undervoltage[index] ?? "N/A";
        const Overcurrent_Fault = tempStorage.current.Overcurrent_Fault[index] ?? "N/A";
        const DriveStatus1_ride = tempStorage.current.DriveStatus1_ride[index] ?? "N/A";
        const Wakeup_Request = tempStorage.current.Wakeup_Request[index] ?? "N/A";
        const Hill_Hold = tempStorage.current.Hill_Hold[index] ?? "N/A";
        const Reverse_REQUEST = tempStorage.current.Reverse_REQUEST[index] ?? "N/A";
        const Forward_parkingmode_REQUEST = tempStorage.current.Forward_parkingmode_REQUEST[index] ?? "N/A";
        const Side_stand_Req = tempStorage.current.Side_stand_Req[index] ?? "N/A";
        const Battery_charge_logic = tempStorage.current.Battery_charge_logic[index] ?? "N/A";
        const Remote_cutoff = tempStorage.current.Remote_cutoff[index] ?? "N/A";
        const mode_limit = tempStorage.current.mode_limit[index] ?? "N/A";
        const Geo_fencebuzzer = tempStorage.current.Geo_fencebuzzer[index] ?? "N/A";
        const Holiday_mode = tempStorage.current.Holiday_mode[index] ?? "N/A";
        const Service_request = tempStorage.current.Service_request[index] ?? "N/A";
        const Low_Mode_REQUEST = tempStorage.current.Low_Mode_REQUEST[index] ?? "N/A";
        const Medium_Mode_REQUEST = tempStorage.current.Medium_Mode_REQUEST[index] ?? "N/A";
        const User_defind_mode_High_REQUEST = tempStorage.current.User_defind_mode_High_REQUEST[index] ?? "N/A";
        const Limp_mode_REQUEST = tempStorage.current.Limp_mode_REQUEST[index] ?? "N/A";
        const ChargeSOP = tempStorage.current.ChargeSOP[index] ?? "N/A";
        const DchgSOP = tempStorage.current.DchgSOP[index] ?? "N/A";
        const Drive_Error_Flag = tempStorage.current.Drive_Error_Flag[index] ?? "N/A";
        const Set_Regen = tempStorage.current.Set_Regen[index] ?? "N/A";
        const DCcurrentlimit = tempStorage.current.DCcurrentlimit[index] ?? "N/A";
        const Custom_freq = tempStorage.current.Custom_freq[index] ?? "N/A";
        const Custom_torque = tempStorage.current.Custom_torque[index] ?? "N/A";
        const Buffer_speed = tempStorage.current.Buffer_speed[index] ?? "N/A";
        const Base_speed = tempStorage.current.Base_speed[index] ?? "N/A";
        const Initial_torque = tempStorage.current.Initial_torque[index] ?? "N/A";
        const Final_torque = tempStorage.current.Final_torque[index] ?? "N/A";
        const Cluster_odo = tempStorage.current.Cluster_odo[index] ?? "N/A";
        const Mode_Ack = tempStorage.current.Mode_Ack[index] ?? "N/A";

        const csvData = `${LocalTime},${CellVol01.toFixed(4)},${CellVol02},${CellVol03},${CellVol04},${CellVol05},${CellVol06},${CellVol07},${CellVol08},${CellVol09},${CellVol10},${CellVol11},${CellVol12},${CellVol13},${CellVol14},${CellVol15},${CellVol16},${MaxCellVol},${MinCellVol},${AvgCellVol},${MaxVoltId},${MinVoltId},${PackVol},${CycleCount},${CellVolMinMaxDev},${SOC},${SOCAh},${SOH},${BmsStatus},${LedStatus},${ActiveCellBalStatus},${BMS_Serial_No_MUX},${BMS_Serial_No__1_7},${LatchProtection},${LatchType},${ChargerType},${PcbTemp},${AfeTemp},${CellChemType},${Chg_Accumulative_Ah},${Dchg_Accumulative_Ah},${RefVol},${_3v3Vol},${_5vVol},${_12vVol},${Actual_SoC},${Usable_Capacity_Ah},${ConfigVer},${InternalFWVer},${InternalFWSubVer},${BHB_66049},${PackCurr},${MaxTemp},${MinTemp},${FetTemp},${Temp1},${Temp2},${Temp3},${Temp4},${Temp5},${Temp6},${Temp7},${Temp8},${HwVer},${FwVer},${FWSubVer},${BtStatus_NC0PSM1CC2CV3Finish4},${Bt_liveMsg1Temp},${Bt_liveMsg_soc},${BMS_status},${Demand_voltage},${Demand_Current},${MaxChgVoltgae},${MaxChgCurrent},${ActualChgVoltage},${ActualChgCurrent},${Charging_end_cutoff_Curr},${CHB_258},${ChgrNC0PSM1CC2CV3Finsh4},${chgr_msg_temp},${chgStatus_chg_idle},${chgrLiveMsgChgVolt},${chgrLiveMsgChgCurrent},${MotorSpeed},${BatteryVoltage},${BatteryCurrent},${AC_Current},${AC_Voltage},${Throttle},${MCU_Temperature},${Motor_Temperature},${MCU_Fault_Code},${MCU_ID},${Cluster_heartbeat},${Odo_Cluster},${IgnitionStatus},${LoadDetection},${Keystatus},${keyevents},${CellUnderVolProt},${CellOverVolProt},${PackUnderVolProt},${PackOverVolProt},${ChgUnderTempProt},${ChgOverTempProt},${DchgUnderTempProt},${DchgOverTempProt},${CellOverDevProt},${BattLowSocWarn},${ChgOverCurrProt},${DchgOverCurrProt},${CellUnderVolWarn},${CellOverVolWarn},${FetTempProt},${ResSocProt},${FetFailure},${TempSenseFault},${PackUnderVolWarn},${PackOverVolWarn},${ChgUnderTempWarn},${ChgOverTempWarn},${DchgUnderTempWarn},${DchgOverTempWarn},${PreChgFetStatus},${ChgFetStatus},${DchgFetStatus},${ResStatus},${ShortCktProt},${DschgPeakProt},${ChgAuth},${ChgPeakProt},${DI1},${DI2},${DO1},${DO2},${ChargerDetection},${CanCommDetection},${CellBalFeatureStatus},${ImmoChg},${ImmoDchg},${BuzzerStatus},${Side_Stand_Ack},${Direction_Ack},${Ride_Ack},${Hill_hold_Ack},${Wakeup_Ack},${DriveError_Motor_hall},${Motor_Stalling},${Motor_Phase_loss},${Controller_Over_Temeprature},${Motor_Over_Temeprature},${Throttle_Error},${MOSFET_Protection},${DriveStatus_Regenerative_Braking},${ModeR_Pulse},${ModeL_Pulse},${Brake_Pulse},${Park_Pulse},${Reverse_Pulse},${SideStand_Pulse},${ForwardParking_Mode_Ack},${DriveError_Controller_OverVoltag},${Controller_Undervoltage},${Overcurrent_Fault},${DriveStatus1_ride},${Wakeup_Request},${Hill_Hold},${Reverse_REQUEST},${Forward_parkingmode_REQUEST},${Side_stand_Req},${Battery_charge_logic},${Remote_cutoff},${mode_limit},${Geo_fencebuzzer},${Holiday_mode},${Service_request},${Low_Mode_REQUEST},${Medium_Mode_REQUEST},${User_defind_mode_High_REQUEST},${Limp_mode_REQUEST},${ChargeSOP},${DchgSOP},${Drive_Error_Flag},${Set_Regen},${DCcurrentlimit},${Custom_freq},${Custom_torque},${Buffer_speed},${Base_speed},${Initial_torque},${Final_torque},${Cluster_odo},${Mode_Ack}`;
    
        if (!(tempStorage.current.isFirstCycle && tempStorage.current.firstLocalTime === LocalTime)) {
          FileSaveModule.writeData(csvData);
          console.log('Data Written:', csvData);
        }
      });
    
      tempStorage.current.isFirstCycle = false;
      tempStorage.current.CellVol01 = [];
      tempStorage.current.CellVol02 = [];
      tempStorage.current.CellVol03 = [];
      tempStorage.current.CellVol04 = [];
      tempStorage.current.CellVol05 = [];
      tempStorage.current.CellVol06 = [];
      tempStorage.current.CellVol07 = [];
      tempStorage.current.CellVol08 = [];
      tempStorage.current.CellVol09 = [];
      tempStorage.current.CellVol10 = [];
      tempStorage.current.CellVol11 = [];
      tempStorage.current.CellVol12 = [];
      tempStorage.current.CellVol13 = [];
      tempStorage.current.CellVol14 = [];
      tempStorage.current.CellVol15 = [];
      tempStorage.current.CellVol16 = [];
      tempStorage.current.MaxCellVol = [];
      tempStorage.current.MinCellVol = [];
      tempStorage.current.AvgCellVol = [];
      tempStorage.current.MaxVoltId = [];
      tempStorage.current.MinVoltId = [];
      tempStorage.current.PackVol = [];
      tempStorage.current.CycleCount = [];
      tempStorage.current.CellVolMinMaxDev = [];
      tempStorage.current.SOC = [];
      tempStorage.current.SOCAh = [];
      tempStorage.current.SOH = [];
      tempStorage.current.BmsStatus = [];
      tempStorage.current.LedStatus = [];
      tempStorage.current.ActiveCellBalStatus = [];
      tempStorage.current.BMS_Serial_No_MUX = [];
      tempStorage.current.BMS_Serial_No__1_7 = [];
      tempStorage.current.LatchProtection = [];
      tempStorage.current.LatchType = [];
      tempStorage.current.ChargerType = [];
      tempStorage.current.PcbTemp = [];
      tempStorage.current.AfeTemp = [];
      tempStorage.current.CellChemType = [];
      tempStorage.current.Chg_Accumulative_Ah = [];
      tempStorage.current.Dchg_Accumulative_Ah = [];
      tempStorage.current.RefVol = [];
      tempStorage.current._3v3Vol = [];
      tempStorage.current._5vVol = [];
      tempStorage.current._12vVol = [];
      tempStorage.current.Actual_SoC = [];
      tempStorage.current.Usable_Capacity_Ah = [];
      tempStorage.current.ConfigVer = [];
      tempStorage.current.InternalFWVer = [];
      tempStorage.current.InternalFWSubVer = [];
      tempStorage.current.BHB_66049 = [];
      tempStorage.current.PackCurr = [];
      tempStorage.current.MaxTemp = [];
      tempStorage.current.MinTemp = [];
      tempStorage.current.FetTemp = [];
      tempStorage.current.Temp1 = [];
      tempStorage.current.Temp2 = [];
      tempStorage.current.Temp3 = [];
      tempStorage.current.Temp4 = [];
      tempStorage.current.Temp5 = [];
      tempStorage.current.Temp6 = [];
      tempStorage.current.Temp7 = [];
      tempStorage.current.Temp8 = [];
      tempStorage.current.HwVer = [];
      tempStorage.current.FwVer = [];
      tempStorage.current.FWSubVer = [];
      tempStorage.current.BtStatus_NC0PSM1CC2CV3Finish4 = [];
      tempStorage.current.Bt_liveMsg1Temp = [];
      tempStorage.current.Bt_liveMsg_soc = [];
      tempStorage.current.BMS_status = [];
      tempStorage.current.Demand_voltage = [];
      tempStorage.current.Demand_Current = [];
      tempStorage.current.MaxChgVoltgae = [];
      tempStorage.current.MaxChgCurrent = [];
      tempStorage.current.ActualChgVoltage = [];
      tempStorage.current.ActualChgCurrent = [];
      tempStorage.current.Charging_end_cutoff_Curr = [];
      tempStorage.current.CHB_258 = [];
      tempStorage.current.ChgrNC0PSM1CC2CV3Finsh4 = [];
      tempStorage.current.chgr_msg_temp = [];
      tempStorage.current.chgStatus_chg_idle = [];
      tempStorage.current.chgrLiveMsgChgVolt = [];
      tempStorage.current.chgrLiveMsgChgCurrent = [];
      tempStorage.current.MotorSpeed = [];
      tempStorage.current.BatteryVoltage = [];
      tempStorage.current.BatteryCurrent = [];
      tempStorage.current.AC_Current = [];
      tempStorage.current.AC_Voltage = [];
      tempStorage.current.Throttle = [];
      tempStorage.current.MCU_Temperature = [];
      tempStorage.current.Motor_Temperature = [];
      tempStorage.current.MCU_Fault_Code = [];
      tempStorage.current.MCU_ID = [];
      tempStorage.current.Cluster_heartbeat = [];
      tempStorage.current.Odo_Cluster = [];
      tempStorage.current.IgnitionStatus = [];
      tempStorage.current.LoadDetection = [];
      tempStorage.current.Keystatus = [];
      tempStorage.current.keyevents = [];
      tempStorage.current.CellUnderVolProt = [];
      tempStorage.current.CellOverVolProt = [];
      tempStorage.current.PackUnderVolProt = [];
      tempStorage.current.PackOverVolProt = [];
      tempStorage.current.ChgUnderTempProt = [];
      tempStorage.current.ChgOverTempProt = [];
      tempStorage.current.DchgUnderTempProt = [];
      tempStorage.current.DchgOverTempProt = [];
      tempStorage.current.CellOverDevProt = [];
      tempStorage.current.BattLowSocWarn = [];
      tempStorage.current.ChgOverCurrProt = [];
      tempStorage.current.DchgOverCurrProt = [];
      tempStorage.current.CellUnderVolWarn = [];
      tempStorage.current.CellOverVolWarn = [];
      tempStorage.current.FetTempProt = [];
      tempStorage.current.ResSocProt = [];
      tempStorage.current.FetFailure = [];
      tempStorage.current.TempSenseFault = [];
      tempStorage.current.PackUnderVolWarn = [];
      tempStorage.current.PackOverVolWarn = [];
      tempStorage.current.ChgUnderTempWarn = [];
      tempStorage.current.ChgOverTempWarn = [];
      tempStorage.current.DchgUnderTempWarn = [];
      tempStorage.current.DchgOverTempWarn = [];
      tempStorage.current.PreChgFetStatus = [];
      tempStorage.current.ChgFetStatus = [];
      tempStorage.current.DchgFetStatus = [];
      tempStorage.current.ResStatus = [];
      tempStorage.current.ShortCktProt = [];
      tempStorage.current.DschgPeakProt = [];
      tempStorage.current.ChgAuth = [];
      tempStorage.current.ChgPeakProt = [];
      tempStorage.current.DI1 = [];
      tempStorage.current.DI2 = [];
      tempStorage.current.DO1 = [];
      tempStorage.current.DO2 = [];
      tempStorage.current.ChargerDetection = [];
      tempStorage.current.CanCommDetection = [];
      tempStorage.current.CellBalFeatureStatus = [];
      tempStorage.current.ImmoChg = [];
      tempStorage.current.ImmoDchg = [];
      tempStorage.current.BuzzerStatus = [];
      tempStorage.current.Side_Stand_Ack = [];
      tempStorage.current.Direction_Ack = [];
      tempStorage.current.Ride_Ack = [];
      tempStorage.current.Hill_hold_Ack = [];
      tempStorage.current.Wakeup_Ack = [];
      tempStorage.current.DriveError_Motor_hall = [];
      tempStorage.current.Motor_Stalling = [];
      tempStorage.current.Motor_Phase_loss = [];
      tempStorage.current.Controller_Over_Temeprature = [];
      tempStorage.current.Motor_Over_Temeprature = [];
      tempStorage.current.Throttle_Error = [];
      tempStorage.current.MOSFET_Protection = [];
      tempStorage.current.DriveStatus_Regenerative_Braking = [];
      tempStorage.current.ModeR_Pulse = [];
      tempStorage.current.ModeL_Pulse = [];
      tempStorage.current.Brake_Pulse = [];
      tempStorage.current.Park_Pulse = [];
      tempStorage.current.Reverse_Pulse = [];
      tempStorage.current.SideStand_Pulse = [];
      tempStorage.current.ForwardParking_Mode_Ack = [];
      tempStorage.current.DriveError_Controller_OverVoltag = [];
      tempStorage.current.Controller_Undervoltage = [];
      tempStorage.current.Overcurrent_Fault = [];
      tempStorage.current.DriveStatus1_ride = [];
      tempStorage.current.Wakeup_Request = [];
      tempStorage.current.Hill_Hold = [];
      tempStorage.current.Reverse_REQUEST = [];
      tempStorage.current.Forward_parkingmode_REQUEST = [];
      tempStorage.current.Side_stand_Req = [];
      tempStorage.current.Battery_charge_logic = [];
      tempStorage.current.Remote_cutoff = [];
      tempStorage.current.mode_limit = [];
      tempStorage.current.Geo_fencebuzzer = [];
      tempStorage.current.Holiday_mode = [];
      tempStorage.current.Service_request = [];
      tempStorage.current.Low_Mode_REQUEST = [];
      tempStorage.current.Medium_Mode_REQUEST = [];
      tempStorage.current.User_defind_mode_High_REQUEST = [];
      tempStorage.current.Limp_mode_REQUEST = [];
      tempStorage.current.ChargeSOP = [];
      tempStorage.current.DchgSOP = [];
      tempStorage.current.Drive_Error_Flag = [];
      tempStorage.current.Set_Regen = [];
      tempStorage.current.DCcurrentlimit = [];
      tempStorage.current.Custom_freq = [];
      tempStorage.current.Custom_torque = [];
      tempStorage.current.Buffer_speed = [];
      tempStorage.current.Base_speed = [];
      tempStorage.current.Initial_torque = [];
      tempStorage.current.Final_torque = [];
      tempStorage.current.Cluster_odo = [];
      tempStorage.current.Mode_Ack = [];
      tempStorage.current.firstLocalTime = null;
    }
  };

  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    }
  }

  const bit_decode = (firstByteCheck: string, bytePosition: number, bitPosition: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        return bits[7 - bitPosition] === '1' ? 1 : 0;
      }
      return null;
    }
  }
  
  const signed_eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        let decimalValue = parseInt(bytes, 16);
 
        // Adjust for two's complement if the value is a negative number
        const byteLength = positions.length;
        const maxByteValue = Math.pow(2, 8 * byteLength); // Max value for byte length
        const signBit = Math.pow(2, 8 * byteLength - 1); // Value of the sign bit
 
        if (decimalValue >= signBit) {
          decimalValue -= maxByteValue;
        }
 
        return decimalValue * multiplier;
      }
      return null;
    }
  }

  const three_bit_decode = (firstByteCheck: number, bytePosition: number, bit1: number, bit2: number, bit3: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck.toString().padStart(2, '0')) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        const resultBits = bits[7 - bit1] + bits[7 - bit2] + bits[7 - bit3];
        return parseInt(resultBits, 2);  // Returns the decimal value of the bit sequence directly
      }
      return null;
    }
  }

  const formatLocalTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months start at 0!
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Button title="Choose Location to Store" onPress={async () => {
          const result = await FileSaveModule.chooseLocation();
          setFileUri(result);
          Alert.alert('Location Chosen', `File will be saved to: ${result}`);
        }} />
        <Button title="Start Recording" onPress={() => {
          if (!fileUri) {
            Alert.alert('Error', 'Please choose a location first!');
            return;
          }
          setRecording(true);
        }} disabled={recording} />
        <Button title="Stop Recording" onPress={() => {
          setRecording(false);
          Alert.alert('Recording Stopped', 'The data recording has been stopped and saved.');
        }} disabled={!recording} />
        <Button title="View File" onPress={async () => {
          if (fileUri) {
            await FileSaveModule.viewFile(fileUri);
          }
        }} disabled={!fileUri} />
        <Button title="Share File" onPress={async () => {
          if (fileUri) {
            const result = await FileSaveModule.shareFile(fileUri);
            Alert.alert('Share', result.message);
          }
        }} disabled={!fileUri} />
        {CellVol01 !== null && <Text style={styles.CellVol01}>CellVol01: {CellVol01.toFixed(4)} V</Text>}
        {CellVol02 !== null && <Text style={styles.CellVol02}>CellVol02: {CellVol02.toFixed(4)} V</Text>}
        {CellVol03 !== null && <Text style={styles.CellVol03}>CellVol03: {CellVol03.toFixed(4)} V</Text>}
        {CellVol04 !== null && <Text style={styles.CellVol04}>CellVol04: {CellVol04.toFixed(4)} V</Text>}
        {CellVol05 !== null && <Text style={styles.CellVol05}>CellVol05: {CellVol05.toFixed(4)} V</Text>}
        {CellVol06 !== null && <Text style={styles.CellVol06}>CellVol06: {CellVol06.toFixed(4)} V</Text>}
        {CellVol07 !== null && <Text style={styles.CellVol07}>CellVol07: {CellVol07.toFixed(4)} V</Text>}
        {CellVol08 !== null && <Text style={styles.CellVol08}>CellVol08: {CellVol08.toFixed(4)} V</Text>}
        {CellVol09 !== null && <Text style={styles.CellVol09}>CellVol09: {CellVol09.toFixed(4)} V</Text>}
        {CellVol10 !== null && <Text style={styles.CellVol10}>CellVol10: {CellVol10.toFixed(4)} V</Text>}
        {CellVol11 !== null && <Text style={styles.CellVol11}>CellVol11: {CellVol11.toFixed(4)} V</Text>}
        {CellVol12 !== null && <Text style={styles.CellVol12}>CellVol12: {CellVol12.toFixed(4)} V</Text>}
        {CellVol13 !== null && <Text style={styles.CellVol13}>CellVol13: {CellVol13.toFixed(4)} V</Text>}
        {CellVol14 !== null && <Text style={styles.CellVol14}>CellVol14: {CellVol14.toFixed(4)} V</Text>}
        {CellVol15 !== null && <Text style={styles.CellVol15}>CellVol15: {CellVol15.toFixed(4)} V</Text>}
        {CellVol16 !== null && <Text style={styles.CellVol16}>CellVol16: {CellVol16.toFixed(4)} V</Text>}
        {MaxCellVol !== null && <Text style={styles.MaxCellVol}>MaxCellVol: {MaxCellVol.toFixed(4)} V</Text>}
{MinCellVol !== null && <Text style={styles.MinCellVol}>MinCellVol: {MinCellVol.toFixed(4)} V</Text>}
{AvgCellVol !== null && <Text style={styles.AvgCellVol}>AvgCellVol: {AvgCellVol.toFixed(4)} V</Text>}
{MaxVoltId !== null && <Text style={styles.MaxVoltId}>MaxVoltId: {MaxVoltId}</Text>}
{MinVoltId !== null && <Text style={styles.MinVoltId}>MinVoltId: {MinVoltId}</Text>}
{PackVol !== null && <Text style={styles.PackVol}>PackVol: {PackVol.toFixed(4)} V</Text>}
{CycleCount !== null && <Text style={styles.CycleCount}>CycleCount: {CycleCount}</Text>}
{CellVolMinMaxDev !== null && <Text style={styles.CellVolMinMaxDev}>CellVolMinMaxDev: {CellVolMinMaxDev.toFixed(4)} V</Text>}
{SOC !== null && <Text style={styles.SOC}>SOC: {SOC.toFixed(4)}%</Text>}
{SOCAh !== null && <Text style={styles.SOCAh}>SOCAh: {SOCAh.toFixed(4)} Ah</Text>}
{SOH !== null && <Text style={styles.SOH}>SOH: {SOH.toFixed(4)}%</Text>}
{BmsStatus !== null && <Text style={styles.BmsStatus}>BmsStatus: {BmsStatus}</Text>}
{LedStatus !== null && <Text style={styles.LedStatus}>LedStatus: {LedStatus}</Text>}
{ActiveCellBalStatus !== null && <Text style={styles.ActiveCellBalStatus}>ActiveCellBalStatus: {ActiveCellBalStatus}</Text>}
{BMS_Serial_No_MUX !== null && <Text style={styles.BMS_Serial_No_MUX}>BMS_Serial_No_MUX: {BMS_Serial_No_MUX}</Text>}
{BMS_Serial_No__1_7 !== null && <Text style={styles.BMS_Serial_No__1_7}>BMS_Serial_No__1_7: {BMS_Serial_No__1_7}</Text>}
{LatchProtection !== null && <Text style={styles.LatchProtection}>LatchProtection: {LatchProtection}</Text>}
{LatchType !== null && <Text style={styles.LatchType}>LatchType: {LatchType}</Text>}
{ChargerType !== null && <Text style={styles.ChargerType}>ChargerType: {ChargerType}</Text>}
{PcbTemp !== null && <Text style={styles.PcbTemp}>PcbTemp: {PcbTemp.toFixed(4)}°C</Text>}
{AfeTemp !== null && <Text style={styles.AfeTemp}>AfeTemp: {AfeTemp.toFixed(4)}°C</Text>}
{CellChemType !== null && <Text style={styles.CellChemType}>CellChemType: {CellChemType}</Text>}
{Chg_Accumulative_Ah !== null && <Text style={styles.Chg_Accumulative_Ah}>Chg_Accumulative_Ah: {Chg_Accumulative_Ah.toFixed(4)} Ah</Text>}
{Dchg_Accumulative_Ah !== null && <Text style={styles.Dchg_Accumulative_Ah}>Dchg_Accumulative_Ah: {Dchg_Accumulative_Ah.toFixed(4)} Ah</Text>}
{RefVol !== null && <Text style={styles.RefVol}>RefVol: {RefVol.toFixed(4)} V</Text>}
{_3v3Vol !== null && <Text style={styles._3v3Vol}>3v3Vol: {_3v3Vol.toFixed(4)} V</Text>}
{_5vVol !== null && <Text style={styles._5vVol}>5vVol: {_5vVol.toFixed(4)} V</Text>}
{_12vVol !== null && <Text style={styles._12vVol}>12vVol: {_12vVol.toFixed(4)} V</Text>}
{Actual_SoC !== null && <Text style={styles.Actual_SoC}>Actual_SoC: {Actual_SoC.toFixed(4)}%</Text>}
{Usable_Capacity_Ah !== null && <Text style={styles.Usable_Capacity_Ah}>Usable_Capacity_Ah: {Usable_Capacity_Ah.toFixed(4)} Ah</Text>}
{ConfigVer !== null && <Text style={styles.ConfigVer}>ConfigVer: {ConfigVer}</Text>}
{InternalFWVer !== null && <Text style={styles.InternalFWVer}>InternalFWVer: {InternalFWVer}</Text>}
{InternalFWSubVer !== null && <Text style={styles.InternalFWSubVer}>InternalFWSubVer: {InternalFWSubVer}</Text>}
{BHB_66049 !== null && <Text style={styles.BHB_66049}>BHB_66049: {BHB_66049}</Text>}
{PackCurr !== null && <Text style={styles.PackCurr}>PackCurr: {PackCurr.toFixed(4)} A</Text>}
{MaxTemp !== null && <Text style={styles.MaxTemp}>MaxTemp: {MaxTemp.toFixed(4)}°C</Text>}
{MinTemp !== null && <Text style={styles.MinTemp}>MinTemp: {MinTemp.toFixed(4)}°C</Text>}
{FetTemp !== null && <Text style={styles.FetTemp}>FetTemp: {FetTemp.toFixed(4)}°C</Text>}
{Temp1 !== null && <Text style={styles.Temp1}>Temp1: {Temp1.toFixed(4)}°C</Text>}
{Temp2 !== null && <Text style={styles.Temp2}>Temp2: {Temp2.toFixed(4)}°C</Text>}
{Temp3 !== null && <Text style={styles.Temp3}>Temp3: {Temp3.toFixed(4)}°C</Text>}
{Temp4 !== null && <Text style={styles.Temp4}>Temp4: {Temp4.toFixed(4)}°C</Text>}
{Temp5 !== null && <Text style={styles.Temp5}>Temp5: {Temp5.toFixed(4)}°C</Text>}
{Temp6 !== null && <Text style={styles.Temp6}>Temp6: {Temp6.toFixed(4)}°C</Text>}
{Temp7 !== null && <Text style={styles.Temp7}>Temp7: {Temp7.toFixed(4)}°C</Text>}
{Temp8 !== null && <Text style={styles.Temp8}>Temp8: {Temp8.toFixed(4)}°C</Text>}
{HwVer !== null && <Text style={styles.HwVer}>HwVer: {HwVer}</Text>}
{FwVer !== null && <Text style={styles.FwVer}>FwVer: {FwVer}</Text>}
{FWSubVer !== null && <Text style={styles.FWSubVer}>FWSubVer: {FWSubVer}</Text>}
{BtStatus_NC0PSM1CC2CV3Finish4 !== null && <Text style={styles.BtStatus_NC0PSM1CC2CV3Finish4}>BtStatus: {BtStatus_NC0PSM1CC2CV3Finish4}</Text>}
{Bt_liveMsg1Temp !== null && <Text style={styles.Bt_liveMsg1Temp}>Bt_liveMsg1Temp: {Bt_liveMsg1Temp.toFixed(4)}</Text>}
{Bt_liveMsg_soc !== null && <Text style={styles.Bt_liveMsg_soc}>Bt_liveMsg_soc: {Bt_liveMsg_soc.toFixed(4)}%</Text>}
{BMS_status !== null && <Text style={styles.BMS_status}>BMS_status: {BMS_status}</Text>}
{Demand_voltage !== null && <Text style={styles.Demand_voltage}>Demand_voltage: {Demand_voltage.toFixed(4)} V</Text>}
{Demand_Current !== null && <Text style={styles.Demand_Current}>Demand_Current: {Demand_Current.toFixed(4)} A</Text>}
{MaxChgVoltgae !== null && <Text style={styles.MaxChgVoltgae}>MaxChgVoltgae: {MaxChgVoltgae.toFixed(4)} V</Text>}
{MaxChgCurrent !== null && <Text style={styles.MaxChgCurrent}>MaxChgCurrent: {MaxChgCurrent.toFixed(4)} A</Text>}
{ActualChgVoltage !== null && <Text style={styles.ActualChgVoltage}>ActualChgVoltage: {ActualChgVoltage.toFixed(4)} V</Text>}
{ActualChgCurrent !== null && <Text style={styles.ActualChgCurrent}>ActualChgCurrent: {ActualChgCurrent.toFixed(4)} A</Text>}
{Charging_end_cutoff_Curr !== null && <Text style={styles.Charging_end_cutoff_Curr}>Charging_end_cutoff_Curr: {Charging_end_cutoff_Curr.toFixed(4)} A</Text>}
{CHB_258 !== null && <Text style={styles.CHB_258}>CHB_258: {CHB_258}</Text>}
{ChgrNC0PSM1CC2CV3Finsh4 !== null && <Text style={styles.ChgrNC0PSM1CC2CV3Finsh4}>ChgrNC0PSM1CC2CV3Finsh4: {ChgrNC0PSM1CC2CV3Finsh4}</Text>}
{chgr_msg_temp !== null && <Text style={styles.chgr_msg_temp}>chgr_msg_temp: {chgr_msg_temp.toFixed(4)}°C</Text>}
{chgStatus_chg_idle !== null && <Text style={styles.chgStatus_chg_idle}>chgStatus_chg_idle: {chgStatus_chg_idle}</Text>}
{chgrLiveMsgChgVolt !== null && <Text style={styles.chgrLiveMsgChgVolt}>chgrLiveMsgChgVolt: {chgrLiveMsgChgVolt.toFixed(4)} V</Text>}
{chgrLiveMsgChgCurrent !== null && <Text style={styles.chgrLiveMsgChgCurrent}>chgrLiveMsgChgCurrent: {chgrLiveMsgChgCurrent.toFixed(4)} A</Text>}
{MotorSpeed !== null && <Text style={styles.MotorSpeed}>MotorSpeed: {MotorSpeed.toFixed(4)}</Text>}
{BatteryVoltage !== null && <Text style={styles.BatteryVoltage}>BatteryVoltage: {BatteryVoltage.toFixed(4)} V</Text>}
{BatteryCurrent !== null && <Text style={styles.BatteryCurrent}>BatteryCurrent: {BatteryCurrent.toFixed(4)} A</Text>}
{AC_Current !== null && <Text style={styles.AC_Current}>AC_Current: {AC_Current.toFixed(4)} A</Text>}
{AC_Voltage !== null && <Text style={styles.AC_Voltage}>AC_Voltage: {AC_Voltage.toFixed(4)} V</Text>}
{Throttle !== null && <Text style={styles.Throttle}>Throttle: {Throttle.toFixed(4)}</Text>}
{MCU_Temperature !== null && <Text style={styles.MCU_Temperature}>MCU_Temperature: {MCU_Temperature.toFixed(4)}°C</Text>}
{Motor_Temperature !== null && <Text style={styles.Motor_Temperature}>Motor_Temperature: {Motor_Temperature.toFixed(4)}°C</Text>}
{MCU_Fault_Code !== null && <Text style={styles.MCU_Fault_Code}>MCU_Fault_Code: {MCU_Fault_Code}</Text>}
{MCU_ID !== null && <Text style={styles.MCU_ID}>MCU_ID: {MCU_ID}</Text>}
{Cluster_heartbeat !== null && <Text style={styles.Cluster_heartbeat}>Cluster_heartbeat: {Cluster_heartbeat}</Text>}
{Odo_Cluster !== null && <Text style={styles.Odo_Cluster}>Odo_Cluster: {Odo_Cluster.toFixed(4)}</Text>}
{IgnitionStatus !== null && <Text style={styles.IgnitionStatus}>IgnitionStatus: {IgnitionStatus}</Text>}
{LoadDetection !== null && <Text style={styles.LoadDetection}>LoadDetection: {LoadDetection}</Text>}
{Keystatus !== null && <Text style={styles.Keystatus}>Keystatus: {Keystatus}</Text>}
{keyevents !== null && <Text style={styles.keyevents}>keyevents: {keyevents}</Text>}
{CellUnderVolProt !== null && <Text style={styles.CellUnderVolProt}>CellUnderVolProt: {CellUnderVolProt}</Text>}
{CellOverVolProt !== null && <Text style={styles.CellOverVolProt}>CellOverVolProt: {CellOverVolProt}</Text>}
{PackUnderVolProt !== null && <Text style={styles.PackUnderVolProt}>PackUnderVolProt: {PackUnderVolProt}</Text>}
{PackOverVolProt !== null && <Text style={styles.PackOverVolProt}>PackOverVolProt: {PackOverVolProt}</Text>}
{ChgUnderTempProt !== null && <Text style={styles.ChgUnderTempProt}>ChgUnderTempProt: {ChgUnderTempProt}</Text>}
{ChgOverTempProt !== null && <Text style={styles.ChgOverTempProt}>ChgOverTempProt: {ChgOverTempProt}</Text>}
{DchgUnderTempProt !== null && <Text style={styles.DchgUnderTempProt}>DchgUnderTempProt: {DchgUnderTempProt}</Text>}
{DchgOverTempProt !== null && <Text style={styles.DchgOverTempProt}>DchgOverTempProt: {DchgOverTempProt}</Text>}
{CellOverDevProt !== null && <Text style={styles.CellOverDevProt}>CellOverDevProt: {CellOverDevProt}</Text>}
{BattLowSocWarn !== null && <Text style={styles.BattLowSocWarn}>BattLowSocWarn: {BattLowSocWarn}</Text>}
{ChgOverCurrProt !== null && <Text style={styles.ChgOverCurrProt}>ChgOverCurrProt: {ChgOverCurrProt}</Text>}
{DchgOverCurrProt !== null && <Text style={styles.DchgOverCurrProt}>DchgOverCurrProt: {DchgOverCurrProt}</Text>}
{CellUnderVolWarn !== null && <Text style={styles.CellUnderVolWarn}>CellUnderVolWarn: {CellUnderVolWarn}</Text>}
{CellOverVolWarn !== null && <Text style={styles.CellOverVolWarn}>CellOverVolWarn: {CellOverVolWarn}</Text>}
{FetTempProt !== null && <Text style={styles.FetTempProt}>FetTempProt: {FetTempProt}</Text>}
{ResSocProt !== null && <Text style={styles.ResSocProt}>ResSocProt: {ResSocProt}</Text>}
{FetFailure !== null && <Text style={styles.FetFailure}>FetFailure: {FetFailure}</Text>}
{TempSenseFault !== null && <Text style={styles.TempSenseFault}>TempSenseFault: {TempSenseFault}</Text>}
{PackUnderVolWarn !== null && <Text style={styles.PackUnderVolWarn}>PackUnderVolWarn: {PackUnderVolWarn}</Text>}
{PackOverVolWarn !== null && <Text style={styles.PackOverVolWarn}>PackOverVolWarn: {PackOverVolWarn}</Text>}
{ChgUnderTempWarn !== null && <Text style={styles.ChgUnderTempWarn}>ChgUnderTempWarn: {ChgUnderTempWarn}</Text>}
{ChgOverTempWarn !== null && <Text style={styles.ChgOverTempWarn}>ChgOverTempWarn: {ChgOverTempWarn}</Text>}
{DchgUnderTempWarn !== null && <Text style={styles.DchgUnderTempWarn}>DchgUnderTempWarn: {DchgUnderTempWarn}</Text>}
{DchgOverTempWarn !== null && <Text style={styles.DchgOverTempWarn}>DchgOverTempWarn: {DchgOverTempWarn}</Text>}
{PreChgFetStatus !== null && <Text style={styles.PreChgFetStatus}>PreChgFetStatus: {PreChgFetStatus}</Text>}
{ChgFetStatus !== null && <Text style={styles.ChgFetStatus}>ChgFetStatus: {ChgFetStatus}</Text>}
{DchgFetStatus !== null && <Text style={styles.DchgFetStatus}>DchgFetStatus: {DchgFetStatus}</Text>}
{ResStatus !== null && <Text style={styles.ResStatus}>ResStatus: {ResStatus}</Text>}
{ShortCktProt !== null && <Text style={styles.ShortCktProt}>ShortCktProt: {ShortCktProt}</Text>}
{DschgPeakProt !== null && <Text style={styles.DschgPeakProt}>DschgPeakProt: {DschgPeakProt}</Text>}
{ChgAuth !== null && <Text style={styles.ChgAuth}>ChgAuth: {ChgAuth}</Text>}
{ChgPeakProt !== null && <Text style={styles.ChgPeakProt}>ChgPeakProt: {ChgPeakProt}</Text>}
{DI1 !== null && <Text style={styles.DI1}>DI1: {DI1}</Text>}
{DI2 !== null && <Text style={styles.DI2}>DI2: {DI2}</Text>}
{DO1 !== null && <Text style={styles.DO1}>DO1: {DO1}</Text>}
{DO2 !== null && <Text style={styles.DO2}>DO2: {DO2}</Text>}
{ChargerDetection !== null && <Text style={styles.ChargerDetection}>ChargerDetection: {ChargerDetection}</Text>}
{CanCommDetection !== null && <Text style={styles.CanCommDetection}>CanCommDetection: {CanCommDetection}</Text>}
{CellBalFeatureStatus !== null && <Text style={styles.CellBalFeatureStatus}>CellBalFeatureStatus: {CellBalFeatureStatus}</Text>}
{ImmoChg !== null && <Text style={styles.ImmoChg}>ImmoChg: {ImmoChg}</Text>}
{ImmoDchg !== null && <Text style={styles.ImmoDchg}>ImmoDchg: {ImmoDchg}</Text>}
{BuzzerStatus !== null && <Text style={styles.BuzzerStatus}>BuzzerStatus: {BuzzerStatus}</Text>}
{Side_Stand_Ack !== null && <Text style={styles.Side_Stand_Ack}>Side_Stand_Ack: {Side_Stand_Ack}</Text>}
{Direction_Ack !== null && <Text style={styles.Direction_Ack}>Direction_Ack: {Direction_Ack}</Text>}
{Ride_Ack !== null && <Text style={styles.Ride_Ack}>Ride_Ack: {Ride_Ack}</Text>}
{Hill_hold_Ack !== null && <Text style={styles.Hill_hold_Ack}>Hill_hold_Ack: {Hill_hold_Ack}</Text>}
{Wakeup_Ack !== null && <Text style={styles.Wakeup_Ack}>Wakeup_Ack: {Wakeup_Ack}</Text>}
{DriveError_Motor_hall !== null && <Text style={styles.DriveError_Motor_hall}>DriveError_Motor_hall: {DriveError_Motor_hall}</Text>}
{Motor_Stalling !== null && <Text style={styles.Motor_Stalling}>Motor_Stalling: {Motor_Stalling}</Text>}
{Motor_Phase_loss !== null && <Text style={styles.Motor_Phase_loss}>Motor_Phase_loss: {Motor_Phase_loss}</Text>}
{Controller_Over_Temeprature !== null && <Text style={styles.Controller_Over_Temeprature}>Controller_Over_Temeprature: {Controller_Over_Temeprature.toFixed(4)}°C</Text>}
{Motor_Over_Temeprature !== null && <Text style={styles.Motor_Over_Temeprature}>Motor_Over_Temeprature: {Motor_Over_Temeprature.toFixed(4)}°C</Text>}
{Throttle_Error !== null && <Text style={styles.Throttle_Error}>Throttle_Error: {Throttle_Error}</Text>}
{MOSFET_Protection !== null && <Text style={styles.MOSFET_Protection}>MOSFET_Protection: {MOSFET_Protection}</Text>}
{DriveStatus_Regenerative_Braking !== null && <Text style={styles.DriveStatus_Regenerative_Braking}>DriveStatus_Regenerative_Braking: {DriveStatus_Regenerative_Braking}</Text>}
{ModeR_Pulse !== null && <Text style={styles.ModeR_Pulse}>ModeR_Pulse: {ModeR_Pulse}</Text>}
{ModeL_Pulse !== null && <Text style={styles.ModeL_Pulse}>ModeL_Pulse: {ModeL_Pulse}</Text>}
{Brake_Pulse !== null && <Text style={styles.Brake_Pulse}>Brake_Pulse: {Brake_Pulse}</Text>}
{Park_Pulse !== null && <Text style={styles.Park_Pulse}>Park_Pulse: {Park_Pulse}</Text>}
{Reverse_Pulse !== null && <Text style={styles.Reverse_Pulse}>Reverse_Pulse: {Reverse_Pulse}</Text>}
{SideStand_Pulse !== null && <Text style={styles.SideStand_Pulse}>SideStand_Pulse: {SideStand_Pulse}</Text>}
{ForwardParking_Mode_Ack !== null && <Text style={styles.ForwardParking_Mode_Ack}>ForwardParking_Mode_Ack: {ForwardParking_Mode_Ack}</Text>}
{DriveError_Controller_OverVoltag !== null && <Text style={styles.DriveError_Controller_OverVoltag}>DriveError_Controller_OverVoltag: {DriveError_Controller_OverVoltag}</Text>}
{Controller_Undervoltage !== null && <Text style={styles.Controller_Undervoltage}>Controller_Undervoltage: {Controller_Undervoltage.toFixed(4)} V</Text>}
{Overcurrent_Fault !== null && <Text style={styles.Overcurrent_Fault}>Overcurrent_Fault: {Overcurrent_Fault}</Text>}
{DriveStatus1_ride !== null && <Text style={styles.DriveStatus1_ride}>DriveStatus1_ride: {DriveStatus1_ride}</Text>}
{Wakeup_Request !== null && <Text style={styles.Wakeup_Request}>Wakeup_Request: {Wakeup_Request}</Text>}
{Hill_Hold !== null && <Text style={styles.Hill_Hold}>Hill_Hold: {Hill_Hold}</Text>}
{Reverse_REQUEST !== null && <Text style={styles.Reverse_REQUEST}>Reverse_REQUEST: {Reverse_REQUEST}</Text>}
{Forward_parkingmode_REQUEST !== null && <Text style={styles.Forward_parkingmode_REQUEST}>Forward_parkingmode_REQUEST: {Forward_parkingmode_REQUEST}</Text>}
{Side_stand_Req !== null && <Text style={styles.Side_stand_Req}>Side_stand_Req: {Side_stand_Req}</Text>}
{Battery_charge_logic !== null && <Text style={styles.Battery_charge_logic}>Battery_charge_logic: {Battery_charge_logic}</Text>}
{Remote_cutoff !== null && <Text style={styles.Remote_cutoff}>Remote_cutoff: {Remote_cutoff}</Text>}
{mode_limit !== null && <Text style={styles.mode_limit}>mode_limit: {mode_limit}</Text>}
{Geo_fencebuzzer !== null && <Text style={styles.Geo_fencebuzzer}>Geo_fencebuzzer: {Geo_fencebuzzer}</Text>}
{Holiday_mode !== null && <Text style={styles.Holiday_mode}>Holiday_mode: {Holiday_mode}</Text>}
{Service_request !== null && <Text style={styles.Service_request}>Service_request: {Service_request}</Text>}
{Low_Mode_REQUEST !== null && <Text style={styles.Low_Mode_REQUEST}>Low_Mode_REQUEST: {Low_Mode_REQUEST}</Text>}
{Medium_Mode_REQUEST !== null && <Text style={styles.Medium_Mode_REQUEST}>Medium_Mode_REQUEST: {Medium_Mode_REQUEST}</Text>}
{User_defind_mode_High_REQUEST !== null && <Text style={styles.User_defind_mode_High_REQUEST}>User_defind_mode_High_REQUEST: {User_defind_mode_High_REQUEST}</Text>}
{Limp_mode_REQUEST !== null && <Text style={styles.Limp_mode_REQUEST}>Limp_mode_REQUEST: {Limp_mode_REQUEST}</Text>}
{ChargeSOP !== null && <Text style={styles.ChargeSOP}>ChargeSOP: {ChargeSOP}</Text>}
{DchgSOP !== null && <Text style={styles.DchgSOP}>DchgSOP: {DchgSOP}</Text>}
{Drive_Error_Flag !== null && <Text style={styles.Drive_Error_Flag}>Drive_Error_Flag: {Drive_Error_Flag}</Text>}
{Set_Regen !== null && <Text style={styles.Set_Regen}>Set_Regen: {Set_Regen}</Text>}
{DCcurrentlimit !== null && <Text style={styles.DCcurrentlimit}>DCcurrentlimit: {DCcurrentlimit.toFixed(4)} A</Text>}
{Custom_freq !== null && <Text style={styles.Custom_freq}>Custom_freq: {Custom_freq.toFixed(4)} Hz</Text>}
{Custom_torque !== null && <Text style={styles.Custom_torque}>Custom_torque: {Custom_torque.toFixed(4)} Nm</Text>}
{Buffer_speed !== null && <Text style={styles.Buffer_speed}>Buffer_speed: {Buffer_speed.toFixed(4)} km/h</Text>}
{Base_speed !== null && <Text style={styles.Base_speed}>Base_speed: {Base_speed.toFixed(4)} km/h</Text>}
{Initial_torque !== null && <Text style={styles.Initial_torque}>Initial_torque: {Initial_torque.toFixed(4)} Nm</Text>}
{Final_torque !== null && <Text style={styles.Final_torque}>Final_torque: {Final_torque.toFixed(4)} Nm</Text>}
{Cluster_odo !== null && <Text style={styles.Cluster_odo}>Cluster_odo: {Cluster_odo.toFixed(4)} km</Text>}
{Mode_Ack !== null && <Text style={styles.Mode_Ack}>Mode_Ack: {Mode_Ack}</Text>}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  CellVol01: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol02: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol03: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol04: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol05: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol06: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol07: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol08: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol09: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol10: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol11: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol12: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol13: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol14: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol15: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol16: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MaxCellVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MinCellVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  AvgCellVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MaxVoltId: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MinVoltId: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CycleCount: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVolMinMaxDev: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  SOC: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  SOCAh: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  SOH: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BmsStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  LedStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ActiveCellBalStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BMS_Serial_No_MUX: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BMS_Serial_No__1_7: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  LatchProtection: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  LatchType: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChargerType: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PcbTemp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  AfeTemp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellChemType: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Chg_Accumulative_Ah: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Dchg_Accumulative_Ah: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  RefVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  _3v3Vol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  _5vVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  _12vVol: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Actual_SoC: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Usable_Capacity_Ah: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ConfigVer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  InternalFWVer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  InternalFWSubVer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BHB_66049: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackCurr: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MaxTemp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MinTemp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  FetTemp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp1: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp2: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp3: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp4: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp5: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp6: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp7: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Temp8: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  HwVer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  FwVer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  FWSubVer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BtStatus_NC0PSM1CC2CV3Finish4: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Bt_liveMsg1Temp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Bt_liveMsg_soc: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BMS_status: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Demand_voltage: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Demand_Current: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MaxChgVoltgae: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MaxChgCurrent: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ActualChgVoltage: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ActualChgCurrent: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Charging_end_cutoff_Curr: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CHB_258: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgrNC0PSM1CC2CV3Finsh4: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chgr_msg_temp: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chgStatus_chg_idle: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chgrLiveMsgChgVolt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chgrLiveMsgChgCurrent: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MotorSpeed: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BatteryVoltage: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BatteryCurrent: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  AC_Current: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  AC_Voltage: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Throttle: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MCU_Temperature: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Motor_Temperature: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MCU_Fault_Code: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MCU_ID: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Cluster_heartbeat: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Odo_Cluster: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  IgnitionStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  LoadDetection: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Keystatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  keyevents: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellUnderVolProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellOverVolProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackUnderVolProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackOverVolProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgUnderTempProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgOverTempProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgUnderTempProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgOverTempProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellOverDevProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BattLowSocWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgOverCurrProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgOverCurrProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellUnderVolWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellOverVolWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  FetTempProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ResSocProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  FetFailure: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  TempSenseFault: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackUnderVolWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackOverVolWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgUnderTempWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgOverTempWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgUnderTempWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgOverTempWarn: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PreChgFetStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgFetStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgFetStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ResStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ShortCktProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DschgPeakProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgAuth: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChgPeakProt: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DI1: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DI2: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DO1: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DO2: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChargerDetection: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CanCommDetection: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellBalFeatureStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ImmoChg: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ImmoDchg: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BuzzerStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Side_Stand_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Direction_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Ride_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Hill_hold_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Wakeup_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DriveError_Motor_hall: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Motor_Stalling: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Motor_Phase_loss: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Controller_Over_Temeprature: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Motor_Over_Temeprature: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Throttle_Error: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  MOSFET_Protection: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DriveStatus_Regenerative_Braking: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ModeR_Pulse: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ModeL_Pulse: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Brake_Pulse: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Park_Pulse: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Reverse_Pulse: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  SideStand_Pulse: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ForwardParking_Mode_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DriveError_Controller_OverVoltag: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Controller_Undervoltage: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Overcurrent_Fault: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DriveStatus1_ride: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Wakeup_Request: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Hill_Hold: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Reverse_REQUEST: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Forward_parkingmode_REQUEST: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Side_stand_Req: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Battery_charge_logic: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Remote_cutoff: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mode_limit: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Geo_fencebuzzer: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Holiday_mode: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Service_request: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Low_Mode_REQUEST: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Medium_Mode_REQUEST: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  User_defind_mode_High_REQUEST: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Limp_mode_REQUEST: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ChargeSOP: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DchgSOP: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Drive_Error_Flag: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Set_Regen: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  DCcurrentlimit: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Custom_freq: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Custom_torque: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Buffer_speed: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Base_speed: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Initial_torque: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Final_torque: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Cluster_odo: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Mode_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
