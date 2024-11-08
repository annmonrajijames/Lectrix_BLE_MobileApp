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
        {MaxVoltId !== null && <Text style={styles.parameterText}>MaxVoltId: {MaxVoltId.toFixed(4)} V</Text>}
        {MinVoltId !== null && <Text style={styles.parameterText}>MinVoltId: {MinVoltId.toFixed(4)} V</Text>}
        {cellVol01 === null && cellVol02 === null && cellVol03 === null && cellVol04 === null && 
       cellVol05 === null && cellVol06 === null && cellVol07 === null && cellVol08 === null && 
       cellVol09 === null && cellVol10 === null && cellVol11 === null && cellVol12 === null && 
       cellVol13 === null && cellVol14 === null && cellVol15 === null && cellVol16 === null && 
       MaxCellVol === null && MinCellVol === null && AvgCellVol === null && MaxVoltId === null && 
       cellVol01 === null && 
 <Text>No Data Received Yet</Text>}
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
