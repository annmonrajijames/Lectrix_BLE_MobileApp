import React from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

type Props = NativeStackScreenProps<RootStackParamList, 'Transmit'>;

const SERVICE_RESET_CAN_ID = 0x18F60001; // CAN ID for service reset
const RESET_COMMAND = "RESET";          // Command to reset
const SERVICE_UUID = '00FF';            // Replace with actual service UUID
const CHARACTERISTIC_UUID = 'FF01';      // Replace with actual characteristic UUID

const Transmit: React.FC<Props> = ({ route }) => {
  const { device } = route.params;

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
      // Flag is always "on" (1)
      const flagBuffer = Buffer.from([1]);

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

  // Function to show confirmation dialog before sending service reset
  const confirmServiceReset = () => {
    Alert.alert(
      'Service Return icon',
      'Do you want to send the service reset command?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Service reset cancelled'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => sendServiceReset(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        NOTE: This will reset your service icon
      </Text>
      <Button title="SEND SERVICE RESET" onPress={confirmServiceReset} color="red" />
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
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Transmit;
