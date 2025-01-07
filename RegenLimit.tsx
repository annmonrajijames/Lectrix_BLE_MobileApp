import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import Slider from '@react-native-community/slider';

type RootStackParamList = {
  RegenLimit: { device: Device };
};

type RegenLimitProps = NativeStackScreenProps<RootStackParamList, 'RegenLimit'>;

const RegenLimit: React.FC<RegenLimitProps> = ({ route }) => {
  const { device } = route.params;
  
  // Initialized with default values
  const [RegenLimit, setRegenLimit] = useState(105);
  const [customModeCurrLimit, setCustomModeCurrLimit] = useState(105);
  const [frequency, setFrequency] = useState(105);
  const [torqe, setTorque] = useState(105);
  const [bufferSpeed, setBufferSpeed] = useState(105);
  const [initialProf, setInitialProf] = useState(105);
  const [finalProf, setFinalProf] = useState(105);
  const [receivedData, setReceivedData] = useState('');

  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 255) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 255.');
      return null;
    }
    return decimalNumber.toString(16).padStart(2, '0').toUpperCase();
  };

  const handleSliderChange = (value: number) => {
    setCustomModeCurrLimit(value);
    regenwriteDataToCharacteristic(false);
  };

  const regenwriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(customModeCurrLimit.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0A';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const CurrentlimitwriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(customModeCurrLimit.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0B';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const frequencywriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(customModeCurrLimit.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0C';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const torqewriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(torqe.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0D';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const bufferSpeedwriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(bufferSpeed.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0E';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const initialProfwriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(initialProf.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0F';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  const finalProfwriteDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const customModeHex = convertDecimalToHex(initialProf.toString());

    if (!customModeHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '10';
    const Payload_Length = '0001';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Regen Limit Setup</Text>
      
      {/* Custom Mode */}
      <Text style={styles.label}>Custom Mode (0-255 Regen)</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={RegenLimit.toString()}
        onChangeText={text => setRegenLimit(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={RegenLimit}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Regen Limit WRITE" onPress={() => regenwriteDataToCharacteristic(true)} />
      
      {/* Current Limit */}
      <Text style={styles.label}>Current Limit</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={customModeCurrLimit.toString()}
        onChangeText={text => setCustomModeCurrLimit(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={customModeCurrLimit}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Current Limit WRITE" onPress={() => CurrentlimitwriteDataToCharacteristic(true)} />

      {/* Frequency */}
      <Text style={styles.label}>Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={frequency.toString()}
        onChangeText={text => setFrequency(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={frequency}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Frequency WRITE" onPress={() => frequencywriteDataToCharacteristic(true)} />


      {/* Torque */}
      <Text style={styles.label}>Torque</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={torqe.toString()}
        onChangeText={text => setTorque(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={torqe}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Torqe WRITE" onPress={() => torqewriteDataToCharacteristic(true)} />

      {/* Buffer Speed */}
      <Text style={styles.label}>Buffer Speed</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={bufferSpeed.toString()}
        onChangeText={text => setBufferSpeed(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={bufferSpeed}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Torqe WRITE" onPress={() => bufferSpeedwriteDataToCharacteristic(true)} />

      {/* Buffer Speed */}
      <Text style={styles.label}>Buffer Speed</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={initialProf.toString()}
        onChangeText={text => setInitialProf(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={initialProf}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Torqe WRITE" onPress={() => initialProfwriteDataToCharacteristic(true)} />

      {/* Final Profile */}
      <Text style={styles.label}>Final Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="0-255"
        placeholderTextColor="#808080"
        value={finalProf.toString()}
        onChangeText={text => setFinalProf(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={finalProf}
        onValueChange={handleSliderChange}
      />
      
      <Button title="Torqe WRITE" onPress={() => finalProfwriteDataToCharacteristic(true)} />


      {receivedData ? <Text>Received Data: {receivedData}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '60%',  // Reduced width
    height: 35,    // Reduced height
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  title: {
    color: '#0000FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default RegenLimit;