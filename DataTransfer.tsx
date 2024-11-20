import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import { Picker } from '@react-native-picker/picker';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [cellVol01, setcellVol01] = useState<number | null>(null);
  const [cellVol02, setcellVol02] = useState<number | null>(null);
  const [cellVol03, setcellVol03] = useState<number | null>(null);
  const [cellVol04, setcellVol04] = useState<number | null>(null);
  const [cellVol05, setcellVol05] = useState<number | null>(null);
  const [cellVol06, setcellVol06] = useState<number | null>(null);
  const [cellVol07, setcellVol07] = useState<number | null>(null);
  const [cellVol08, setcellVol08] = useState<number | null>(null);
  const [cellVol09, setcellVol09] = useState<number | null>(null);
  const [cellVol10, setcellVol10] = useState<number | null>(null);
  const [cellVol11, setcellVol11] = useState<number | null>(null);
  const [cellVol12, setcellVol12] = useState<number | null>(null);
  const [cellVol13, setcellVol13] = useState<number | null>(null);
  const [cellVol14, setcellVol14] = useState<number | null>(null);
  const [cellVol15, setcellVol15] = useState<number | null>(null);
  const [cellVol16, setcellVol16] = useState<number | null>(null);
 
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
 
  const [IgnitionStatus, setIgnitionStatus] = useState<string | null>(null);
  const [LoadDetection, setLoadDetection] = useState<string | null>(null);
  const [Keystatus, setKeystatus] = useState<string | null>(null);
  const [keyevents, setkeyevents] = useState<string | null>(null);
  const [CellUnderVolProt, setCellUnderVolProt] = useState<string | null>(null);
  const [CellOverVolProt, setCellOverVolProt] = useState<string | null>(null);
  const [PackUnderVolProt, setPackUnderVolProt] = useState<string | null>(null);
  const [PackOverVolProt, setPackOverVolProt] = useState<string | null>(null);
  const [ChgUnderTempProt, setChgUnderTempProt] = useState<string | null>(null);
  const [ChgOverTempProt, setChgOverTempProt] = useState<string | null>(null);
  const [DchgUnderTempProt, setDchgUnderTempProt] = useState<string | null>(null);
  const [DchgOverTempProt, setDchgOverTempProt] = useState<string | null>(null);
  const [CellOverDevProt, setCellOverDevProt] = useState<string | null>(null);
  const [BattLowSocWarn, setBattLowSocWarn] = useState<string | null>(null);
  const [ChgOverCurrProt, setChgOverCurrProt] = useState<string | null>(null);
  const [DchgOverCurrProt, setDchgOverCurrProt] = useState<string | null>(null);
  const [CellUnderVolWarn, setCellUnderVolWarn] = useState<string | null>(null);
  const [CellOverVolWarn, setCellOverVolWarn] = useState<string | null>(null);
  const [FetTempProt, setFetTempProt] = useState<string | null>(null);
  const [ResSocProt, setResSocProt] = useState<string | null>(null);
  const [FetFailure, setFetFailure] = useState<string | null>(null);
  const [TempSenseFault, setTempSenseFault] = useState<string | null>(null);
  const [PackUnderVolWarn, setPackUnderVolWarn] = useState<string | null>(null);
  const [PackOverVolWarn, setPackOverVolWarn] = useState<string | null>(null);
  const [ChgUnderTempWarn, setChgUnderTempWarn] = useState<string | null>(null);
  const [ChgOverTempWarn, setChgOverTempWarn] = useState<string | null>(null);
  const [DchgUnderTempWarn, setDchgUnderTempWarn] = useState<string | null>(null);
  const [DchgOverTempWarn, setDchgOverTempWarn] = useState<string | null>(null);
  const [PreChgFetStatus, setPreChgFetStatus] = useState<string | null>(null);
  const [ChgFetStatus, setChgFetStatus] = useState<string | null>(null);
  const [DchgFetStatus, setDchgFetStatus] = useState<string | null>(null);
  const [ResStatus, setResStatus] = useState<string | null>(null);
  const [ShortCktProt, setShortCktProt] = useState<string | null>(null);
  const [DschgPeakProt, setDschgPeakProt] = useState<string | null>(null);
  const [ChgAuth, setChgAuth] = useState<string | null>(null);
  const [ChgPeakProt, setChgPeakProt] = useState<string | null>(null);
  const [DI1, setDI1] = useState<string | null>(null);
  const [DI2, setDI2] = useState<string | null>(null);
  const [DO1, setDO1] = useState<string | null>(null);
  const [DO2, setDO2] = useState<string | null>(null);
  const [ChargerDetection, setChargerDetection] = useState<string | null>(null);
  const [CanCommDetection, setCanCommDetection] = useState<string | null>(null);
  const [CellBalFeatureStatus, setCellBalFeatureStatus] = useState<string | null>(null);
  const [ImmoChg, setImmoChg] = useState<string | null>(null);
  const [ImmoDchg, setImmoDchg] = useState<string | null>(null);
  const [BuzzerStatus, setBuzzerStatus] = useState<string | null>(null);
  const [Side_Stand_Ack, setSide_Stand_Ack] = useState<string | null>(null);
  const [Direction_Ack, setDirection_Ack] = useState<string | null>(null);
  const [Ride_Ack, setRide_Ack] = useState<string | null>(null);
  const [Hill_hold_Ack, setHill_hold_Ack] = useState<string | null>(null);
  const [Wakeup_Ack, setWakeup_Ack] = useState<string | null>(null);
  const [DriveError_Motor_hall, setDriveError_Motor_hall] = useState<string | null>(null);
  const [Motor_Stalling, setMotor_Stalling] = useState<string | null>(null);
  const [Motor_Phase_loss, setMotor_Phase_loss] = useState<string | null>(null);
  const [Controller_Over_Temeprature, setController_Over_Temeprature] = useState<string | null>(null);
  const [Motor_Over_Temeprature, setMotor_Over_Temeprature] = useState<string | null>(null);
  const [Throttle_Error, setThrottle_Error] = useState<string | null>(null);
  const [MOSFET_Protection, setMOSFET_Protection] = useState<string | null>(null);
  const [DriveStatus_Regenerative_Braking, setDriveStatus_Regenerative_Braking] = useState<string | null>(null);
  const [ModeR_Pulse, setModeR_Pulse] = useState<string | null>(null);
  const [ModeL_Pulse, setModeL_Pulse] = useState<string | null>(null);
  const [Brake_Pulse, setBrake_Pulse] = useState<string | null>(null);
  const [Park_Pulse, setPark_Pulse] = useState<string | null>(null);
  const [Reverse_Pulse, setReverse_Pulse] = useState<string | null>(null);
  const [SideStand_Pulse, setSideStand_Pulse] = useState<string | null>(null);
  const [ForwardParking_Mode_Ack, setForwardParking_Mode_Ack] = useState<string | null>(null);
  const [DriveError_Controller_OverVoltag, setDriveError_Controller_OverVoltag] = useState<string | null>(null);
  const [Controller_Undervoltage, setController_Undervoltage] = useState<string | null>(null);
  const [Overcurrent_Fault, setOvercurrent_Fault] = useState<string | null>(null);
  const [DriveStatus1_ride, setDriveStatus1_ride] = useState<string | null>(null);
  const [Wakeup_Request, setWakeup_Request] = useState<string | null>(null);
  const [Hill_Hold, setHill_Hold] = useState<string | null>(null);
  const [Reverse_REQUEST, setReverse_REQUEST] = useState<string | null>(null);
  const [Forward_parkingmode_REQUEST, setForward_parkingmode_REQUEST] = useState<string | null>(null);
  const [Side_stand_Req, setSide_stand_Req] = useState<string | null>(null);
  const [Battery_charge_logic, setBattery_charge_logic] = useState<string | null>(null);
  const [Remote_cutoff, setRemote_cutoff] = useState<string | null>(null);
  const [mode_limit, setmode_limit] = useState<string | null>(null);
  const [Geo_fencebuzzer, setGeo_fencebuzzer] = useState<string | null>(null);
  const [Holiday_mode, setHoliday_mode] = useState<string | null>(null);
  const [Service_request, setService_request] = useState<string | null>(null);

  const [Low_Mode_REQUEST, setLow_Mode_REQUEST] = useState<string | null>(null);
  const [Medium_Mode_REQUEST, setMedium_Mode_REQUEST] = useState<string | null>(null);
  const [User_defind_mode_High_REQUEST, setUser_defind_mode_High_REQUEST] = useState<string | null>(null);
  const [Limp_mode_REQUEST, setLimp_mode_REQUEST] = useState<string | null>(null);


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

  const [mode, setMode] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');  // State to manage selected category
 
  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';
 
  useEffect(() => {
    const setupSubscription = async () => {
      try {
        await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            // Proper handling of 'unknown' type error using type assertion
            Alert.alert("Subscription Error", `Error subscribing to characteristic: ${(error as Error).message}`);
            return;
          }
 
          if (characteristic?.value) {
            const data = Buffer.from(characteristic.value, 'base64').toString('hex');
            decodeData(data);
          }
        });
      } catch (error: any) {
        console.error("Failed to set up subscription:", error);
        // Proper handling of catch block error using type assertion
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };
 
    setupSubscription();
 
    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

  const three_bit_decode = (firstByteCheck: number, bytePosition: number, bit1: number, bit2: number, bit3: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck.toString().padStart(2, '0')) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        const resultBits = bits[7 - bit1] + bits[7 - bit2] + bits[7 - bit3];
        return parseInt(resultBits, 2);  // Convert to decimal to simplify switch-case logic
      }
      return null;
    }
  }
 
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

  const bit_decode = (firstByteCheck: string, bytePosition: number, bitPosition: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        return bits[7 - bitPosition] === '1' ? "ON" : "OFF";
      }
      return null;
    }
  }
  
  const decodeData = (data: string) => {

    // Annmon Part-1
    const cellVoltage01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    const cellVoltage02 = eight_bytes_decode('07', 0.0001, 9, 10)(data);
    const cellVoltage03 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
    const cellVoltage04 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
 
    const cellVoltage05 = eight_bytes_decode('10', 0.0001, 6, 7)(data);
    const cellVoltage06 = eight_bytes_decode('10', 0.0001, 8, 9)(data);
    const cellVoltage07 = eight_bytes_decode('10', 0.0001, 10, 11)(data);
    const cellVoltage08 = eight_bytes_decode('10', 0.0001, 12, 13)(data);
 
    const cellVoltage09 = eight_bytes_decode('08', 0.0001, 4, 5)(data);
    const cellVoltage10 = eight_bytes_decode('08', 0.0001, 6, 7)(data);
    const cellVoltage11 = eight_bytes_decode('08', 0.0001, 8, 9)(data);
    const cellVoltage12 = eight_bytes_decode('08', 0.0001, 10, 11)(data);
    const cellVoltage13 = eight_bytes_decode('08', 0.0001, 12, 13)(data);
    const cellVoltage14 = eight_bytes_decode('08', 0.0001, 14, 15)(data);
    const cellVoltage15 = eight_bytes_decode('08', 0.0001, 16, 17)(data);
    const cellVoltage16 = eight_bytes_decode('08', 0.0001, 18, 19)(data);
 
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

    const modeValue = three_bit_decode(2, 7, 2, 1, 0)(data);
    const newMode = (() => {
      switch (modeValue) {
        case 0b100: return "Eco Mode";
        case 0b010: return "Normal Mode";
        case 0b110: return "Fast Mode";
        default: return null;
      }
    })();

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
   
    if (cellVoltage01 !== null) setcellVol01(cellVoltage01);
    if (cellVoltage02 !== null) setcellVol02(cellVoltage02);
    if (cellVoltage03 !== null) setcellVol03(cellVoltage03);
    if (cellVoltage04 !== null) setcellVol04(cellVoltage04);
    if (cellVoltage05 !== null) setcellVol05(cellVoltage05);
    if (cellVoltage06 !== null) setcellVol06(cellVoltage06);
    if (cellVoltage07 !== null) setcellVol07(cellVoltage07);
    if (cellVoltage08 !== null) setcellVol08(cellVoltage08);
    if (cellVoltage09 !== null) setcellVol09(cellVoltage09);
    if (cellVoltage10 !== null) setcellVol10(cellVoltage10);
    if (cellVoltage11 !== null) setcellVol11(cellVoltage11);
    if (cellVoltage12 !== null) setcellVol12(cellVoltage12);
    if (cellVoltage13 !== null) setcellVol13(cellVoltage13);
    if (cellVoltage14 !== null) setcellVol14(cellVoltage14);
    if (cellVoltage15 !== null) setcellVol15(cellVoltage15);
    if (cellVoltage16 !== null) setcellVol16(cellVoltage16);
 
    if (MaxCellVol !== null) setMaxCellVol(MaxCellVol);
    if (MinCellVol !== null) setMinCellVol(MinCellVol);
    if (AvgCellVol !== null) setAvgCellVol(AvgCellVol);
    if (MaxVoltId !== null) setMaxVoltId(MaxVoltId);
    if (MinVoltId !== null) setMinVoltId(MinVoltId);
 
    if (PackVol !== null) setPackVol(PackVol);
 
    if (CycleCount !== null) setCycleCount(CycleCount);
    if (MaxTemp !== null) setMaxTemp(MaxTemp);
    if (MinTemp !== null) setMinTemp(MinTemp);
    if (CellVolMinMaxDev !== null) setCellVolMinMaxDev(CellVolMinMaxDev);
 
    if (SOC !== null) setSOC(SOC);
    if (SOCAh !== null) setSOCAh(SOCAh);
    if (SOH !== null) setSOH(SOH);
    if (BmsStatus !== null) setBmsStatus(BmsStatus);
    if (LedStatus !== null) setLedStatus(LedStatus);
    if (ActiveCellBalStatus !== null) setActiveCellBalStatus(ActiveCellBalStatus);
    if (BMS_Serial_No_MUX !== null) setBMS_Serial_No_MUX(BMS_Serial_No_MUX);
    if (BMS_Serial_No__1_7 !== null) setBMS_Serial_No__1_7(BMS_Serial_No__1_7);
    if (LatchProtection !== null) setLatchProtection(LatchProtection);
    if (LatchType !== null) setLatchType(LatchType);
    if (ChargerType !== null) setChargerType(ChargerType);
    if (PcbTemp !== null) setPcbTemp(PcbTemp);
    if (AfeTemp !== null) setAfeTemp(AfeTemp);
    if (CellChemType !== null) setCellChemType(CellChemType);
    if (Chg_Accumulative_Ah !== null) setChg_Accumulative_Ah(Chg_Accumulative_Ah);
    if (Dchg_Accumulative_Ah !== null) setDchg_Accumulative_Ah(Dchg_Accumulative_Ah);
    if (RefVol !== null) setRefVol(RefVol);
    if (_3v3Vol !== null) set_3v3Vol(_3v3Vol);
    if (_5vVol !== null) set_5vVol(_5vVol);
    if (_12vVol !== null) set_12vVol(_12vVol);
    if (Actual_SoC !== null) setActual_SoC(Actual_SoC);
    if (Usable_Capacity_Ah !== null) setUsable_Capacity_Ah(Usable_Capacity_Ah);
    if (ConfigVer !== null) setConfigVer(ConfigVer);
    if (InternalFWVer !== null) setInternalFWVer(InternalFWVer);
    if (InternalFWSubVer !== null) setInternalFWSubVer(InternalFWSubVer);
    if (BHB_66049 !== null) setBHB_66049(BHB_66049);
    if (PackCurr !== null) setPackCurr(PackCurr);
    if (MaxTemp !== null) setMaxTemp(MaxTemp);
    if (MinTemp !== null) setMinTemp(MinTemp);
    if (FetTemp !== null) setFetTemp(FetTemp);
    if (Temp1 !== null) setTemp1(Temp1);
    if (Temp2 !== null) setTemp2(Temp2);
    if (Temp3 !== null) setTemp3(Temp3);
    if (Temp4 !== null) setTemp4(Temp4);
    if (Temp5 !== null) setTemp5(Temp5);
    if (Temp6 !== null) setTemp6(Temp6);
    if (Temp7 !== null) setTemp7(Temp7);
    if (Temp8 !== null) setTemp8(Temp8);
 
    if (HwVer !== null) setHwVer(HwVer);
    if (FwVer !== null) setFwVer(FwVer);
    if (FWSubVer !== null) setFWSubVer(FWSubVer);
    if (BtStatus_NC0PSM1CC2CV3Finish4 !== null) setBtStatus_NC0PSM1CC2CV3Finish4(BtStatus_NC0PSM1CC2CV3Finish4);
    if (Bt_liveMsg1Temp !== null) setBt_liveMsg1Temp(Bt_liveMsg1Temp);
    if (Bt_liveMsg_soc !== null) setBt_liveMsg_soc(Bt_liveMsg_soc);
    if (BMS_status !== null) setBMS_status(BMS_status);
    if (Demand_voltage !== null) setDemand_voltage(Demand_voltage);
    if (Demand_Current !== null) setDemand_Current(Demand_Current);
    if (MaxChgVoltgae !== null) setMaxChgVoltgae(MaxChgVoltgae);
    if (MaxChgCurrent !== null) setMaxChgCurrent(MaxChgCurrent);
    if (ActualChgVoltage !== null) setActualChgVoltage(ActualChgVoltage);
    if (ActualChgCurrent !== null) setActualChgCurrent(ActualChgCurrent);
    if (Charging_end_cutoff_Curr !== null) setCharging_end_cutoff_Curr(Charging_end_cutoff_Curr);
    if (CHB_258 !== null) setCHB_258(CHB_258);
    if (ChgrNC0PSM1CC2CV3Finsh4 !== null) setChgrNC0PSM1CC2CV3Finsh4(ChgrNC0PSM1CC2CV3Finsh4);
    if (chgr_msg_temp !== null) setchgr_msg_temp(chgr_msg_temp);
    if (chgStatus_chg_idle !== null) setchgStatus_chg_idle(chgStatus_chg_idle);
    if (chgrLiveMsgChgVolt !== null) setchgrLiveMsgChgVolt(chgrLiveMsgChgVolt);
    if (chgrLiveMsgChgCurrent !== null) setchgrLiveMsgChgCurrent(chgrLiveMsgChgCurrent);
 
    if (MotorSpeed !== null) setMotorSpeed(MotorSpeed);
    if (BatteryVoltage !== null) setBatteryVoltage(BatteryVoltage);
    if (BatteryCurrent !== null) setBatteryCurrent(BatteryCurrent);
    if (AC_Current !== null) setAC_Current(AC_Current);
    if (AC_Voltage !== null) setAC_Voltage(AC_Voltage);
    if (Throttle !== null) setThrottle(Throttle);
    if (MCU_Temperature !== null) setMCU_Temperature(MCU_Temperature);
    if (Motor_Temperature !== null) setMotor_Temperature(Motor_Temperature);
    if (MCU_Fault_Code !== null) setMCU_Fault_Code(MCU_Fault_Code);
    if (MCU_ID !== null) setMCU_ID(MCU_ID);
    if (Cluster_heartbeat !== null) setCluster_heartbeat(Cluster_heartbeat);
    if (Odo_Cluster !== null) setOdo_Cluster(Odo_Cluster);
   
    if (IgnitionStatus !== null) setIgnitionStatus(IgnitionStatus);
    if (LoadDetection !== null) setLoadDetection(LoadDetection);
    if (Keystatus !== null) setKeystatus(Keystatus);
    if (keyevents !== null) setkeyevents(keyevents);
    if (CellUnderVolProt !== null) setCellUnderVolProt(CellUnderVolProt);
    if (CellOverVolProt !== null) setCellOverVolProt(CellOverVolProt);
    if (PackUnderVolProt !== null) setPackUnderVolProt(PackUnderVolProt);
    if (PackOverVolProt !== null) setPackOverVolProt(PackOverVolProt);
    if (ChgUnderTempProt !== null) setChgUnderTempProt(ChgUnderTempProt);
    if (ChgOverTempProt !== null) setChgOverTempProt(ChgOverTempProt);
    if (DchgUnderTempProt !== null) setDchgUnderTempProt(DchgUnderTempProt);
    if (DchgOverTempProt !== null) setDchgOverTempProt(DchgOverTempProt);
    if (CellOverDevProt !== null) setCellOverDevProt(CellOverDevProt);
    if (BattLowSocWarn !== null) setBattLowSocWarn(BattLowSocWarn);
    if (ChgOverCurrProt !== null) setChgOverCurrProt(ChgOverCurrProt);
    if (DchgOverCurrProt !== null) setDchgOverCurrProt(DchgOverCurrProt);
    if (CellUnderVolWarn !== null) setCellUnderVolWarn(CellUnderVolWarn);
    if (CellOverVolWarn !== null) setCellOverVolWarn(CellOverVolWarn);
    if (FetTempProt !== null) setFetTempProt(FetTempProt);
    if (ResSocProt !== null) setResSocProt(ResSocProt);
    if (FetFailure !== null) setFetFailure(FetFailure);
    if (TempSenseFault !== null) setTempSenseFault(TempSenseFault);
    if (PackUnderVolWarn !== null) setPackUnderVolWarn(PackUnderVolWarn);
    if (PackOverVolWarn !== null) setPackOverVolWarn(PackOverVolWarn);
    if (ChgUnderTempWarn !== null) setChgUnderTempWarn(ChgUnderTempWarn);
    if (ChgOverTempWarn !== null) setChgOverTempWarn(ChgOverTempWarn);
    if (DchgUnderTempWarn !== null) setDchgUnderTempWarn(DchgUnderTempWarn);
    if (DchgOverTempWarn !== null) setDchgOverTempWarn(DchgOverTempWarn);
    if (PreChgFetStatus !== null) setPreChgFetStatus(PreChgFetStatus);
    if (ChgFetStatus !== null) setChgFetStatus(ChgFetStatus);
    if (DchgFetStatus !== null) setDchgFetStatus(DchgFetStatus);
    if (ResStatus !== null) setResStatus(ResStatus);
    if (ShortCktProt !== null) setShortCktProt(ShortCktProt);
    if (DschgPeakProt !== null) setDschgPeakProt(DschgPeakProt);
    if (ChgAuth !== null) setChgAuth(ChgAuth);
    if (ChgPeakProt !== null) setChgPeakProt(ChgPeakProt);
    if (DI1 !== null) setDI1(DI1);
    if (DI2 !== null) setDI2(DI2);
    if (DO1 !== null) setDO1(DO1);
    if (DO2 !== null) setDO2(DO2);
    if (ChargerDetection !== null) setChargerDetection(ChargerDetection);
    if (CanCommDetection !== null) setCanCommDetection(CanCommDetection);
    if (CellBalFeatureStatus !== null) setCellBalFeatureStatus(CellBalFeatureStatus);
    if (ImmoChg !== null) setImmoChg(ImmoChg);
    if (ImmoDchg !== null) setImmoDchg(ImmoDchg);
    if (BuzzerStatus !== null) setBuzzerStatus(BuzzerStatus);
    if (Side_Stand_Ack !== null) setSide_Stand_Ack(Side_Stand_Ack);
    if (Direction_Ack !== null) setDirection_Ack(Direction_Ack);
    if (Ride_Ack !== null) setRide_Ack(Ride_Ack);
    if (Hill_hold_Ack !== null) setHill_hold_Ack(Hill_hold_Ack);
    if (Wakeup_Ack !== null) setWakeup_Ack(Wakeup_Ack);
    if (DriveError_Motor_hall !== null) setDriveError_Motor_hall(DriveError_Motor_hall);
    if (Motor_Stalling !== null) setMotor_Stalling(Motor_Stalling);
    if (Motor_Phase_loss !== null) setMotor_Phase_loss(Motor_Phase_loss);
    if (Controller_Over_Temeprature !== null) setController_Over_Temeprature(Controller_Over_Temeprature);
    if (Motor_Over_Temeprature !== null) setMotor_Over_Temeprature(Motor_Over_Temeprature);
    if (Throttle_Error !== null) setThrottle_Error(Throttle_Error);
    if (MOSFET_Protection !== null) setMOSFET_Protection(MOSFET_Protection);
    if (DriveStatus_Regenerative_Braking !== null) setDriveStatus_Regenerative_Braking(DriveStatus_Regenerative_Braking);
    if (ModeR_Pulse !== null) setModeR_Pulse(ModeR_Pulse);
    if (ModeL_Pulse !== null) setModeL_Pulse(ModeL_Pulse);
    if (Brake_Pulse !== null) setBrake_Pulse(Brake_Pulse);
    if (Park_Pulse !== null) setPark_Pulse(Park_Pulse);
    if (Reverse_Pulse !== null) setReverse_Pulse(Reverse_Pulse);
    if (SideStand_Pulse !== null) setSideStand_Pulse(SideStand_Pulse);
    if (ForwardParking_Mode_Ack !== null) setForwardParking_Mode_Ack(ForwardParking_Mode_Ack);
    if (DriveError_Controller_OverVoltag !== null) setDriveError_Controller_OverVoltag(DriveError_Controller_OverVoltag);
    if (Controller_Undervoltage !== null) setController_Undervoltage(Controller_Undervoltage);
    if (Overcurrent_Fault !== null) setOvercurrent_Fault(Overcurrent_Fault);
    if (DriveStatus1_ride !== null) setDriveStatus1_ride(DriveStatus1_ride);
    if (Wakeup_Request !== null) setWakeup_Request(Wakeup_Request);
    if (Hill_Hold !== null) setHill_Hold(Hill_Hold);
    if (Reverse_REQUEST !== null) setReverse_REQUEST(Reverse_REQUEST);
    if (Forward_parkingmode_REQUEST !== null) setForward_parkingmode_REQUEST(Forward_parkingmode_REQUEST);
    if (Side_stand_Req !== null) setSide_stand_Req(Side_stand_Req);
    if (Battery_charge_logic !== null) setBattery_charge_logic(Battery_charge_logic);
    if (Remote_cutoff !== null) setRemote_cutoff(Remote_cutoff);
    if (mode_limit !== null) setmode_limit(mode_limit);
    if (Geo_fencebuzzer !== null) setGeo_fencebuzzer(Geo_fencebuzzer);
    if (Holiday_mode !== null) setHoliday_mode(Holiday_mode);
    if (Service_request !== null) setService_request(Service_request);

    if (Low_Mode_REQUEST !== null) setLow_Mode_REQUEST(Low_Mode_REQUEST);
    if (Medium_Mode_REQUEST !== null) setMedium_Mode_REQUEST(Medium_Mode_REQUEST);
    if (User_defind_mode_High_REQUEST !== null) setUser_defind_mode_High_REQUEST(User_defind_mode_High_REQUEST);
    if (Limp_mode_REQUEST !== null) setLimp_mode_REQUEST(Limp_mode_REQUEST);

    if (ChargeSOP !== null) setChargeSOP(ChargeSOP);
    if (DchgSOP !== null) setDchgSOP(DchgSOP);
    if (Drive_Error_Flag !== null) setDrive_Error_Flag(Drive_Error_Flag);
    if (Set_Regen !== null) setSet_Regen(Set_Regen);
    if (DCcurrentlimit !== null) setDCcurrentlimit(DCcurrentlimit);
    if (Custom_freq !== null) setCustom_freq(Custom_freq);
    if (Custom_torque !== null) setCustom_torque(Custom_torque);
    if (Buffer_speed !== null) setBuffer_speed(Buffer_speed);
    if (Base_speed !== null) setBase_speed(Base_speed);
    if (Initial_torque !== null) setInitial_torque(Initial_torque);
    if (Final_torque !== null) setFinal_torque(Final_torque);
    if (Cluster_odo !== null) setCluster_odo(Cluster_odo);

    if (mode !== newMode) {  // Only update if different
      setMode(newMode);
    }

  };
  const filteredParameters = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const parameters = [
      {
        category: 'Battery',
        items: [
          // Battery
          { label: 'SOC', value: SOC, unit: '%' },
          { label: 'Temp1', value: Temp1 },
          { label: 'Temp2', value: Temp2 },
          { label: 'Temp3', value: Temp3 },
          { label: 'Temp4', value: Temp4 },
          { label: 'Temp5', value: Temp5 },
          { label: 'Temp6', value: Temp6 },
          { label: 'Temp7', value: Temp7 },
          { label: 'Temp8', value: Temp8 },
          { label: 'BatteryVoltage', value: BatteryVoltage, unit: 'V' },
          { label: 'BatteryCurrent', value: BatteryCurrent, unit: 'A' },
          { label: 'AC_Current', value: AC_Current, unit: 'A' },
          { label: 'AC_Voltage', value: AC_Voltage, unit: 'V' },
          { label: 'IgnitionStatus', value: IgnitionStatus },
          { label: 'Mode', value: mode },
          { label: 'CellVol01', value: cellVol01, unit: 'V' },
          { label: 'CellVol02', value: cellVol02, unit: 'V' },
          { label: 'CellVol03', value: cellVol03, unit: 'V' },
          { label: 'CellVol04', value: cellVol04, unit: 'V' },
          { label: 'CellVol05', value: cellVol05, unit: 'V' },
          { label: 'CellVol06', value: cellVol06, unit: 'V' },
          { label: 'CellVol07', value: cellVol07, unit: 'V' },
          { label: 'CellVol08', value: cellVol08, unit: 'V' },
          { label: 'CellVol09', value: cellVol09, unit: 'V' },
          { label: 'CellVol10', value: cellVol10, unit: 'V' },
          { label: 'CellVol11', value: cellVol11, unit: 'V' },
          { label: 'CellVol12', value: cellVol12, unit: 'V' },
          { label: 'CellVol13', value: cellVol13, unit: 'V' },
          { label: 'CellVol14', value: cellVol14, unit: 'V' },
          { label: 'CellVol15', value: cellVol15, unit: 'V' },
          { label: 'CellVol16', value: cellVol16, unit: 'V' },
          { label: 'MaxCellVol', value: MaxCellVol, unit: 'V' },
          { label: 'MinCellVol', value: MinCellVol, unit: 'V' },
          { label: 'AvgCellVol', value: AvgCellVol, unit: 'V' },
          { label: 'MaxVoltId', value: MaxVoltId },
          { label: 'MinVoltId', value: MinVoltId },
          { label: 'PackVol', value: PackVol, unit: 'V' },
          { label: 'CycleCount', value: CycleCount },
          { label: 'MaxTemp', value: MaxTemp, unit: '°C' },
          { label: 'MinTemp', value: MinTemp, unit: '°C' },
          { label: 'CellVolMinMaxDev', value: CellVolMinMaxDev, unit: 'V' },
          { label: 'SOCAh', value: SOCAh, unit: 'AH' },
          { label: 'SOH', value: SOH, unit: '%' },
          { label: 'BmsStatus', value: BmsStatus },
          { label: 'LedStatus', value: LedStatus },
          { label: 'ActiveCellBalStatus', value: ActiveCellBalStatus },
          { label: 'BMS Serial No MUX', value: BMS_Serial_No_MUX },
          { label: 'BMS Serial No 1-7', value: BMS_Serial_No__1_7 },
          { label: 'LatchProtection', value: LatchProtection },
          { label: 'LatchType', value: LatchType },
          { label: 'ChargerType', value: ChargerType },
          { label: 'PcbTemp', value: PcbTemp, unit: '°C' },
          { label: 'AfeTemp', value: AfeTemp, unit: '°C' },
          { label: 'CellChemType', value: CellChemType },
          { label: 'Chg Accumulative Ah', value: Chg_Accumulative_Ah, unit: 'AH' },
          { label: 'Dchg Accumulative Ah', value: Dchg_Accumulative_Ah, unit: 'AH' },
          { label: 'RefVol', value: RefVol, unit: 'V' },
          { label: '3.3V Vol', value: _3v3Vol, unit: 'V' },
          { label: '5V Vol', value: _5vVol, unit: 'V' },
          { label: '12V Vol', value: _12vVol, unit: 'V' },
          { label: 'Actual_SoC', value: Actual_SoC, unit: 'AH' },
          { label: 'Usable Capacity Ah', value: Usable_Capacity_Ah, unit: 'AH' },
          { label: 'ConfigVer', value: ConfigVer },
          { label: 'InternalFWVer', value: InternalFWVer },
          { label: 'InternalFWSubVer', value: InternalFWSubVer },
          { label: 'BHB 66049', value: BHB_66049 },
          { label: 'PackCurr', value: PackCurr },
          { label: 'FetTemp', value: FetTemp, unit: '°C' },
          { label: 'HwVer', value: HwVer },
          { label: 'FwVer', value: FwVer },
          { label: 'FWSubVer', value: FWSubVer },
          { label: 'BtStatus_NC0PSM1CC2CV3Finish4', value: BtStatus_NC0PSM1CC2CV3Finish4 },
          { label: 'Bt_liveMsg1Temp', value: Bt_liveMsg1Temp, unit: '°C' },
          { label: 'Bt_liveMsg_soc', value: Bt_liveMsg_soc, unit: '%' },
          { label: 'BMS_status', value: BMS_status },
          { label: 'Demand_voltage', value: Demand_voltage, unit: 'V' },
          { label: 'Demand_Current', value: Demand_Current, unit: 'A' },
          { label: 'MaxChgVoltgae', value: MaxChgVoltgae, unit: 'V' },
          { label: 'MaxChgCurrent', value: MaxChgCurrent, unit: 'A' },
          { label: 'ActualChgVoltage', value: ActualChgVoltage, unit: 'V' },
          { label: 'ActualChgCurrent', value: ActualChgCurrent, unit: 'A' },
          { label: 'Charging_end_cutoff_Curr', value: Charging_end_cutoff_Curr, unit: 'A' },
          { label: 'CHB_258', value: CHB_258 },
          { label: 'ChgrNC0PSM1CC2CV3Finsh4', value: ChgrNC0PSM1CC2CV3Finsh4 },
          { label: 'chgr_msg_temp', value: chgr_msg_temp, unit: '°C' },
          { label: 'chgStatus_chg_idle', value: chgStatus_chg_idle },
          { label: 'chgrLiveMsgChgVolt', value: chgrLiveMsgChgVolt, unit: 'V' },
          { label: 'chgrLiveMsgChgCurrent', value: chgrLiveMsgChgCurrent, unit: 'A' },
          { label: 'IgnitionStatus', value: IgnitionStatus },
          { label: 'LoadDetection', value: LoadDetection },
          { label: 'Keystatus', value: Keystatus },
          { label: 'keyevents', value: keyevents },
          { label: 'CellUnderVolProt', value: CellUnderVolProt },
          { label: 'CellOverVolProt', value: CellOverVolProt },
          { label: 'PackUnderVolProt', value: PackUnderVolProt },
          { label: 'PackOverVolProt', value: PackOverVolProt },
          { label: 'ChgUnderTempProt', value: ChgUnderTempProt },
          { label: 'ChgOverTempProt', value: ChgOverTempProt },
          { label: 'DchgUnderTempProt', value: DchgUnderTempProt },
          { label: 'DchgOverTempProt', value: DchgOverTempProt },
          { label: 'CellOverDevProt', value: CellOverDevProt },
          { label: 'BattLowSocWarn', value: BattLowSocWarn },
          { label: 'ChgOverCurrProt', value: ChgOverCurrProt },
          { label: 'DchgOverCurrProt', value: DchgOverCurrProt },
          { label: 'CellUnderVolWarn', value: CellUnderVolWarn },
          { label: 'CellOverVolWarn', value: CellOverVolWarn },
          { label: 'FetTempProt', value: FetTempProt },
          { label: 'ResSocProt', value: ResSocProt },
          { label: 'FetFailure', value: FetFailure },
          { label: 'TempSenseFault', value: TempSenseFault },
          { label: 'PackUnderVolWarn', value: PackUnderVolWarn },
          { label: 'PackOverVolWarn', value: PackOverVolWarn },
          { label: 'ChgUnderTempWarn', value: ChgUnderTempWarn },
          { label: 'ChgOverTempWarn', value: ChgOverTempWarn },
          { label: 'DchgUnderTempWarn', value: DchgUnderTempWarn },
          { label: 'DchgOverTempWarn', value: DchgOverTempWarn },
          { label: 'PreChgFetStatus', value: PreChgFetStatus },
          { label: 'ChgFetStatus', value: ChgFetStatus },
          { label: 'DchgFetStatus', value: DchgFetStatus },
          { label: 'ResStatus', value: ResStatus },
          { label: 'ShortCktProt', value: ShortCktProt },
          { label: 'DschgPeakProt', value: DschgPeakProt },
          { label: 'ChgAuth', value: ChgAuth },
          { label: 'ChgPeakProt', value: ChgPeakProt },
          { label: 'DI1', value: DI1 },
          { label: 'DI2', value: DI2 },
          { label: 'DO1', value: DO1 },
          { label: 'DO2', value: DO2 },
          { label: 'ChargerDetection', value: ChargerDetection },
          { label: 'CanCommDetection', value: CanCommDetection },
          { label: 'CellBalFeatureStatus', value: CellBalFeatureStatus },
          { label: 'ImmoChg', value: ImmoChg },
          { label: 'ImmoDchg', value: ImmoDchg },
          { label: 'BuzzerStatus', value: BuzzerStatus },
          { label: 'Remote_cutoff', value: Remote_cutoff },
          { label: 'mode_limit', value: mode_limit },
          { label: 'Geo_fencebuzzer', value: Geo_fencebuzzer },
          { label: 'Holiday_mode', value: Holiday_mode },
          { label: 'ChargeSOP', value: ChargeSOP },
          { label: 'DchgSOP', value: DchgSOP },
          { label: 'Drive_Error_Flag', value: Drive_Error_Flag },
        ]
      },
      {
        category: 'MCU',
        items: [
          // MCU
          { label: 'MotorSpeed', value: MotorSpeed, unit: 'RPM' },
          { label: 'Throttle', value: Throttle, unit: '%' },
          { label: 'MCU_Temperature', value: MCU_Temperature, unit: '°C' },
          { label: 'Motor_Temperature', value: Motor_Temperature, unit: '°C' },
          { label: 'Side_Stand_Ack', value: Side_Stand_Ack },
          { label: 'MCU_Fault_Code', value: MCU_Fault_Code },
          { label: 'MCU_ID', value: MCU_ID },
          { label: 'Side_Stand_Ack', value: Side_Stand_Ack },
          { label: 'Direction_Ack', value: Direction_Ack },
          { label: 'Ride_Ack', value: Ride_Ack },
          { label: 'Hill_hold_Ack', value: Hill_hold_Ack },
          { label: 'Wakeup_Ack', value: Wakeup_Ack },
          { label: 'DriveError_Motor_hall', value: DriveError_Motor_hall },
          { label: 'Motor_Stalling', value: Motor_Stalling },
          { label: 'Motor_Phase_loss', value: Motor_Phase_loss },
          { label: 'Controller_Over_Temeprature', value: Controller_Over_Temeprature },
          { label: 'Motor_Over_Temeprature', value: Motor_Over_Temeprature },
          { label: 'Throttle_Error', value: Throttle_Error },
          { label: 'MOSFET_Protection', value: MOSFET_Protection },
          { label: 'DriveStatus_Regenerative_Braking', value: DriveStatus_Regenerative_Braking },
          { label: 'ModeR_Pulse', value: ModeR_Pulse },
          { label: 'ModeL_Pulse', value: ModeL_Pulse },
          { label: 'Brake_Pulse', value: Brake_Pulse },
          { label: 'Park_Pulse', value: Park_Pulse },
          { label: 'Reverse_Pulse', value: Reverse_Pulse },
          { label: 'SideStand_Pulse', value: SideStand_Pulse },
          { label: 'ForwardParking_Mode_Ack', value: ForwardParking_Mode_Ack },
          { label: 'DriveError_Controller_OverVoltag', value: DriveError_Controller_OverVoltag },
          { label: 'Controller_Undervoltage', value: Controller_Undervoltage },
          { label: 'Overcurrent_Fault', value: Overcurrent_Fault },
          { label: 'DriveStatus1_ride', value: DriveStatus1_ride },
          { label: 'Wakeup_Request', value: Wakeup_Request },
          { label: 'Hill_Hold', value: Hill_Hold },
          { label: 'Reverse_REQUEST', value: Reverse_REQUEST },
          { label: 'Forward_parkingmode_REQUEST', value: Forward_parkingmode_REQUEST },
          { label: 'Side_stand_Req', value: Side_stand_Req },
          { label: 'Set_Regen', value: Set_Regen },
          { label: 'DCcurrentlimit', value: DCcurrentlimit, unit: 'A' },
          { label: 'Custom_freq', value: Custom_freq, unit: 'Hz' },
          { label: 'Custom_torque', value: Custom_torque, unit: 'Nm' },
          { label: 'Buffer_speed', value: Buffer_speed, unit: 'RPM' },
          { label: 'Base_speed', value: Base_speed, unit: 'RPM' },
          { label: 'Initial_torque', value: Initial_torque, unit: 'Nm' },
          { label: 'Final_torque', value: Final_torque, unit: 'Nm' },
          { label: 'Cluster_odo', value: Cluster_odo, unit: 'km' },
          { label: 'Low_Mode_REQUEST', value: Low_Mode_REQUEST },
          { label: 'Medium_Mode_REQUEST', value: Medium_Mode_REQUEST },
          { label: 'User_defined_mode_High_REQUEST', value: User_defind_mode_High_REQUEST },
          { label: 'Limp_mode_REQUEST', value: Limp_mode_REQUEST },
        ]
      },
      {
        category: 'VCU',
        items: [
          // VCU
          { label: 'Cluster_heartbeat', value: Cluster_heartbeat },
          { label: 'Odo_Cluster', value: Odo_Cluster, unit: 'km' },
        ]
      },
      {
        category: 'IOT',
        items: [
          // IOT
          { label: 'Battery_charge_logic', value: Battery_charge_logic },
          { label: 'Service_request', value: Service_request },
        ]
      }
    ]
     // Filter by search term and selected category
     return parameters
     .filter(group => selectedCategory === 'All' || group.category === selectedCategory) // Filter by category
     .map(group => ({
       ...group,
       items: group.items.filter(param => param.label.toLowerCase().includes(lowercasedSearchTerm))
     }))
     .filter(group => group.items.length > 0);

  };
  
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Parameters"
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
        
        {/* Category Dropdown */}
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Categories" value="All" />
          <Picker.Item label="Battery" value="Battery" />
          <Picker.Item label="MCU" value="MCU" />
          <Picker.Item label="VCU" value="VCU" />
          <Picker.Item label="IOT" value="IOT" />
        </Picker>

        {filteredParameters().map((paramGroup, index) => (
          <View key={index}>
            <Text style={styles.categoryText}>{paramGroup.category}</Text>
            {paramGroup.items.map((item, idx) => (
              item.value !== null && (
                <Text key={idx} style={styles.parameterText}>
                  {item.label}: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value} {item.unit || ''}
                </Text>
              )
            ))}
          </View>
        ))}
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
  parameterText: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    fontSize: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    color: '#333',
    width: '100%',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default DataTransfer;