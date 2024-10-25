import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Device, BleError } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

type LogEntry = {
  data: string;
};

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [log, setLog] = useState<LogEntry[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';
  const dataBuffer = useRef<LogEntry[]>([]);
  const updateInterval = 500; // Adjust the batch update interval as needed
  let count = 0;
  useEffect(() => {
    const connectToDevice = async () => {
      try {
        if (!await device.isConnected()) {
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
        }

        device.onDisconnected(() => {
          console.log("Device disconnected. Trying to reconnect...");
          setTimeout(connectToDevice, 5000);
        });

        await device.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          (error: BleError | null, characteristic) => {
            if (error) {
              Alert.alert("Subscription Error", error.message);
              return;
            }

            if (characteristic?.value) {
              const data = Buffer.from(characteristic.value, 'base64').toString('hex');
              count=count+1;
              console.log("Count="+count);
              dataBuffer.current.push({ data });
            }
          }
        );
      } catch (error: any) {
        Alert.alert("Connection Error", error.message);
      }
    };

    connectToDevice();

    // Periodically update the log state from the buffer
    const intervalId = setInterval(() => {
      if (dataBuffer.current.length > 0) {
        setLog(prevLog => [...prevLog, ...dataBuffer.current]);
        dataBuffer.current = [];
      }
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
      device.cancelConnection();
    };
  }, [device]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Data Receiving Page</Text>
      <ScrollView ref={scrollViewRef}>
        {log.map((entry, index) => (
          <View key={index}>
            <Text>Data: {entry.data}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DataTransfer;
