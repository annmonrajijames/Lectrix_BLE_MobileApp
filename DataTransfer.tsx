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
  const [MaxTemp, setMaxTemp] = useState<number | null>(null);
  const [MinTemp, setMinTemp] = useState<number | null>(null);
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
  const [Usable_Capacity_Ah, setUsable_Capacity_Ah] = useState<number | null>(null);
  const [ConfigVer, setConfigVer] = useState<number | null>(null);
  const [InternalFWVer, setInternalFWVer] = useState<number | null>(null);
  const [InternalFWSubVer, setInternalFWSubVer] = useState<number | null>(null);
  const [BHB_66049, setBHB_66049] = useState<number | null>(null);
  const [BtStatus_NC0PSM1CC2CV3Finish4, setBtStatus_NC0PSM1CC2CV3Finish4] = useState<number | null>(null);
  
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
    const MaxTemp = eight_bytes_decode('07', 1, 17)(data);
    const MinTemp = eight_bytes_decode('07', 1, 18)(data);
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
    const Usable_Capacity_Ah = eight_bytes_decode('14', 0.001 , 14, 15, 16, 17)(data);
    const ConfigVer = eight_bytes_decode('14', 1 , 2, 3, 4)(data);
    const InternalFWVer = eight_bytes_decode('14', 1 , 5, 6, 7)(data);
    const InternalFWSubVer = eight_bytes_decode('14', 1 , 8, 9)(data);
    const BHB_66049 = eight_bytes_decode('14', 1 , 3, 4, 5)(data);
    const BtStatus_NC0PSM1CC2CV3Finish4 = eight_bytes_decode('14', 1 , 3, 4, 5)(data);

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
    if (Usable_Capacity_Ah !== null) setUsable_Capacity_Ah(Usable_Capacity_Ah);
    if (ConfigVer !== null) setConfigVer(ConfigVer);
    if (InternalFWVer !== null) setInternalFWVer(InternalFWVer);
    if (InternalFWSubVer !== null) setInternalFWSubVer(InternalFWSubVer);
    if (BHB_66049 !== null) setBHB_66049(BHB_66049);
    if (BtStatus_NC0PSM1CC2CV3Finish4 !== null) setBtStatus_NC0PSM1CC2CV3Finish4(BtStatus_NC0PSM1CC2CV3Finish4);
    
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {cellVol01 !== null && <Text style={styles.parameterText}>Cell Voltage 01: {cellVol01.toFixed(4)} V</Text>}
        {cellVol02 !== null && <Text style={styles.parameterText}>Cell Voltage 02: {cellVol02.toFixed(4)} V</Text>}
        {cellVol03 !== null && <Text style={styles.parameterText}>Cell Voltage 03: {cellVol03.toFixed(4)} V</Text>}
        {cellVol04 !== null && <Text style={styles.parameterText}>Cell Voltage 04: {cellVol04.toFixed(4)} V</Text>}
        {cellVol05 !== null && <Text style={styles.parameterText}>Cell Voltage 05: {cellVol05.toFixed(4)} V</Text>}
        {cellVol06 !== null && <Text style={styles.parameterText}>Cell Voltage 06: {cellVol06.toFixed(4)} V</Text>}
        {cellVol07 !== null && <Text style={styles.parameterText}>Cell Voltage 07: {cellVol07.toFixed(4)} V</Text>}
        {cellVol08 !== null && <Text style={styles.parameterText}>Cell Voltage 08: {cellVol08.toFixed(4)} V</Text>}
        {cellVol09 !== null && <Text style={styles.parameterText}>Cell Voltage 09: {cellVol09.toFixed(4)} V</Text>}
        {cellVol10 !== null && <Text style={styles.parameterText}>Cell Voltage 10: {cellVol10.toFixed(4)} V</Text>}
        {cellVol11 !== null && <Text style={styles.parameterText}>Cell Voltage 11: {cellVol11.toFixed(4)} V</Text>}
        {cellVol12 !== null && <Text style={styles.parameterText}>Cell Voltage 12: {cellVol12.toFixed(4)} V</Text>}
        {cellVol13 !== null && <Text style={styles.parameterText}>Cell Voltage 13: {cellVol13.toFixed(4)} V</Text>}
        {cellVol14 !== null && <Text style={styles.parameterText}>Cell Voltage 14: {cellVol14.toFixed(4)} V</Text>}
        {cellVol15 !== null && <Text style={styles.parameterText}>Cell Voltage 15: {cellVol15.toFixed(4)} V</Text>}
        {cellVol16 !== null && <Text style={styles.parameterText}>Cell Voltage 16: {cellVol16.toFixed(4)} V</Text>}

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
        {Usable_Capacity_Ah !== null && <Text style={styles.parameterText}>Usable Capacity Ah: {Usable_Capacity_Ah.toFixed(4)} AH</Text>}
        {ConfigVer !== null && <Text style={styles.parameterText}>ConfigVer: {ConfigVer.toFixed(4)}</Text>}
        {InternalFWVer !== null && <Text style={styles.parameterText}>InternalFWVer: {InternalFWVer.toFixed(4)}</Text>}
        {InternalFWSubVer !== null && <Text style={styles.parameterText}>InternalFWSubVer: {InternalFWSubVer.toFixed(4)}</Text>}
        {BHB_66049 !== null && <Text style={styles.parameterText}>BHB 66049: {BHB_66049.toFixed(4)}</Text>}
        {BtStatus_NC0PSM1CC2CV3Finish4 !== null && <Text style={styles.parameterText}>BtStatus NC0PSM1CC2CV3Finish4: {BtStatus_NC0PSM1CC2CV3Finish4.toFixed(4)}</Text>}

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

export default DataTransfer;
