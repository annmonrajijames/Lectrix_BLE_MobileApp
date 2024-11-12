import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
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
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

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
        {IgnitionStatus !== null && <Text style={styles.statusText}>IgnitionStatus: {IgnitionStatus}</Text>}
        {LoadDetection !== null && <Text style={styles.statusText}>LoadDetection: {LoadDetection}</Text>}
        {Keystatus !== null && <Text style={styles.statusText}>Key Status: {Keystatus}</Text>}
{keyevents !== null && <Text style={styles.statusText}>Key Events: {keyevents}</Text>}
{CellUnderVolProt !== null && <Text style={styles.statusText}>Cell Under Voltage Protection: {CellUnderVolProt}</Text>}
{CellOverVolProt !== null && <Text style={styles.statusText}>Cell Over Voltage Protection: {CellOverVolProt}</Text>}
{PackUnderVolProt !== null && <Text style={styles.statusText}>Pack Under Voltage Protection: {PackUnderVolProt}</Text>}
{PackOverVolProt !== null && <Text style={styles.statusText}>Pack Over Voltage Protection: {PackOverVolProt}</Text>}
{ChgUnderTempProt !== null && <Text style={styles.statusText}>Charge Under Temperature Protection: {ChgUnderTempProt}</Text>}
{ChgOverTempProt !== null && <Text style={styles.statusText}>Charge Over Temperature Protection: {ChgOverTempProt}</Text>}
{DchgUnderTempProt !== null && <Text style={styles.statusText}>Discharge Under Temperature Protection: {DchgUnderTempProt}</Text>}
{DchgOverTempProt !== null && <Text style={styles.statusText}>Discharge Over Temperature Protection: {DchgOverTempProt}</Text>}
{CellOverDevProt !== null && <Text style={styles.statusText}>Cell Over Deviation Protection: {CellOverDevProt}</Text>}
{BattLowSocWarn !== null && <Text style={styles.statusText}>Battery Low SOC Warning: {BattLowSocWarn}</Text>}
{ChgOverCurrProt !== null && <Text style={styles.statusText}>Charge Over Current Protection: {ChgOverCurrProt}</Text>}
{DchgOverCurrProt !== null && <Text style={styles.statusText}>Discharge Over Current Protection: {DchgOverCurrProt}</Text>}
{CellUnerVolWarn !== null && <Text style={styles.statusText}>Cell Under Voltage Warning: {CellUnerVolWarn}</Text>}
{CellOverVolWarn !== null && <Text style={styles.statusText}>Cell Over Voltage Warning: {CellOverVolWarn}</Text>}
{FetTempProt !== null && <Text style={styles.statusText}>FET Temperature Protection: {FetTempProt}</Text>}
{ResSocProt !== null && <Text style={styles.statusText}>Residual SOC Protection: {ResSocProt}</Text>}
{FetFailure !== null && <Text style={styles.statusText}>FET Failure: {FetFailure}</Text>}
{TempSenseFault !== null && <Text style={styles.statusText}>Temperature Sensor Fault: {TempSenseFault}</Text>}
{PackUnderVolWarn !== null && <Text style={styles.statusText}>Pack Under Voltage Warning: {PackUnderVolWarn}</Text>}
{PackOverVolWarn !== null && <Text style={styles.statusText}>Pack Over Voltage Warning: {PackOverVolWarn}</Text>}
{ChgUnderTempWarn !== null && <Text style={styles.statusText}>Charge Under Temperature Warning: {ChgUnderTempWarn}</Text>}
{ChgOverTempWarn !== null && <Text style={styles.statusText}>Charge Over Temperature Warning: {ChgOverTempWarn}</Text>}
{DchgUnderTempWarn !== null && <Text style={styles.statusText}>Discharge Under Temperature Warning: {DchgUnderTempWarn}</Text>}
{DchgOverTempWarn !== null && <Text style={styles.statusText}>Discharge Over Temperature Warning: {DchgOverTempWarn}</Text>}
{PreChgFetStatus !== null && <Text style={styles.statusText}>Pre-Charge FET Status: {PreChgFetStatus}</Text>}
{ChgFetStatus !== null && <Text style={styles.statusText}>Charge FET Status: {ChgFetStatus}</Text>}
{DchgFetStatus !== null && <Text style={styles.statusText}>Discharge FET Status: {DchgFetStatus}</Text>}
{ResStatus !== null && <Text style={styles.statusText}>Resistance Status: {ResStatus}</Text>}
{ShortCktProt !== null && <Text style={styles.statusText}>Short Circuit Protection: {ShortCktProt}</Text>}
{DschgPeakProt !== null && <Text style={styles.statusText}>Discharge Peak Protection: {DschgPeakProt}</Text>}
{ChgAuth !== null && <Text style={styles.statusText}>Charge Authorization: {ChgAuth}</Text>}
{ChgPeakProt !== null && <Text style={styles.statusText}>Charge Peak Protection: {ChgPeakProt}</Text>}
{DI1 !== null && <Text style={styles.statusText}>Digital Input 1: {DI1}</Text>}
{DI2 !== null && <Text style={styles.statusText}>Digital Input 2: {DI2}</Text>}
{DO1 !== null && <Text style={styles.statusText}>Digital Output 1: {DO1}</Text>}
{DO2 !== null && <Text style={styles.statusText}>Digital Output 2: {DO2}</Text>}
{ChargerDetection !== null && <Text style={styles.statusText}>Charger Detection: {ChargerDetection}</Text>}
{CanCommDetection !== null && <Text style={styles.statusText}>CAN Communication Detection: {CanCommDetection}</Text>}
{CellBalFeatureStatus !== null && <Text style={styles.statusText}>Cell Balance Feature Status: {CellBalFeatureStatus}</Text>}
{ImmoChg !== null && <Text style={styles.statusText}>Immobilizer Charge: {ImmoChg}</Text>}
{ImmoDchg !== null && <Text style={styles.statusText}>Immobilizer Discharge: {ImmoDchg}</Text>}
{BuzzerStatus !== null && <Text style={styles.statusText}>Buzzer Status: {BuzzerStatus}</Text>}
{Side_Stand_Ack !== null && <Text style={styles.statusText}>Side Stand Acknowledgment: {Side_Stand_Ack}</Text>}
{Direction_Ack !== null && <Text style={styles.statusText}>Direction Acknowledgment: {Direction_Ack}</Text>}
{Ride_Ack !== null && <Text style={styles.statusText}>Ride Acknowledgment: {Ride_Ack}</Text>}
{Hill_hold_Ack !== null && <Text style={styles.statusText}>Hill Hold Acknowledgment: {Hill_hold_Ack}</Text>}
{Wakeup_Ack !== null && <Text style={styles.statusText}>Wakeup Acknowledgment: {Wakeup_Ack}</Text>}
{DriveError_Motor_hall !== null && <Text style={styles.statusText}>Drive Error: Motor Hall: {DriveError_Motor_hall}</Text>}
{Motor_Stalling !== null && <Text style={styles.statusText}>Motor Stalling: {Motor_Stalling}</Text>}
{Motor_Phase_loss !== null && <Text style={styles.statusText}>Motor Phase Loss: {Motor_Phase_loss}</Text>}
{Controller_Over_Temeprature !== null && <Text style={styles.statusText}>Controller Over Temperature: {Controller_Over_Temeprature}</Text>}
{Motor_Over_Temeprature !== null && <Text style={styles.statusText}>Motor Over Temperature: {Motor_Over_Temeprature}</Text>}
{Throttle_Error !== null && <Text style={styles.statusText}>Throttle Error: {Throttle_Error}</Text>}
{MOSFET_Protection !== null && <Text style={styles.statusText}>MOSFET Protection: {MOSFET_Protection}</Text>}
{DriveStatus_Regenerative_Braking !== null && <Text style={styles.statusText}>Drive Status: Regenerative Braking: {DriveStatus_Regenerative_Braking}</Text>}
{ModeR_Pulse !== null && <Text style={styles.statusText}>Mode R Pulse: {ModeR_Pulse}</Text>}
{ModeL_Pulse !== null && <Text style={styles.statusText}>Mode L Pulse: {ModeL_Pulse}</Text>}
{Brake_Pulse !== null && <Text style={styles.statusText}>Brake Pulse: {Brake_Pulse}</Text>}
{Park_Pulse !== null && <Text style={styles.statusText}>Park Pulse: {Park_Pulse}</Text>}
{Reverse_Pulse !== null && <Text style={styles.statusText}>Reverse Pulse: {Reverse_Pulse}</Text>}
{SideStand_Pulse !== null && <Text style={styles.statusText}>Side Stand Pulse: {SideStand_Pulse}</Text>}
{ForwardParking_Mode_Ack !== null && <Text style={styles.statusText}>Forward Parking Mode Acknowledgment: {ForwardParking_Mode_Ack}</Text>}
{DriveError_Controller_OverVoltag !== null && <Text style={styles.statusText}>Drive Error: Controller Over Voltage: {DriveError_Controller_OverVoltag}</Text>}
{Controller_Undervoltage !== null && <Text style={styles.statusText}>Controller Undervoltage: {Controller_Undervoltage}</Text>}
{Overcurrent_Fault !== null && <Text style={styles.statusText}>Overcurrent Fault: {Overcurrent_Fault}</Text>}
{DriveStatus1_ride !== null && <Text style={styles.statusText}>Drive Status 1 Ride: {DriveStatus1_ride}</Text>}
{Wakeup_Request !== null && <Text style={styles.statusText}>Wakeup Request: {Wakeup_Request}</Text>}
{Hill_Hold !== null && <Text style={styles.statusText}>Hill Hold: {Hill_Hold}</Text>}
{Reverse_REQUEST !== null && <Text style={styles.statusText}>Reverse Request: {Reverse_REQUEST}</Text>}
{Forward_parkingmode_REQUEST !== null && <Text style={styles.statusText}>Forward Parking Mode Request: {Forward_parkingmode_REQUEST}</Text>}
{Side_stand_Req !== null && <Text style={styles.statusText}>Side Stand Request: {Side_stand_Req}</Text>}
{Battery_charge_logic !== null && <Text style={styles.statusText}>Battery Charge Logic: {Battery_charge_logic}</Text>}
{Remote_cutoff !== null && <Text style={styles.statusText}>Remote Cutoff: {Remote_cutoff}</Text>}
{mode_limit !== null && <Text style={styles.statusText}>Mode Limit: {mode_limit}</Text>}
{Geo_fencebuzzer !== null && <Text style={styles.statusText}>Geo Fence Buzzer: {Geo_fencebuzzer}</Text>}
{Holiday_mode !== null && <Text style={styles.statusText}>Holiday Mode: {Holiday_mode}</Text>}
{Service_request !== null && <Text style={styles.statusText}>Service Request: {Service_request}</Text>}

        {/* {IgnitionStatus === null && LoadDetection === null && <Text>No Data Received Yet</Text>} */}
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
  statusText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
