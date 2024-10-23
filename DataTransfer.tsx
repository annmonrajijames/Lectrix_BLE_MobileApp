import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import moment from 'moment-timezone';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

type LogEntry = {
  data: string;
  timeReceived: string;
};

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [soc, setSoc] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const connectToDevice = async () => {
      try {
        const connected = await device.isConnected();
        if (!connected) {
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
          setIsConnected(true);
          console.log("Connected to device.");
        }

        device.onDisconnected(() => {
          setIsConnected(false);
          console.log("Device disconnected. Trying to reconnect...");
          setTimeout(() => reconnectToDevice(), 5000);
        });

        await device.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          (error, characteristic) => {
            if (error) {
              console.error("Subscription error:", error);
              Alert.alert("Subscription Error", `Error subscribing to characteristic: ${error.message}`);
              return;
            }

            if (characteristic?.value) {
              const data = Buffer.from(characteristic.value, 'base64').toString('hex');
              const firstByte = data.substring(0, 2); // Get the first byte
              const decimalValue = parseInt(firstByte, 16); // Convert hex to decimal
              setSoc(decimalValue); // Set State of Charge
            }
          }
        );
      } catch (error: any) {
        console.error("Failed to connect or subscribe:", error);
        Alert.alert("Connection Error", `Error connecting to the device: ${error.message}`);
        setIsConnected(false);
      }
    };

    const reconnectToDevice = async () => {
      try {
        const connected = await device.isConnected();
        if (!connected) {
          console.log("Attempting to reconnect...");
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
          setIsConnected(true);
          console.log("Reconnected successfully.");
          connectToDevice();
        } else {
          console.log("Device already connected.");
        }
      } catch (reconnectError: any) {
        console.error("Reconnection failed, retrying in 5 seconds...", reconnectError);
        setTimeout(() => reconnectToDevice(), 5000);
      }
    };

    connectToDevice();

    return () => {
      device.cancelConnection();
    };
  }, [device]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>State of Charge</Text>
      {soc !== null ? (
        <Text style={styles.socDisplay}>{`${soc}%`}</Text>
      ) : (
        <Text style={styles.noData}>No Data Received Yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // White background
  },
  title: {
    color: '#0000FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  socDisplay: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#32CD32', // Lime green
  },
  noData: {
    fontSize: 20,
    color: '#ff0000', // Red
  },
});

export default DataTransfer;
