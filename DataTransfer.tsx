import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [inputData, setInputData] = useState('');
  const [receivedData, setReceivedData] = useState('');

  const writeDataToCharacteristic = async () => {
    const serviceUUID = '1819';
    const characteristicUUID = 'EE02';

    try {
      const base64Data = Buffer.from(inputData, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        base64Data
      );
      Alert.alert("Success", "Data written to the device successfully.");
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const readDataFromCharacteristic = async () => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

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
      <Text style={styles.title}>Data Transfer Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Hex Data to Write"
        placeholderTextColor="#808080" 
        value={inputData}
        onChangeText={setInputData}
        autoCapitalize="none"
      />
      <Button title="WRITE" onPress={writeDataToCharacteristic} />
      <Button title="READ" onPress={readDataFromCharacteristic} />
      {receivedData ? <Text>Received Data: {receivedData}</Text> : null}
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  title: {
    color: '#0000FF', // Sets the text color to blue
    fontSize: 20, // Sets the size of the font
    fontWeight: 'bold', // Makes the font bold
  },
});

export default DataTransfer;
