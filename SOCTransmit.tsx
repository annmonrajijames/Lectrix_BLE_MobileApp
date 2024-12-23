import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

type Props = NativeStackScreenProps<RootStackParamList, 'SOCTransmit'>;

const SERVICE_RESET_CAN_ID = 0x18F60001;  // CAN ID for service reset
const RESET_COMMAND = "RESET";  // Command to reset

const SOCTransmit: React.FC<Props> = ({ route }) => {
  const [isChecked, setIsChecked] = useState(false); // State to track slider position
  const { device } = route.params;
  const [socValue, setSocValue] = useState('');

  // Function to send SOC value to the VCU via BLE
  const sendSOCValue = async () => {
    try {
      if (!socValue) {
        Alert.alert('Error', 'Please enter a valid SOC value.');
        return;
      }

      const serviceUUID = '00FF'; // Service UUID for SOC value (replace with actual)
      const characteristicUUID = 'FF01'; // Characteristic UUID for SOC value (replace with actual)

      // Convert the SOC value to Base64 using Buffer
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(socValue, 'utf-8').toString('base64')
      );

      Alert.alert('Success', `SOC value "${socValue}" sent to the device.`);
    } catch (error) {
      console.error('Failed to send SOC value:', error);
      Alert.alert('Error', 'Failed to send SOC value. Please try again.');
    }
  };

  const sendServiceReset = async () => {
    try {
      // Check if the device is connected
      if (!device.isConnected()) {
        Alert.alert('Error', 'Device is not connected. Please reconnect.');
        return;
      }
  
      // Prepare the reset command buffer
      const resetCommand = Buffer.concat([
        Buffer.from([SERVICE_RESET_CAN_ID & 0xff, (SERVICE_RESET_CAN_ID >> 8) & 0xff]),
        Buffer.from(RESET_COMMAND, 'utf-8'),
        Buffer.from([isChecked ? 1 : 0])
      ]);
  
      console.log("Reset Command Buffer:", resetCommand);
  
      // Convert to Base64 and send the command
      const resetCommandBase64 = resetCommand.toString('base64');
  
      // Introduce a delay to avoid flooding the connection with writes
      setTimeout(async () => {
        await device.writeCharacteristicWithResponseForService(
          '00FF',  // Service UUID for reset
          'FF01',  // Characteristic UUID for reset
          resetCommandBase64 // Send Base64-encoded string
        );
  
        Alert.alert('Success', 'Service reset message sent to the device.');
      }, 100);  // Introduce a 100ms delay between writes
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
      <View style={styles.checkboxContainer}>
        <Switch
          value={isChecked}
          onValueChange={setIsChecked}
        />
        <Text style={styles.checkboxLabel}>Reset Required</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SOCTransmit;
