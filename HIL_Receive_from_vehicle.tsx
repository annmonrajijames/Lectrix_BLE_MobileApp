import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
 
type RootStackParamList = {
  HIL_Receive_from_vehicle: { device: Device };
};
 
type HIL_Receive_from_vehicleProps = NativeStackScreenProps<RootStackParamList, 'HIL_Receive_from_vehicle'>;
 
const HIL_Receive_from_vehicle: React.FC<HIL_Receive_from_vehicleProps> = ({ route }) => {
  const { device } = route.params;
  const [cellVol01, setCellVol01] = useState<number | null>(null);
  const [cellVol02, setCellVol02] = useState<number | null>(null);
  const [cellVol03, setCellVol03] = useState<number | null>(null);
  const [cellVol04, setCellVol04] = useState<number | null>(null);
  const [cellVol05, setCellVol05] = useState<number | null>(null);
  const [cellVol06, setCellVol06] = useState<number | null>(null);
  const [cellVol07, setCellVol07] = useState<number | null>(null);
  const [cellVol08, setCellVol08] = useState<number | null>(null);
  const [cellVol09, setCellVol09] = useState<number | null>(null);
  const [cellVol10, setCellVol10] = useState<number | null>(null);
  const [cellVol11, setCellVol11] = useState<number | null>(null);
  const [cellVol12, setCellVol12] = useState<number | null>(null);
  const [cellVol13, setCellVol13] = useState<number | null>(null);
  const [cellVol14, setCellVol14] = useState<number | null>(null);
  const [cellVol15, setCellVol15] = useState<number | null>(null);
  const [cellVol16, setCellVol16] = useState<number | null>(null);
 
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
  const [CellUnerVolWarn, setCellUnerVolWarn] = useState<string | null>(null);
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
  const bit_decode = (firstByteCheck: number, bytePosition: number, bitPosition: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck.toString()) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        return bits[7 - bitPosition] === '1' ? "ON" : "OFF";
      }
      return null;
    }
  }
  const decodeData = (data: string) => {
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
    const PcbTemp = eight_bytes_decode('11', 1 , 14)(data);
    const AfeTemp = eight_bytes_decode('11', 1 , 15)(data);
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
 
    const IgnitionStatus = bit_decode(11, 18, 0)(data);
    const LoadDetection = bit_decode(11, 18, 6)(data);
 
    //18F20310
    const Keystatus = bit_decode(11, 19, 0)(data);
   
    // 18F20314
    const keyevents = bit_decode(6, 18, 1)(data);
    // 0x9
    const CellUnderVolProt = bit_decode(10, 14, 0)(data);
    const CellOverVolProt = bit_decode(10, 14, 1)(data);
    const PackUnderVolProt = bit_decode(10, 14, 2)(data);
    const PackOverVolProt = bit_decode(10, 14, 3)(data);
    const ChgUnderTempProt = bit_decode(10, 14, 4)(data);
    const ChgOverTempProt = bit_decode(10, 14, 5)(data);
    const DchgUnderTempProt = bit_decode(10, 14, 6)(data);
    const DchgOverTempProt = bit_decode(10, 14, 7)(data);
    const CellOverDevProt = bit_decode(10, 15, 0)(data);
    const BattLowSocWarn = bit_decode(10, 15, 1)(data);
    const ChgOverCurrProt = bit_decode(10, 15, 2)(data);
    const DchgOverCurrProt = bit_decode(10, 15, 3)(data);
    const CellUnerVolWarn = bit_decode(10, 15, 4)(data);
    const CellOverVolWarn = bit_decode(10, 15, 5)(data);
    const FetTempProt = bit_decode(10, 15, 6)(data);
    const ResSocProt = bit_decode(10, 15, 7)(data);
    const FetFailure = bit_decode(10, 16, 0)(data);
    const TempSenseFault = bit_decode(10, 16, 1)(data);
    const PackUnderVolWarn = bit_decode(10, 16, 2)(data);
    const PackOverVolWarn = bit_decode(10, 16, 3)(data);
    const ChgUnderTempWarn = bit_decode(10, 16, 4)(data);
    const ChgOverTempWarn = bit_decode(10, 16, 5)(data);
    const DchgUnderTempWarn = bit_decode(10, 16, 6)(data);
    const DchgOverTempWarn = bit_decode(10, 16, 7)(data);
    const PreChgFetStatus = bit_decode(11, 2, 0)(data);
    const ChgFetStatus = bit_decode(11, 2, 1)(data);
    const DchgFetStatus = bit_decode(11, 2, 2)(data);
    const ResStatus = bit_decode(11, 2, 3)(data);
    const ShortCktProt = bit_decode(11, 2, 7)(data);
    const DschgPeakProt = bit_decode(11, 2, 6)(data);
    const ChgAuth = bit_decode(11, 2, 4)(data);
    const ChgPeakProt = bit_decode(11, 2, 5)(data);
   
    // 0xC
    const DI1 = bit_decode(11, 18, 1)(data);
    const DI2 = bit_decode(11, 18, 2)(data);
    const DO1 = bit_decode(11, 18, 3)(data);
    const DO2 = bit_decode(11, 18, 4)(data);
    const ChargerDetection = bit_decode(11, 18, 5)(data);
    const CanCommDetection = bit_decode(11, 18, 7)(data);
    const CellBalFeatureStatus = bit_decode(11, 16, 0)(data);
    const ImmoChg = bit_decode(11, 16, 1)(data);
    const ImmoDchg = bit_decode(11, 16, 2)(data);
    const BuzzerStatus = bit_decode(11, 16, 3)(data);
   
    // 18530902
    const Side_Stand_Ack = bit_decode(2, 7, 3)(data);
    const Direction_Ack = bit_decode(2, 7, 4)(data);
    const Ride_Ack = bit_decode(2, 7, 5)(data);
    const Hill_hold_Ack = bit_decode(2, 7, 6)(data);
    const Wakeup_Ack = bit_decode(2, 7, 7)(data);
    const DriveError_Motor_hall = bit_decode(2, 8, 0)(data);
    const Motor_Stalling = bit_decode(2, 8, 1)(data);
    const Motor_Phase_loss = bit_decode(2, 8, 2)(data);
    const Controller_Over_Temeprature = bit_decode(2, 8, 3)(data);
    const Motor_Over_Temeprature = bit_decode(2, 8, 4)(data);
    const Throttle_Error = bit_decode(2, 8, 5)(data);
    const MOSFET_Protection = bit_decode(2, 8, 6)(data);
    const DriveStatus_Regenerative_Braking = bit_decode(2, 9, 0)(data);
    const ModeR_Pulse = bit_decode(2, 9, 1)(data);
    const ModeL_Pulse = bit_decode(2, 9, 2)(data);
    const Brake_Pulse = bit_decode(2, 9, 3)(data);
    const Park_Pulse = bit_decode(2, 9, 4)(data);
    const Reverse_Pulse = bit_decode(2, 9, 5)(data);
    const SideStand_Pulse = bit_decode(2, 9, 6)(data);
    const ForwardParking_Mode_Ack = bit_decode(2, 9, 7)(data);
    const DriveError_Controller_OverVoltag = bit_decode(2, 10, 0)(data);
    const Controller_Undervoltage = bit_decode(2, 10, 1)(data);
    const Overcurrent_Fault = bit_decode(2, 10, 2)(data);
   
    // 18F20309
    const DriveStatus1_ride = bit_decode(3, 11, 0)(data);
    const Wakeup_Request = bit_decode(3, 11, 2)(data);
    const Hill_Hold = bit_decode(3, 11, 3)(data);
    const Reverse_REQUEST = bit_decode(3, 12, 0)(data);
    const Forward_parkingmode_REQUEST = bit_decode(3, 12, 1)(data);
    const Side_stand_Req = bit_decode(3, 11, 1)(data);
   
    // 18F20316
    const Battery_charge_logic = bit_decode(5, 16, 1)(data);
   
    //18F60101
    const Remote_cutoff = bit_decode(6, 2, 0)(data);
    const mode_limit = bit_decode(6, 2, 1)(data);
    const Geo_fencebuzzer = bit_decode(6, 2, 2)(data);
    const Holiday_mode = bit_decode(6, 2, 3)(data);
    const Service_request = bit_decode(6, 2, 4)(data);
   
   
    if (cellVoltage01 !== null) setCellVol01(cellVoltage01);
    if (cellVoltage02 !== null) setCellVol02(cellVoltage02);
    if (cellVoltage03 !== null) setCellVol03(cellVoltage03);
    if (cellVoltage04 !== null) setCellVol04(cellVoltage04);
    if (cellVoltage05 !== null) setCellVol05(cellVoltage05);
    if (cellVoltage06 !== null) setCellVol06(cellVoltage06);
    if (cellVoltage07 !== null) setCellVol07(cellVoltage07);
    if (cellVoltage08 !== null) setCellVol08(cellVoltage08);
    if (cellVoltage09 !== null) setCellVol09(cellVoltage09);
    if (cellVoltage10 !== null) setCellVol10(cellVoltage10);
    if (cellVoltage11 !== null) setCellVol11(cellVoltage11);
    if (cellVoltage12 !== null) setCellVol12(cellVoltage12);
    if (cellVoltage13 !== null) setCellVol13(cellVoltage13);
    if (cellVoltage14 !== null) setCellVol14(cellVoltage14);
    if (cellVoltage15 !== null) setCellVol15(cellVoltage15);
    if (cellVoltage16 !== null) setCellVol16(cellVoltage16);
 
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
    if (CellUnerVolWarn !== null) setCellUnerVolWarn(CellUnerVolWarn);
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
 
  };
 
 
 
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {cellVol01 !== null && <Text style={styles.parameterText}>cellVol01: {cellVol01.toFixed(4)} V</Text>}
        {cellVol02 !== null && <Text style={styles.parameterText}>cellVol02: {cellVol02.toFixed(4)} V</Text>}
        {cellVol03 !== null && <Text style={styles.parameterText}>cellVol03: {cellVol03.toFixed(4)} V</Text>}
        {cellVol04 !== null && <Text style={styles.parameterText}>cellVol04: {cellVol04.toFixed(4)} V</Text>}
        {cellVol05 !== null && <Text style={styles.parameterText}>cellVol05: {cellVol05.toFixed(4)} V</Text>}
        {cellVol06 !== null && <Text style={styles.parameterText}>cellVol06: {cellVol06.toFixed(4)} V</Text>}
        {cellVol07 !== null && <Text style={styles.parameterText}>cellVol07: {cellVol07.toFixed(4)} V</Text>}
        {cellVol08 !== null && <Text style={styles.parameterText}>cellVol08: {cellVol08.toFixed(4)} V</Text>}
        {cellVol09 !== null && <Text style={styles.parameterText}>cellVol09: {cellVol09.toFixed(4)} V</Text>}
        {cellVol10 !== null && <Text style={styles.parameterText}>cellVol10: {cellVol10.toFixed(4)} V</Text>}
        {cellVol11 !== null && <Text style={styles.parameterText}>cellVol11: {cellVol11.toFixed(4)} V</Text>}
        {cellVol12 !== null && <Text style={styles.parameterText}>cellVol12: {cellVol12.toFixed(4)} V</Text>}
        {cellVol13 !== null && <Text style={styles.parameterText}>cellVol13: {cellVol13.toFixed(4)} V</Text>}
        {cellVol14 !== null && <Text style={styles.parameterText}>cellVol14: {cellVol14.toFixed(4)} V</Text>}
        {cellVol15 !== null && <Text style={styles.parameterText}>cellVol15: {cellVol15.toFixed(4)} V</Text>}
        {cellVol16 !== null && <Text style={styles.parameterText}>cellVol16: {cellVol16.toFixed(4)} V</Text>}
 
        {MaxCellVol !== null && <Text style={styles.parameterText}>MaxCellVol: {MaxCellVol.toFixed(4)} V</Text>}
        {MinCellVol !== null && <Text style={styles.parameterText}>MinCellVol: {MinCellVol.toFixed(4)} V</Text>}
        {AvgCellVol !== null && <Text style={styles.parameterText}>AvgCellVol: {AvgCellVol.toFixed(4)} V</Text>}
        {MaxVoltId !== null && <Text style={styles.parameterText}>MaxVoltId: {MaxVoltId.toFixed(4)}</Text>}
        {MinVoltId !== null && <Text style={styles.parameterText}>MinVoltId: {MinVoltId.toFixed(4)}</Text>}
 
        {PackVol !== null && <Text style={styles.parameterText}>PackVol: {PackVol.toFixed(4)} V</Text>}
 
        {CycleCount !== null && <Text style={styles.parameterText}>CycleCount: {CycleCount.toFixed(4)} V</Text>}
        {MaxTemp !== null && <Text style={styles.parameterText}>MaxTemp: {MaxTemp.toFixed(4)} C</Text>}
        {MinTemp !== null && <Text style={styles.parameterText}>MinTemp: {MinTemp.toFixed(4)} C</Text>}
        {CellVolMinMaxDev !== null && <Text style={styles.parameterText}>CellVolMinMaxDev: {CellVolMinMaxDev.toFixed(4)} V</Text>}
 
        {SOC !== null && <Text style={styles.parameterText}>SOC: {SOC.toFixed(4)} %</Text>}
        {SOCAh !== null && <Text style={styles.parameterText}>SOCAh: {SOCAh.toFixed(4)} AH</Text>}
        {SOH !== null && <Text style={styles.parameterText}>SOH: {SOH.toFixed(4)} %</Text>}
        {BmsStatus !== null && <Text style={styles.parameterText}>BmsStatus: {BmsStatus.toFixed(4)} </Text>}
        {LedStatus !== null && <Text style={styles.parameterText}>LedStatus: {LedStatus.toFixed(4)}</Text>}
        {ActiveCellBalStatus !== null && <Text style={styles.parameterText}>ActiveCellBalStatus: {ActiveCellBalStatus.toFixed(4)}</Text>}
        {BMS_Serial_No_MUX !== null && <Text style={styles.parameterText}>BMS Serial No MUX: {BMS_Serial_No_MUX.toFixed(4)}</Text>}
        {BMS_Serial_No__1_7 !== null && <Text style={styles.parameterText}>BMS Serial No 1-7: {BMS_Serial_No__1_7.toFixed(4)}</Text>}
        {LatchProtection !== null && <Text style={styles.parameterText}>LatchProtection: {LatchProtection.toFixed(4)}</Text>}
        {LatchType !== null && <Text style={styles.parameterText}>LatchType: {LatchType.toFixed(4)}</Text>}
        {ChargerType !== null && <Text style={styles.parameterText}>ChargerType: {ChargerType.toFixed(4)}</Text>}
        {PcbTemp !== null && <Text style={styles.parameterText}>PcbTemp: {PcbTemp.toFixed(4)} °C</Text>}
        {AfeTemp !== null && <Text style={styles.parameterText}>AfeTemp: {AfeTemp.toFixed(4)} °C</Text>}
        {CellChemType !== null && <Text style={styles.parameterText}>CellChemType: {CellChemType.toFixed(4)}</Text>}
        {Chg_Accumulative_Ah !== null && <Text style={styles.parameterText}>Chg Accumulative Ah: {Chg_Accumulative_Ah.toFixed(4)} AH</Text>}
        {Dchg_Accumulative_Ah !== null && <Text style={styles.parameterText}>Dchg Accumulative Ah: {Dchg_Accumulative_Ah.toFixed(4)} AH</Text>}
        {RefVol !== null && <Text style={styles.parameterText}>RefVol: {RefVol.toFixed(4)} V</Text>}
        {_3v3Vol !== null && <Text style={styles.parameterText}>3.3V Vol: {_3v3Vol.toFixed(4)} V</Text>}
        {_5vVol !== null && <Text style={styles.parameterText}>5V Vol: {_5vVol.toFixed(4)} V</Text>}
        {_12vVol !== null && <Text style={styles.parameterText}>12V Vol: {_12vVol.toFixed(4)} V</Text>}
        {Actual_SoC !== null && <Text style={styles.parameterText}>Actual_SoC: {Actual_SoC.toFixed(4)} AH</Text>}
        {Usable_Capacity_Ah !== null && <Text style={styles.parameterText}>Usable Capacity Ah: {Usable_Capacity_Ah.toFixed(4)} AH</Text>}
        {ConfigVer !== null && <Text style={styles.parameterText}>ConfigVer: {ConfigVer.toFixed(4)}</Text>}
        {InternalFWVer !== null && <Text style={styles.parameterText}>InternalFWVer: {InternalFWVer.toFixed(4)}</Text>}
        {InternalFWSubVer !== null && <Text style={styles.parameterText}>InternalFWSubVer: {InternalFWSubVer.toFixed(4)}</Text>}
        {BHB_66049 !== null && <Text style={styles.parameterText}>BHB 66049: {BHB_66049.toFixed(4)}</Text>}
        {PackCurr !== null && <Text style={styles.parameterText}>PackCurr: {PackCurr.toFixed(4)}</Text>}
        {MaxTemp !== null && <Text style={styles.parameterText}>MaxTemp: {MaxTemp.toFixed(4)}</Text>}
        {MinTemp !== null && <Text style={styles.parameterText}>MinTemp: {MinTemp.toFixed(4)}</Text>}
        {FetTemp !== null && <Text style={styles.parameterText}>FetTemp: {FetTemp.toFixed(4)}</Text>}
        {Temp1 !== null && <Text style={styles.parameterText}>Temp1: {Temp1.toFixed(4)}</Text>}
        {Temp2 !== null && <Text style={styles.parameterText}>Temp2: {Temp2.toFixed(4)}</Text>}
        {Temp3 !== null && <Text style={styles.parameterText}>Temp3: {Temp3.toFixed(4)}</Text>}
        {Temp4 !== null && <Text style={styles.parameterText}>Temp4: {Temp4.toFixed(4)}</Text>}
        {Temp5 !== null && <Text style={styles.parameterText}>Temp5: {Temp5.toFixed(4)}</Text>}
        {Temp6 !== null && <Text style={styles.parameterText}>Temp6: {Temp6.toFixed(4)}</Text>}
        {Temp7 !== null && <Text style={styles.parameterText}>Temp7: {Temp7.toFixed(4)}</Text>}
        {Temp8 !== null && <Text style={styles.parameterText}>Temp8: {Temp8.toFixed(4)}</Text>}
 
        {HwVer !== null && <Text style={styles.parameterText}>HwVer: {HwVer.toFixed(2)}</Text>}
        {FwVer !== null && <Text style={styles.parameterText}>FwVer: {FwVer.toFixed(2)}</Text>}
        {FWSubVer !== null && <Text style={styles.parameterText}>FWSubVer: {FWSubVer.toFixed(2)}</Text>}
        {BtStatus_NC0PSM1CC2CV3Finish4 !== null && <Text style={styles.parameterText}>BtStatus_NC0PSM1CC2CV3Finish4: {BtStatus_NC0PSM1CC2CV3Finish4}</Text>}
        {Bt_liveMsg1Temp !== null && <Text style={styles.parameterText}>Bt_liveMsg1Temp: {Bt_liveMsg1Temp.toFixed(1)} °C</Text>}
        {Bt_liveMsg_soc !== null && <Text style={styles.parameterText}>Bt_liveMsg_soc: {Bt_liveMsg_soc.toFixed(2)}%</Text>}
        {BMS_status !== null && <Text style={styles.parameterText}>BMS_status: {BMS_status}</Text>}
        {Demand_voltage !== null && <Text style={styles.parameterText}>Demand_voltage: {Demand_voltage.toFixed(2)} V</Text>}
        {Demand_Current !== null && <Text style={styles.parameterText}>Demand_Current: {Demand_Current.toFixed(2)} A</Text>}
        {MaxChgVoltgae !== null && <Text style={styles.parameterText}>MaxChgVoltgae: {MaxChgVoltgae.toFixed(2)} V</Text>}
        {MaxChgCurrent !== null && <Text style={styles.parameterText}>MaxChgCurrent: {MaxChgCurrent.toFixed(2)} A</Text>}
        {ActualChgVoltage !== null && <Text style={styles.parameterText}>ActualChgVoltage: {ActualChgVoltage.toFixed(2)} V</Text>}
        {ActualChgCurrent !== null && <Text style={styles.parameterText}>ActualChgCurrent: {ActualChgCurrent.toFixed(2)} A</Text>}
        {Charging_end_cutoff_Curr !== null && <Text style={styles.parameterText}>Charging_end_cutoff_Curr: {Charging_end_cutoff_Curr.toFixed(2)} A</Text>}
        {CHB_258 !== null && <Text style={styles.parameterText}>CHB_258: {CHB_258}</Text>}
        {ChgrNC0PSM1CC2CV3Finsh4 !== null && <Text style={styles.parameterText}>ChgrNC0PSM1CC2CV3Finsh4: {ChgrNC0PSM1CC2CV3Finsh4}</Text>}
        {chgr_msg_temp !== null && <Text style={styles.parameterText}>chgr_msg_temp: {chgr_msg_temp.toFixed(1)} °C</Text>}
        {chgStatus_chg_idle !== null && <Text style={styles.parameterText}>chgStatus_chg_idle: {chgStatus_chg_idle}</Text>}
        {chgrLiveMsgChgVolt !== null && <Text style={styles.parameterText}>chgrLiveMsgChgVolt: {chgrLiveMsgChgVolt.toFixed(2)} V</Text>}
        {chgrLiveMsgChgCurrent !== null && <Text style={styles.parameterText}>chgrLiveMsgChgCurrent: {chgrLiveMsgChgCurrent.toFixed(2)} A</Text>}
 
        {MotorSpeed !== null && <Text style={styles.parameterText}>MotorSpeed: {MotorSpeed.toFixed(2)} RPM</Text>}
        {BatteryVoltage !== null && <Text style={styles.parameterText}>BatteryVoltage: {BatteryVoltage.toFixed(2)} V</Text>}
        {BatteryCurrent !== null && <Text style={styles.parameterText}>BatteryCurrent: {BatteryCurrent.toFixed(2)} A</Text>}
        {AC_Current !== null && <Text style={styles.parameterText}>AC_Current: {AC_Current.toFixed(2)} A</Text>}
        {AC_Voltage !== null && <Text style={styles.parameterText}>AC_Voltage: {AC_Voltage.toFixed(2)} V</Text>}
        {Throttle !== null && <Text style={styles.parameterText}>Throttle: {Throttle.toFixed(2)}%</Text>}
        {MCU_Temperature !== null && <Text style={styles.parameterText}>MCU_Temperature: {MCU_Temperature.toFixed(1)}°C</Text>}
        {Motor_Temperature !== null && <Text style={styles.parameterText}>Motor_Temperature: {Motor_Temperature.toFixed(1)}°C</Text>}
        {MCU_Fault_Code !== null && <Text style={styles.parameterText}>MCU_Fault_Code: {MCU_Fault_Code}</Text>}
        {MCU_ID !== null && <Text style={styles.parameterText}>MCU ID: {MCU_ID}</Text>}
        {Cluster_heartbeat !== null && <Text style={styles.parameterText}>Cluster_heartbeat: {Cluster_heartbeat}</Text>}
        {Odo_Cluster !== null && <Text style={styles.parameterText}>Odo_Cluster: {Odo_Cluster} km</Text>}
 
        {IgnitionStatus !== null && <Text style={styles.parameterText}>IgnitionStatus: {IgnitionStatus}</Text>}
        {LoadDetection !== null && <Text style={styles.parameterText}>LoadDetection: {LoadDetection}</Text>}
        {Keystatus !== null && <Text style={styles.parameterText}>Keystatus: {Keystatus}</Text>}
        {keyevents !== null && <Text style={styles.parameterText}>keyevents: {keyevents}</Text>}
        {CellUnderVolProt !== null && <Text style={styles.parameterText}>CellUnderVolProt: {CellUnderVolProt}</Text>}
        {CellOverVolProt !== null && <Text style={styles.parameterText}>CellOverVolProt: {CellOverVolProt}</Text>}
        {PackUnderVolProt !== null && <Text style={styles.parameterText}>PackUnderVolProt: {PackUnderVolProt}</Text>}
        {PackOverVolProt !== null && <Text style={styles.parameterText}>PackOverVolProt: {PackOverVolProt}</Text>}
        {ChgUnderTempProt !== null && <Text style={styles.parameterText}>ChgUnderTempProt: {ChgUnderTempProt}</Text>}
        {ChgOverTempProt !== null && <Text style={styles.parameterText}>ChgOverTempProt: {ChgOverTempProt}</Text>}
        {DchgUnderTempProt !== null && <Text style={styles.parameterText}>DchgUnderTempProt: {DchgUnderTempProt}</Text>}
        {DchgOverTempProt !== null && <Text style={styles.parameterText}>DchgOverTempProt: {DchgOverTempProt}</Text>}
        {CellOverDevProt !== null && <Text style={styles.parameterText}>DchgOverTempProt: {DchgOverTempProt}</Text>}
        {BattLowSocWarn !== null && <Text style={styles.parameterText}>Battery Low SOC Warning: {BattLowSocWarn}</Text>}
        {ChgOverCurrProt !== null && <Text style={styles.parameterText}>BattLowSocWarn: {ChgOverCurrProt}</Text>}
        {DchgOverCurrProt !== null && <Text style={styles.parameterText}>DchgOverCurrProt: {DchgOverCurrProt}</Text>}
        {CellUnerVolWarn !== null && <Text style={styles.parameterText}>CellUnerVolWarn: {CellUnerVolWarn}</Text>}
        {CellOverVolWarn !== null && <Text style={styles.parameterText}>CellOverVolWarn: {CellOverVolWarn}</Text>}
        {FetTempProt !== null && <Text style={styles.parameterText}>FetTempProt: {FetTempProt}</Text>}
        {ResSocProt !== null && <Text style={styles.parameterText}>ResSocProt: {ResSocProt}</Text>}
        {FetFailure !== null && <Text style={styles.parameterText}>FetFailure: {FetFailure}</Text>}
        {TempSenseFault !== null && <Text style={styles.parameterText}>TempSenseFault: {TempSenseFault}</Text>}
        {PackUnderVolWarn !== null && <Text style={styles.parameterText}>PackUnderVolWarn: {PackUnderVolWarn}</Text>}
        {PackOverVolWarn !== null && <Text style={styles.parameterText}>PackOverVolWarn: {PackOverVolWarn}</Text>}
        {ChgUnderTempWarn !== null && <Text style={styles.parameterText}>ChgUnderTempWarn: {ChgUnderTempWarn}</Text>}
        {ChgOverTempWarn !== null && <Text style={styles.parameterText}>ChgOverTempWarn: {ChgOverTempWarn}</Text>}
        {DchgUnderTempWarn !== null && <Text style={styles.parameterText}>DchgUnderTempWarn: {DchgUnderTempWarn}</Text>}
        {DchgOverTempWarn !== null && <Text style={styles.parameterText}>DchgOverTempWarn: {DchgOverTempWarn}</Text>}
        {PreChgFetStatus !== null && <Text style={styles.parameterText}>PreChgFetStatus: {PreChgFetStatus}</Text>}
        {ChgFetStatus !== null && <Text style={styles.parameterText}>ChgFetStatus: {ChgFetStatus}</Text>}
        {DchgFetStatus !== null && <Text style={styles.parameterText}>DchgFetStatus: {DchgFetStatus}</Text>}
        {ResStatus !== null && <Text style={styles.parameterText}>ResStatus: {ResStatus}</Text>}
        {ShortCktProt !== null && <Text style={styles.parameterText}>ShortCktProt: {ShortCktProt}</Text>}
        {DschgPeakProt !== null && <Text style={styles.parameterText}>DschgPeakProt: {DschgPeakProt}</Text>}
        {ChgAuth !== null && <Text style={styles.parameterText}>ChgAuth: {ChgAuth}</Text>}
        {ChgPeakProt !== null && <Text style={styles.parameterText}>ChgPeakProt: {ChgPeakProt}</Text>}
        {DI1 !== null && <Text style={styles.parameterText}>DI1: {DI1}</Text>}
        {DI2 !== null && <Text style={styles.parameterText}>DI2: {DI2}</Text>}
        {DO1 !== null && <Text style={styles.parameterText}>DO1: {DO1}</Text>}
        {DO2 !== null && <Text style={styles.parameterText}>DO2: {DO2}</Text>}
        {ChargerDetection !== null && <Text style={styles.parameterText}>ChargerDetection: {ChargerDetection}</Text>}
        {CanCommDetection !== null && <Text style={styles.parameterText}>CanCommDetection: {CanCommDetection}</Text>}
        {CellBalFeatureStatus !== null && <Text style={styles.parameterText}>CellBalFeatureStatus: {CellBalFeatureStatus}</Text>}
        {ImmoChg !== null && <Text style={styles.parameterText}>ImmoChg: {ImmoChg}</Text>}
        {ImmoDchg !== null && <Text style={styles.parameterText}>ImmoDchg: {ImmoDchg}</Text>}
        {BuzzerStatus !== null && <Text style={styles.parameterText}>BuzzerStatus: {BuzzerStatus}</Text>}
        {Side_Stand_Ack !== null && <Text style={styles.parameterText}>Side_Stand_Ack: {Side_Stand_Ack}</Text>}
        {Direction_Ack !== null && <Text style={styles.parameterText}>Direction_Ack: {Direction_Ack}</Text>}
        {Ride_Ack !== null && <Text style={styles.parameterText}>Ride_Ack: {Ride_Ack}</Text>}
        {Hill_hold_Ack !== null && <Text style={styles.parameterText}>Hill_hold_Ack: {Hill_hold_Ack}</Text>}
        {Wakeup_Ack !== null && <Text style={styles.parameterText}>Wakeup_Ack: {Wakeup_Ack}</Text>}
        {DriveError_Motor_hall !== null && <Text style={styles.parameterText}>DriveError_Motor_hall: {DriveError_Motor_hall}</Text>}
        {Motor_Stalling !== null && <Text style={styles.parameterText}>Motor_Stalling: {Motor_Stalling}</Text>}
        {Motor_Phase_loss !== null && <Text style={styles.parameterText}>Motor_Phase_loss: {Motor_Phase_loss}</Text>}
        {Controller_Over_Temeprature !== null && <Text style={styles.parameterText}>Controller_Over_Temeprature: {Controller_Over_Temeprature}</Text>}
        {Motor_Over_Temeprature !== null && <Text style={styles.parameterText}>Motor_Over_Temeprature: {Motor_Over_Temeprature}</Text>}
        {Throttle_Error !== null && <Text style={styles.parameterText}>Throttle_Error: {Throttle_Error}</Text>}
        {MOSFET_Protection !== null && <Text style={styles.parameterText}>MOSFET_Protection: {MOSFET_Protection}</Text>}
        {DriveStatus_Regenerative_Braking !== null && <Text style={styles.parameterText}>DriveStatus_Regenerative_Braking: {DriveStatus_Regenerative_Braking}</Text>}
        {ModeR_Pulse !== null && <Text style={styles.parameterText}>ModeR_Pulse: {ModeR_Pulse}</Text>}
        {ModeL_Pulse !== null && <Text style={styles.parameterText}>ModeL_Pulse: {ModeL_Pulse}</Text>}
        {Brake_Pulse !== null && <Text style={styles.parameterText}>Brake_Pulse: {Brake_Pulse}</Text>}
        {Park_Pulse !== null && <Text style={styles.parameterText}>Park_Pulse: {Park_Pulse}</Text>}
        {Reverse_Pulse !== null && <Text style={styles.parameterText}>Reverse_Pulse: {Reverse_Pulse}</Text>}
        {SideStand_Pulse !== null && <Text style={styles.parameterText}>SideStand_Pulse: {SideStand_Pulse}</Text>}
        {ForwardParking_Mode_Ack !== null && <Text style={styles.parameterText}>ForwardParking_Mode_Ack: {ForwardParking_Mode_Ack}</Text>}
        {DriveError_Controller_OverVoltag !== null && <Text style={styles.parameterText}>DriveError_Controller_OverVoltag: {DriveError_Controller_OverVoltag}</Text>}
        {Controller_Undervoltage !== null && <Text style={styles.parameterText}>Controller_Undervoltage: {Controller_Undervoltage}</Text>}
        {Overcurrent_Fault !== null && <Text style={styles.parameterText}>Overcurrent_Fault: {Overcurrent_Fault}</Text>}
        {DriveStatus1_ride !== null && <Text style={styles.parameterText}>DriveStatus1_ride: {DriveStatus1_ride}</Text>}
        {Wakeup_Request !== null && <Text style={styles.parameterText}>Wakeup_Request: {Wakeup_Request}</Text>}
        {Hill_Hold !== null && <Text style={styles.parameterText}>Hill_Hold: {Hill_Hold}</Text>}
        {Reverse_REQUEST !== null && <Text style={styles.parameterText}>Reverse_REQUEST: {Reverse_REQUEST}</Text>}
        {Forward_parkingmode_REQUEST !== null && <Text style={styles.parameterText}>Forward_parkingmode_REQUEST: {Forward_parkingmode_REQUEST}</Text>}
        {Side_stand_Req !== null && <Text style={styles.parameterText}>Side_stand_Req: {Side_stand_Req}</Text>}
        {Battery_charge_logic !== null && <Text style={styles.parameterText}>Battery_charge_logic: {Battery_charge_logic}</Text>}
        {Remote_cutoff !== null && <Text style={styles.parameterText}>Remote_cutoff: {Remote_cutoff}</Text>}
        {mode_limit !== null && <Text style={styles.parameterText}>mode_limit: {mode_limit}</Text>}
        {Geo_fencebuzzer !== null && <Text style={styles.parameterText}>Geo_fencebuzzer: {Geo_fencebuzzer}</Text>}
        {Holiday_mode !== null && <Text style={styles.parameterText}>Holiday_mode: {Holiday_mode}</Text>}
        {Service_request !== null && <Text style={styles.parameterText}>Service_request: {Service_request}</Text>}
 
 
 
 
        {/* {cellVol01 === null && cellVol02 === null && cellVol03 === null && cellVol04 === null &&
       cellVol05 === null && cellVol06 === null && cellVol07 === null && cellVol08 === null &&
       cellVol09 === null && cellVol10 === null && cellVol11 === null && cellVol12 === null &&
       cellVol13 === null && cellVol14 === null && cellVol15 === null && cellVol16 === null &&
       MaxCellVol === null && MinCellVol === null && AvgCellVol === null && MaxVoltId === null &&
       PackVol === null && CycleCount === null && MaxTemp === null &&
       MinTemp === null && CellVolMinMaxDev === null && MinTemp === null && CellVolMinMaxDev === null &&
       MinTemp === null && CellVolMinMaxDev === null &&
 <Text>No Data Received Yet</Text>} */}
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
});
 
export default HIL_Receive_from_vehicle;