import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [ignitionStatus, setIgnitionStatus] = useState<string | null>(null);
  const [loadDetection, setLoadDetection] = useState<string | null>(null);

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            Alert.alert("Subscription Error", `Error subscribing to characteristic: ${(error as Error).message}`);
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

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

  const bit_decode = (firstByteCheck: number, bytePosition: number, bitPosition: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck.toString()) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        return bits[7 - bitPosition] === '1' ? "ON" : "OFF";
      }
      return null;
    }
  }

  const decodeData = (data: string) => {
    const ignition = bit_decode(11, 18, 0)(data);
    const load = bit_decode(11, 18, 6)(data);

    if (ignition !== null) setIgnitionStatus(ignition);
    if (load !== null) setLoadDetection(load);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {ignitionStatus !== null && <Text style={styles.statusText}>Ignition Status: {ignitionStatus}</Text>}
        {loadDetection !== null && <Text style={styles.statusText}>Load Detection: {loadDetection}</Text>}
        {ignitionStatus === null && loadDetection === null && <Text>No Data Received Yet</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
