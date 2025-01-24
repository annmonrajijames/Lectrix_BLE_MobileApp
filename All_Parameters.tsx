import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

// Define the RootStackParamList type with the device parameter
type RootStackParamList = {
  All_Parameters: { device: Device };
};

// Define the All_ParametersProps type
type All_ParametersProps = NativeStackScreenProps<RootStackParamList, 'All_Parameters'>;

const All_Parameters: React.FC<All_ParametersProps> = ({ route }) => {
  const { device } = route.params;

  const [RegenLimit, setRegenLimit] = useState(105);
  const [customModeCurrLimit, setCustomModeCurrLimit] = useState(105);
  const [frequency, setFrequency] = useState(105);
  const [torque, setTorque] = useState(105);
  const [bufferSpeed, setBufferSpeed] = useState(105);
  const [baseSpeed, setBaseSpeed] = useState(105);
  const [torqueLimitBeforeProfileSpeed, setTorqueLimitBeforeProfileSpeed] = useState(105);
  const [torqueLimitAfterProfileSpeed, setTorqueLimitAfterProfileSpeed] = useState(105);

  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 255) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 255.');
      return null;
    }
    return decimalNumber.toString(16).padStart(2, '0').toUpperCase();
  };

  const writeParameterToDevice = async (
    parameterValue: number,
    opCode: string,
    payloadLength: string,
    canId: string,
    showAlert: boolean = true // Make showAlert optional with a default value of true
  ) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const parameterHex = convertDecimalToHex(parameterValue.toString());
    if (!parameterHex) {
      return; // Stops the process if input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const message = SOF + Source + Destination + opCode + payloadLength + parameterHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      console.log(`Sent parameter ${opCode} to CAN ID: ${canId}`);
    } catch (error: any) {
      console.error(`Write failed for OpCode ${opCode} at CAN ID ${canId}`, error);
      if (showAlert) {
        Alert.alert("Write Error", `Error writing data for OpCode ${opCode}: ${error.message}`);
      }
    }
  };

  const handleSendAllParameters = async () => {
    try {
      // Sending parameters for CAN ID 18F20309
      await writeParameterToDevice(RegenLimit, '0A', '0001', '18F20309'); // Regen Limit
      await writeParameterToDevice(customModeCurrLimit, '0B', '0001', '18F20309'); // Custom Mode Current Limit
      await writeParameterToDevice(frequency, '0C', '0001', '18F20309'); // Frequency
      await writeParameterToDevice(torque, '0D', '0002', '18F20309'); // Torque

      // Sending parameters for CAN ID 18F20311
      await writeParameterToDevice(bufferSpeed, '0E', '0001', '18F20311'); // Buffer Speed
      await writeParameterToDevice(baseSpeed, '0F', '0001', '18F20311'); // Base Speed
      await writeParameterToDevice(torqueLimitBeforeProfileSpeed, '10', '0001', '18F20311'); // Torque Limit Before Profile Speed
      await writeParameterToDevice(torqueLimitAfterProfileSpeed, '11', '0001', '18F20311'); // Torque Limit After Profile Speed

      Alert.alert('Success', 'All parameters have been sent to the device successfully.');
    } catch (error: any) {
      console.error('Error sending parameters:', error);
      Alert.alert('Error', 'Failed to send all parameters. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Regen Limit Setup</Text>

      <Text style={styles.label}>Regen Limit (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Regen Limit"
        placeholderTextColor="#808080"
        value={RegenLimit.toString()}
        onChangeText={(text) => setRegenLimit(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Custom Mode Current Limit (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Current Limit"
        placeholderTextColor="#808080"
        value={customModeCurrLimit.toString()}
        onChangeText={(text) => setCustomModeCurrLimit(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Frequency (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Frequency"
        placeholderTextColor="#808080"
        value={frequency.toString()}
        onChangeText={(text) => setFrequency(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Torque (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Torque"
        placeholderTextColor="#808080"
        value={torque.toString()}
        onChangeText={(text) => setTorque(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Buffer Speed (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Buffer Speed"
        placeholderTextColor="#808080"
        value={bufferSpeed.toString()}
        onChangeText={(text) => setBufferSpeed(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Base Speed (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Base Speed"
        placeholderTextColor="#808080"
        value={baseSpeed.toString()}
        onChangeText={(text) => setBaseSpeed(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Torque Limit Before Profile Speed (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Torque Limit Before"
        placeholderTextColor="#808080"
        value={torqueLimitBeforeProfileSpeed.toString()}
        onChangeText={(text) => setTorqueLimitBeforeProfileSpeed(Number(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Torque Limit After Profile Speed (0-255)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Torque Limit After"
        placeholderTextColor="#808080"
        value={torqueLimitAfterProfileSpeed.toString()}
        onChangeText={(text) => setTorqueLimitAfterProfileSpeed(Number(text))}
        keyboardType="numeric"
      />

      <Button title="Send All Parameters" onPress={handleSendAllParameters} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default All_Parameters;
