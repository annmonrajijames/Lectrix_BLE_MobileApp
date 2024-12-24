import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

type Props = NativeStackScreenProps<RootStackParamList, 'SOCTransmit'>;

const SERVICE_RESET_CAN_ID = 0x18F60001; // CAN ID for service reset
const RESET_COMMAND = "RESET";          // Command to reset
const SERVICE_UUID = '00FF';            // Replace with actual service UUID
const CHARACTERISTIC_UUID = 'FF01';    // Replace with actual characteristic UUID

const SOCTransmit: React.FC<Props> = ({ route }) => {
  const [socValue, setSocValue] = useState('');
  const [isChecked, setIsChecked] = useState(false); // State for service reset switch
  const { device } = route.params;

  // Function to send SOC value to the VCU via BLE
  const sendSOCValue = async () => {
    if (!socValue) {
      Alert.alert('Error', 'Please enter a valid SOC value.');
      return;
    }

    try {
      // Convert SOC value to Base64 using Buffer
      const socBuffer = Buffer.from(socValue, 'utf-8');
      const socBase64 = socBuffer.toString('base64');

      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        socBase64
      );

      Alert.alert('Success', `SOC value "${socValue}" sent to the device.`);
    } catch (error) {
      console.error('Failed to send SOC value:', error);
      Alert.alert('Error', 'Failed to send SOC value. Please try again.');
    }
  };

  // Function to send a service reset message via BLE
  const sendServiceReset = async () => {
    if (!device.isConnected) {
      Alert.alert('Error', 'Device is not connected. Please reconnect.');
      return;
    }

    try {
      // Prepare the service reset command
      const canIdBuffer = Buffer.alloc(4);
      canIdBuffer.writeUInt32LE(SERVICE_RESET_CAN_ID);

      const resetBuffer = Buffer.from(RESET_COMMAND, 'utf-8');
      const flagBuffer = Buffer.from([isChecked ? 1 : 0]); // Add flag for reset state

      const resetCommand = Buffer.concat([canIdBuffer, resetBuffer, flagBuffer]);
      const resetCommandBase64 = resetCommand.toString('base64');

      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        resetCommandBase64
      );

      Alert.alert('Success', 'Service reset message sent to the device.');
    } catch (error) {
      console.error('Failed to send service reset:', error);
      Alert.alert('Error', 'Failed to send service reset message. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter SOC Value:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={socValue}
        onChangeText={setSocValue}
        placeholder="Enter SOC value"
      />
      <Button title="Send SOC" onPress={sendSOCValue} />

      <Text style={styles.label}>Send Service Reset:</Text>
      <View style={styles.switchContainer}>
        <Switch value={isChecked} onValueChange={setIsChecked} />
        <Text style={styles.switchLabel}>Reset Required</Text>
      </View>
      <Button title="Send Service Reset" onPress={sendServiceReset} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SOCTransmit;
