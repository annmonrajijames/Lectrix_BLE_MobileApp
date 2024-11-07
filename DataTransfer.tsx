import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [motorSpeed, setMotorSpeed] = useState<number | null>(null);
  const [batteryVoltage, setBatteryVoltage] = useState<number | null>(null);
  const [batteryCurrent, setBatteryCurrent] = useState<number | null>(null);

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            Alert.alert("Subscription Error", `Error subscribing to characteristic: ${error.message}`);
            return;
          }

          if (characteristic?.value) {
            const data = Buffer.from(characteristic.value, 'base64').toString('hex');
            decodeData(data);
          }
        });
      } catch (error) {
        console.error("Failed to set up subscription:", error);
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

  const eight_bytes_decode = (firstByteCheck, multiplier, ...positions) => {
    return (data) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    }
  }

  const decodeData = (data) => {
    const speed = eight_bytes_decode('01', 0.01606, 2, 1)(data);  // Reversed order for little-endian
    const voltage = eight_bytes_decode('01', 1, 3)(data); // Single byte
    const current = eight_bytes_decode('01', 1, 5, 4)(data); // Reversed order for little-endian

    if (speed !== null) setMotorSpeed(speed);
    if (voltage !== null) setBatteryVoltage(voltage);
    if (current !== null) setBatteryCurrent(current);
  };

  return (
    <View style={styles.container}>
      {motorSpeed !== null && <Text style={styles.speedText}>Motor Speed: {motorSpeed.toFixed(2)} km/h</Text>}
      {batteryVoltage !== null && <Text style={styles.voltageText}>Battery Voltage: {batteryVoltage} V</Text>}
      {batteryCurrent !== null && <Text style={styles.currentText}>Battery Current: {batteryCurrent} A</Text>}
      {motorSpeed === null && batteryVoltage === null && batteryCurrent === null && <Text>No Data Received Yet</Text>}
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
  speedText: {
    color: '#0000FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  voltageText: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  currentText: {
    color: '#00FF00', // Use green color for current text
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DataTransfer;
