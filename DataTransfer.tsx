import React, { useState, useEffect, useRef } from 'react';
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
};

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null); // Timestamp of the last received data
  const [isConnected, setIsConnected] = useState(false);

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';
  const scrollViewRef = useRef<ScrollView>(null); // Reference to the ScrollView

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

              // Format time to IST with milliseconds
              const timeReceived = moment(currentTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');

              setLastTime(currentTime); // Update lastTime to the current timestamp

              // Add new log entry
              setLog(prevLog => {
                const updatedLog = [...prevLog, { data, timeReceived }];
                // Scroll to end when a new entry is added
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100); // Slight delay to ensure entry is rendered
                return updatedLog;
              });
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
      <ScrollView
        ref={scrollViewRef}
        style={styles.logContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {log.length > 0 ? (
          log.map((entry, index) => (
            <View key={index} style={styles.logEntry}>
              <Text style={{ color: 'green' }}>Data: {entry.data}</Text>
              <Text style={{ color: 'green' }}>Received at: {entry.timeReceived} IST</Text>
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
  scrollContent: {
    paddingBottom: 20, // Add padding to ensure there's space for scrolling
  },
  logEntry: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
});

export default DataTransfer;