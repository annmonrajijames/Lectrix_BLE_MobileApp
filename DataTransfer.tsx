import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            Alert.alert("Subscription Error", `Error subscribing to characteristic: ${error.message}`);
            return;
          }

          if (characteristic?.value) {
            const data = Buffer.from(characteristic.value, 'base64').toString('hex');
            decodeData(data);
          }
        });
      } catch (error) {
        console.error("Failed to set up subscription:", error);
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

  const eight_bytes_decode = (firstByteCheck, multiplier, ...positions) => {
    return (data) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    }
  }

  const decodeData = (data) => {
    const cellVoltage01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    const cellVoltage02 = eight_bytes_decode('07', 0.0001, 9, 10)(data);
    const cellVoltage03 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
    const cellVoltage04 = eight_bytes_decode('07', 0.0001, 13, 14)(data);
    const cellVoltage05 = eight_bytes_decode('10', 0.0001, 6, 7)(data);
    const cellVoltage06 = eight_bytes_decode('10', 0.0001, 8, 9)(data);
    const cellVoltage07 = eight_bytes_decode('10', 0.0001, 10, 11)(data);
    const cellVoltage08 = eight_bytes_decode('10', 0.0001, 12, 13)(data);

    if (cellVoltage01 !== null) setCellVol01(cellVoltage01);
    if (cellVoltage02 !== null) setCellVol02(cellVoltage02);
    if (cellVoltage03 !== null) setCellVol03(cellVoltage03);
    if (cellVoltage04 !== null) setCellVol04(cellVoltage04);
    if (cellVoltage05 !== null) setCellVol05(cellVoltage05);
    if (cellVoltage06 !== null) setCellVol06(cellVoltage06);
    if (cellVoltage07 !== null) setCellVol07(cellVoltage07);
    if (cellVoltage08 !== null) setCellVol08(cellVoltage08);
  };

  return (
    <View style={styles.container}>
      {cellVol01 !== null && <Text style={styles.cellVolText}>Cell Voltage 01: {cellVol01.toFixed(4)} V</Text>}
      {cellVol02 !== null && <Text style={styles.cellVolText}>Cell Voltage 02: {cellVol02.toFixed(4)} V</Text>}
      {cellVol03 !== null && <Text style={styles.cellVolText}>Cell Voltage 03: {cellVol03.toFixed(4)} V</Text>}
      {cellVol04 !== null && <Text style={styles.cellVolText}>Cell Voltage 04: {cellVol04.toFixed(4)} V</Text>}
      {cellVol05 !== null && <Text style={styles.cellVolText}>Cell Voltage 05: {cellVol05.toFixed(4)} V</Text>}
      {cellVol06 !== null && <Text style={styles.cellVolText}>Cell Voltage 06: {cellVol06.toFixed(4)} V</Text>}
      {cellVol07 !== null && <Text style={styles.cellVolText}>Cell Voltage 07: {cellVol07.toFixed(4)} V</Text>}
      {cellVol08 !== null && <Text style={styles.cellVolText}>Cell Voltage 08: {cellVol08.toFixed(4)} V</Text>}
      {cellVol01 === null && cellVol02 === null && cellVol03 === null && cellVol04 === null && 
       cellVol05 === null && cellVol06 === null && cellVol07 === null && cellVol08 === null && <Text>No Data Received Yet</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cellVolText: {
    color: '#FFA500', // Orange color for cell voltage text
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DataTransfer;
