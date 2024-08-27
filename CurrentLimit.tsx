import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  CurrentLimit: { device: Device };
};

type CurrentLimitProps = NativeStackScreenProps<RootStackParamList, 'CurrentLimit'>;

const CurrentLimit: React.FC<CurrentLimitProps> = ({ route }) => {
  const { device } = route.params;
  
  const [customModeCurrLimit, setCustomModeCurrLimit] = useState('');
  const [powerModeLimit, setPowerModeLimit] = useState('');
  const [ecoModeCurrLimit, setEcoModeCurrLimit] = useState('');
  const [receivedData, setReceivedData] = useState('');

  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 255) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 255.');
      return null;
    }
    return decimalNumber.toString(16).padStart(2, '0').toUpperCase(); // Converts to hex and ensures two-digit format
  };

  const writeDataToCharacteristic = async () => {
    const serviceUUID = '1819';
    const characteristicUUID = 'EE02';

    const customModeHex = convertDecimalToHex(customModeCurrLimit);
    const powerModeHex = convertDecimalToHex(powerModeLimit);
    const ecoModeHex = convertDecimalToHex(ecoModeCurrLimit);

    if (!customModeHex || !powerModeHex || !ecoModeHex) {
      return; // Stops the process if any input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0A';
    const Payload_Length = '0003';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex + powerModeHex + ecoModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      Alert.alert("Success", "Data written to the device successfully.");
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const readDataFromCharacteristic = async () => {
    const serviceUUID = '1819';
    const characteristicUUID = 'EE02';

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
      <Text style={styles.title}>Current Limit Setup</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Custom Mode Curr Limit (0-255)"
        placeholderTextColor="#808080"
        value={customModeCurrLimit}
        onChangeText={setCustomModeCurrLimit}
        keyboardType="numeric"
        maxLength={3}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter Power Mode Limit (0-255)"
        placeholderTextColor="#808080"
        value={powerModeLimit}
        onChangeText={setPowerModeLimit}
        keyboardType="numeric"
        maxLength={3}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Eco Mode Curr Limit (0-255)"
        placeholderTextColor="#808080"
        value={ecoModeCurrLimit}
        onChangeText={setEcoModeCurrLimit}
        keyboardType="numeric"
        maxLength={3}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={writeDataToCharacteristic}>
          <Text style={styles.buttonText}>WRITE</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={readDataFromCharacteristic}>
          <Text style={styles.buttonText}>READ</Text>
        </TouchableOpacity>
      </View>
      
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
    color: '#00aaa',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust this width as needed
  },
  button: {
    backgroundColor: '#00aaaa',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10, // Space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CurrentLimit;
