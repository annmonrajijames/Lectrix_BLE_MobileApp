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
  const [mode, setMode] = useState<string | null>(null);

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

  const three_bit_decode = (firstByteCheck: number, bytePosition: number, bit1: number, bit2: number, bit3: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck.toString().padStart(2, '0')) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        const resultBits = bits[7 - bit1] + bits[7 - bit2] + bits[7 - bit3];
        return parseInt(resultBits, 2);  // Convert to decimal to simplify switch-case logic
      }
      return null;
    }
  }

  const decodeData = (data: string) => {
    const modeValue = three_bit_decode(2, 7, 2, 1, 0)(data);
    switch (modeValue) {
      case 0b100: // Binary literal for '100'
        setMode("Eco Mode");
        break;
      case 0b010: // Binary literal for '010'
        setMode("Normal Mode");
        break;
      case 0b110: // Binary literal for '110'
        setMode("Fast Mode");
        break;
      default:
        setMode(null);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {mode !== null ? <Text style={styles.modeText}>Mode: {mode}</Text> : <Text>No Mode Data Received</Text>}
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
  modeText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
