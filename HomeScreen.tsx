import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { writeSOCData } from './SOCTransmit'; // Import the new SOC data handler

const HomeScreen: React.FC = () => {
  const [device, setDevice] = useState<Device | null>(null);
  const [socValue, setSOCValue] = useState('75'); // Example SOC value

  useEffect(() => {
    // You can add code here for scanning and connecting to the device
  }, []);

  const handleSendSOCData = () => {
    if (device) {
      const serviceUUID = '00FF'; // Replace with your service UUID
      const characteristicUUID = 'FF01'; // Replace with your characteristic UUID
      writeSOCData(device, serviceUUID, characteristicUUID, socValue);
    } else {
      Alert.alert('No Device Connected', 'Please connect to a BLE device first.');
    }
  };

  return (
    <View>
      <Text>Send SOC Data to ESP32</Text>
      <Button title="Send SOC Data" onPress={handleSendSOCData} />
    </View>
  );
};

export default HomeScreen;
