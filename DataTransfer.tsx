import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [receivedData, setReceivedData] = useState('');

  const writeDataToCharacteristic = async () => {
    const serviceUUID = '00FF'; // for Write, CHANGE Service UUID here, (make sure service UUID in this Mobile app and BLE ESP32 hardware are same), example change 0x00FF to 0x00AA
    const characteristicUUID = 'FF01'; // for Write, CHANGE Characteristic UUID here, (make sure Characteristic UUID in this Mobile app and BLE ESP32 hardware are same), example change 0xFF01 to 0xAA01
    const hexData = 'AA01020400080C02090000001213'; // CHANGE this hexadecimal data, if you want to change the data to be sent to BLE ESP32 hardware device

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(hexData, 'hex').toString('base64')
      );
      Alert.alert("Success", "Data written to the device successfully.");
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const readDataFromCharacteristic = async () => {
    const serviceUUID = '00FF'; // for Read, CHANGE Service UUID here, (make sure service UUID in this Mobile app and BLE ESP32 hardware are same), example change 0x00FF to 0x00AA
    const characteristicUUID = 'FF01'; // for Read, CHANGE Characteristic UUID here, (make sure Characteristic UUID in this Mobile app and BLE ESP32 hardware are same), example change 0xFF01 to 0xAA01

    try {
      const result = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const data = Buffer.from(result.value || '', 'base64').toString('hex');
      setReceivedData(data);
      Alert.alert("Read Success", `Data received: ${data}`);
    } catch (error: any) {
      console.error("Read failed", error);
      Alert.alert("Read Error", `Error reading data from device: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Data Transfer Page</Text>
      {receivedData ? <Text>Received Data: {receivedData}</Text> : null}
      <Button title="WRITE" onPress={writeDataToCharacteristic} />
      <Button title="READ" onPress={readDataFromCharacteristic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default DataTransfer;