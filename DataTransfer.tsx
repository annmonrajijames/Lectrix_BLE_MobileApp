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
      } catch (error: any) {
        console.error("Failed to set up subscription:", error);
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };

    const decodeData = (data: string) => {
      if (data.length >= 12 && data.slice(0, 2) === '01') {  // Check if the first byte is '01'
        // Decode Motor Speed
        const secondByte = data.slice(2, 4);
        const thirdByte = data.slice(4, 6);
        const concatenatedSpeed = `${thirdByte}${secondByte}`;
        const decimalSpeed = parseInt(concatenatedSpeed, 16);
        const calculatedSpeed = decimalSpeed * 0.01606;
        setMotorSpeed(calculatedSpeed);

        // Decode Battery Voltage
        const fourthByte = data.slice(6, 8);
        const batteryDecimal = parseInt(fourthByte, 16);
        setBatteryVoltage(batteryDecimal);

        // Decode Battery Current
        const fifthByte = data.slice(8, 10);
        const sixthByte = data.slice(10, 12);
        const concatenatedCurrent = `${sixthByte}${fifthByte}`;
        const decimalCurrent = parseInt(concatenatedCurrent, 16);
        setBatteryCurrent(decimalCurrent);
      }
    };

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

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
