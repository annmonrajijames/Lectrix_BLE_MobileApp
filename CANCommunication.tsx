import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';

type CANCommunicationProps = {
  device: Device;
};

const CANCommunication: React.FC<CANCommunicationProps> = ({ device }) => {
  const [canID, setCanID] = useState<string>('');
  const [data, setData] = useState<string>('');

  // Handle sending CAN data
  const sendCANData = async () => {
    if (!canID || !data) {
      Alert.alert('Error', 'Please provide both CAN ID and data to send.');
      return;
    }

    // Prepare data to send as bytes (e.g., "01 02 03")
    const messageBytes = data.split(' ').map((hex) => parseInt(hex, 16));

    // Check if the data is correctly formatted as a CAN message
    if (messageBytes.length < 5) {
      Alert.alert('Error', 'Invalid CAN data format. Ensure it is in the format "01 02 03 ..."');
      return;
    }

    // Convert the messageBytes to Uint8Array for BLE transmission
    const messageArray = new Uint8Array(messageBytes);

    try {
      // Send the CAN data to the ESP32 device
      await device.writeCharacteristicWithResponseForService(
        '00FF', // Use your service UUID
        'FF01', // Use your characteristic UUID
        hexString
      );
      console.log('Data sent:', messageArray);
      Alert.alert('Success', 'CAN message sent successfully!');
    } catch (error) {
      console.error('Send data failed', error);
      Alert.alert('Error', 'Failed to send CAN data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CAN Communication</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter CAN ID (in hex)"
        value={canID}
        onChangeText={setCanID}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter CAN data (in hex, e.g., 01 02 03)"
        value={data}
        onChangeText={setData}
      />
      <Button title="Send CAN Data" onPress={sendCANData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginVertical: 10,
  },
});

export default CANCommunication;
