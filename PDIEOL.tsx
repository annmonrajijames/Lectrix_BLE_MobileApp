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
  const [SW_Version_MAJDecoder, setSW_Version_MAJDecoder] = useState<number | null>(null);
  const [SW_Version_MINDecoder, setSW_Version_MINDecoder] = useState<number | null>(null);
  const [HW_Version_MAJDecoder, setHW_Version_MAJDecoder] = useState<number | null>(null);
  const [HW_Version_MINDecoder, setHW_Version_MINDecoder] = useState<number | null>(null); 
  
  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            // Proper handling of 'unknown' type error using type assertion
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
        // Proper handling of catch block error using type assertion
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    }
  }

  const decodeData = (data: string) => {
    const SW_Version_MAJDecoder = eight_bytes_decode("05", 1.0, 9)(data);
    const SW_Version_MINDecoder = eight_bytes_decode("05", 1.0, 10)(data);
    const HW_Version_MAJDecoder = eight_bytes_decode("05", 1.0, 11)(data);
    const HW_Version_MINDecoder = eight_bytes_decode("05", 1.0, 12)(data); 
    

    if (SW_Version_MAJDecoder !== null) setSW_Version_MAJDecoder(SW_Version_MAJDecoder);
    if (SW_Version_MINDecoder !== null) setSW_Version_MINDecoder(SW_Version_MINDecoder);
    if (HW_Version_MAJDecoder !== null) setHW_Version_MAJDecoder(HW_Version_MAJDecoder);
    if (HW_Version_MINDecoder !== null) setHW_Version_MINDecoder(HW_Version_MINDecoder);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {SW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>SW_Version_MAJDecoder: {SW_Version_MAJDecoder.toFixed(4)} V</Text>}
        {SW_Version_MINDecoder !== null && <Text style={styles.parameterText}>SW_Version_MINDecoder: {SW_Version_MINDecoder.toFixed(4)} V</Text>}
        {HW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>HW_Version_MAJDecoder: {HW_Version_MAJDecoder.toFixed(4)} V</Text>}
        {HW_Version_MINDecoder !== null && <Text style={styles.parameterText}>HW_Version_MINDecoder: {HW_Version_MINDecoder.toFixed(4)} V</Text>}
        
        {SW_Version_MAJDecoder === null && SW_Version_MINDecoder === null && HW_Version_MAJDecoder === null && HW_Version_MINDecoder === null &&  
 <Text>No Data Received Yet</Text>}
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
  parameterText: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
