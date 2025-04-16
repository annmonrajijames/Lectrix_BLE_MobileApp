import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

const SERVICE_RESET_CAN_ID = 0x18F60001; // CAN ID for service reset
const RESET_COMMAND = "RESET";           // Command to reset
const SERVICE_UUID = '00FF';             // Replace with actual service UUID
const CHARACTERISTIC_UUID = 'FF01';       // Replace with actual characteristic UUID

type Props = NativeStackScreenProps<RootStackParamList, 'Transmit'>;

type ReceivedInfo = {
  odoCluster: string;
  timestamp: string;
};

// Use the provided formatting function as-is (it uses local time)
const formatLocalISO = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const padMs = (num: number) => num.toString().padStart(3, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}.${padMs(date.getMilliseconds())}`;
};

const Transmit: React.FC<Props> = ({ route }) => {
  const { device } = route.params;
  const [receivedData, setReceivedData] = useState<ReceivedInfo | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const sendServiceReset = async () => {
    if (!device.isConnected) {
      Alert.alert('Error', 'Device is not connected. Please reconnect.');
      return;
    }

    try {
      const canIdBuffer = Buffer.alloc(4);
      canIdBuffer.writeUInt32LE(SERVICE_RESET_CAN_ID);
      const resetBuffer = Buffer.from(RESET_COMMAND, 'utf-8');
      const flagBuffer = Buffer.from([1]); // Flag is always "on" (1)
      const resetCommand = Buffer.concat([canIdBuffer, resetBuffer, flagBuffer]);
      const resetCommandBase64 = resetCommand.toString('base64');

      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        resetCommandBase64
      );
      Alert.alert('Success', 'Service reset message sent to the device.');
    } catch (error) {
      console.error('Failed to send service reset:', error);
      Alert.alert('Error', 'Failed to send service reset message. Please try again.');
    }
  };

  const confirmServiceReset = () => {
    Alert.alert(
      'Service Return icon',
      'Do you want to send the service reset command?',
      [
        { text: 'Cancel', onPress: () => console.log('Service reset cancelled'), style: 'cancel' },
        { text: 'Confirm', onPress: () => sendServiceReset() }
      ]
    );
  };

  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    };
  };

  const decodeData = (data: string) => {
    const odoCluster = eight_bytes_decode('05', 0.1, 14, 15)(data);
    if (odoCluster !== null) {
      const timestamp = formatLocalISO(new Date());
      console.log("Decoded Odo Cluster:", odoCluster, "at", timestamp);
      setReceivedData({ odoCluster: odoCluster.toString(), timestamp });
    } else {
      console.log("Packet does not match the expected format, ignoring...");
    }
  };

  const receiveData = async () => {
    if (!device.isConnected) {
      Alert.alert('Error', 'Device is not connected. Please reconnect.');
      return;
    }
    try {
      const sub = await device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            Alert.alert("Subscription Error", `Error subscribing to characteristic: ${(error as Error).message}`);
            return;
          }
  
          if (characteristic?.value) {
            const data = Buffer.from(characteristic.value, 'base64').toString('hex');
            console.log('Received raw data:', data);
            decodeData(data);
          }
        }
      );
      setSubscription(sub);
    } catch (error: any) {
      console.error("Failed to set up subscription:", error);
      Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      if (subscription) {
        if (typeof subscription.remove === 'function') {
          subscription.remove();
        } else {
          device.cancelConnection();
        }
      }
    };
  }, [subscription]);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        NOTE: This will reset your service icon
      </Text>
      <Button title="SEND SERVICE RESET" onPress={confirmServiceReset} color="red" />
      <View style={styles.spacer} />
      <Button title="RECEIVE" onPress={receiveData} />
      {receivedData && (
        <View style={styles.receivedContainer}>
          <Text style={styles.receivedText}>OdoCluster: {receivedData.odoCluster}</Text>
          <Text style={styles.receivedText}>Timestamp: {receivedData.timestamp}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
  receivedContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  receivedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Transmit;
