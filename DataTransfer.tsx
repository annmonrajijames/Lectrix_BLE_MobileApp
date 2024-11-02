import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [receivedData, setReceivedData] = useState<Array<{ category: number, data: string }>>([]);

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
            const firstByteString = data.substring(0, 2);  // Get the first two characters (one byte)
            const category = parseInt(firstByteString, 10);  // Parse as decimal
            setReceivedData(prevData => [...prevData.filter(d => d.category !== category), { category, data }]);
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
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Receiving Page</Text>
      <ScrollView style={styles.dataContainer}>
        {receivedData.sort((a, b) => a.category - b.category).map((dataItem, index) => (
          <View key={index} style={styles.dataBox}>
            <Text>Category {dataItem.category}: {dataItem.data}</Text>
          </View>
        ))}
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
  dataContainer: {
    width: '100%',
  },
  dataBox: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default DataTransfer;
