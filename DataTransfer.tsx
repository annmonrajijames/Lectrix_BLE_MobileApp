import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import moment from 'moment-timezone'; // For handling IST time format

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

type LogEntry = {
  data: string;
  timeReceived: string;
  timeTaken: string;
};

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null); // Timestamp of the last received data
  const [isConnected, setIsConnected] = useState(false);

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const connectToDevice = async () => {
      try {
        // Connect and discover services/characteristics
        const connected = await device.isConnected();
        if (!connected) {
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
          setIsConnected(true);
          console.log("Connected to device.");
        }

        // Monitor connection state
        device.onDisconnected(() => {
          setIsConnected(false);
          console.log("Device disconnected. Trying to reconnect...");
          setTimeout(() => reconnectToDevice(), 5000); // Attempt reconnection after a delay
        });

        // Subscribe to the characteristic
        await device.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          (error, characteristic) => {
            if (error) {
              console.error("Subscription error:", error);
              Alert.alert("Subscription Error", `Error subscribing to characteristic: ${error.message}`);
              return;
            }

            // If characteristic data is available
            if (characteristic?.value) {
              const data = Buffer.from(characteristic.value, 'base64').toString('hex');
              const currentTime = Date.now();

              // Format time to IST
              const timeReceived = moment(currentTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

              // Calculate time taken to receive the data (if it's not the first entry)
              let timeTaken = "N/A"; // For the first entry
              if (lastTime !== null) {
                const diff = currentTime - lastTime;
                timeTaken = `${diff} ms`;
              }

              setLastTime(currentTime); // Update lastTime to the current timestamp

              // Add new log entry
              setLog(prevLog => [
                ...prevLog,
                { data, timeReceived, timeTaken }
              ]);
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
          connectToDevice(); // Re-setup the subscription after reconnection
        } else {
          console.log("Device already connected.");
        }
      } catch (reconnectError: any) {
        console.error("Reconnection failed, retrying in 5 seconds...", reconnectError);
        // Introduce a delay before retrying
        setTimeout(() => reconnectToDevice(), 5000);
      }
    };

    connectToDevice(); // Initial connection

    return () => {
      device.cancelConnection(); // Ensure cleanup on component unmount
    };
  }, [device]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Receiving Page</Text>
      <ScrollView style={styles.logContainer}>
        {log.length > 0 ? (
          log.map((entry, index) => (
            <View key={index} style={styles.logEntry}>
              <Text>Data: {entry.data}</Text>
              <Text>Received at: {entry.timeReceived} IST</Text>
              <Text>Time taken: {entry.timeTaken}</Text>
            </View>
          ))
        ) : (
          <Text>No Data Received Yet</Text>
        )}
      </ScrollView>
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
  title: {
    color: '#0000FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  logEntry: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
});

export default DataTransfer;
