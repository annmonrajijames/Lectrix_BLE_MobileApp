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
      if (data.length >= 6 && data.slice(0, 2) === '01') {  // Check if the first byte is '01'
        const secondByte = data.slice(2, 4);
        const thirdByte = data.slice(4, 6);
        const concatenated = `${thirdByte}${secondByte}`;
        const decimalValue = parseInt(concatenated, 16);
        const calculatedSpeed = decimalValue * 0.01606; // Convert the speed value appropriately if needed
        setMotorSpeed(calculatedSpeed);
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
      {motorSpeed === null && <Text>No Data Received Yet</Text>}
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
    color: '#0000FF', // Sets the text color to blue
    fontSize: 20, // Sets the size of the font
    fontWeight: 'bold', // Makes the font bold
  },
});

export default DataTransfer;
