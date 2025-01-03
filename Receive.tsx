import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  Receive: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'Receive'>;

const Receive: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [dataReceived, setDataReceived] = useState<string | null>(null);

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
            setDataReceived(data);
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

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {dataReceived ? <Text style={styles.dataText}>Data Received: {dataReceived}</Text> : <Text>No Data Received Yet</Text>}
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
  dataText: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Receive;
