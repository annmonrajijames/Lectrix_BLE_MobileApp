import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import Slider from '@react-native-community/slider';

type RootStackParamList = {
  RPMLimit: { device: Device };
};

type RPMLimitProps = NativeStackScreenProps<RootStackParamList, 'RPMLimit'>;

const RPMLimit: React.FC<RPMLimitProps> = ({ route }) => {
  const { device } = route.params;

  // State for RPM limit
  const [customModeCurrLimit, setCustomModeCurrLimit] = useState(105);
  const [receivedData, setReceivedData] = useState('');

  // CAN ID for RPM Limit
  const RPM_LIMIT_CAN_ID = 0x18F20209;

  // Convert decimal value to hex
  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 6000) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 6000.');
      return null;
    }
    return decimalNumber.toString(16).padStart(4, '0').toUpperCase(); // Pad to 4 hex digits
  };

  // Handle slider value change
  const handleSliderChange = (value: number) => {
    setCustomModeCurrLimit(value);
  };

  // Write data to BLE characteristic
  const writeDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const rpmLimitHex = convertDecimalToHex(customModeCurrLimit.toString());

    if (!rpmLimitHex) {
      return; // Stop if the input is invalid
    }

    try {
      // Create CAN message
      const canIdBuffer = Buffer.alloc(4);
      canIdBuffer.writeUInt32LE(RPM_LIMIT_CAN_ID); // Write CAN ID (little-endian)

      const dataBuffer = Buffer.alloc(8); // CAN payload (8 bytes)
      dataBuffer.writeUInt16BE(parseInt(rpmLimitHex, 16), 0); // Write RPM limit value in first 2 bytes
      // Remaining bytes can be filled as needed, e.g., dataBuffer[2], etc.

      // Combine CAN ID and payload
      const canMessage = Buffer.concat([canIdBuffer, dataBuffer]);
      const base64Data = canMessage.toString('base64');

      // Send the CAN message to the ESP32 via BLE
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);

      if (showAlert) {
        Alert.alert('Success', `RPM limit "${customModeCurrLimit}" sent to the device.`);
      }
    } catch (error: any) {
      console.error('Write failed', error);
      Alert.alert('Write Error', `Error writing data to device: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPM Limit Setup</Text>

      {/* Custom Mode Input */}
      <Text style={styles.label}>Custom Mode (0-6000 RPM)</Text>
      <TextInput
        style={styles.input}
        placeholder="0-6000"
        placeholderTextColor="#808080"
        value={customModeCurrLimit.toString()}
        onChangeText={(text) => setCustomModeCurrLimit(parseInt(text) || 0)}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={6000}
        step={1}
        value={customModeCurrLimit}
        onValueChange={handleSliderChange}
      />

      <Button title="WRITE" onPress={() => writeDataToCharacteristic(true)} />

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
    width: '60%',
    height: 35,
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

export default RPMLimit;
