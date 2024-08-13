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
    const serviceUUID = '1819'; // Update with your service UUID
    const characteristicUUID = 'EE02'; // Update with your characteristic UUID
    const hexData = 'AA01020400080C02090000001213'; // Hex data
 
    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(hexData, 'hex').toString('base64')
      );
      Alert.alert("Success", "Data written to the device successfully.");
    } catch (error: any) {
      console.error("Write failed:", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };
 
  const readDataFromCharacteristic = async () => {
    const serviceUUID = '1819'; // Update with your service UUID
    const characteristicUUID = 'EE02'; // Update with your characteristic UUID
 
    try {
      const result = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const data = Buffer.from(result.value || '', 'base64').toString('hex');
      setReceivedData(data);
      Alert.alert("Read Success", `Data received: ${data}`);
    } catch (error: any) {
      console.error("Read failed:", error);
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
    padding: 20, // Added padding for better layout
  },
});
 
export default DataTransfer;
