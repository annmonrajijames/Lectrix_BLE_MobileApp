import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Geolocation from '@react-native-community/geolocation';
import { db } from "./firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

const SERVICE_RESET_CAN_ID = 0x18F60001;
const RESET_COMMAND = "RESET";
const SERVICE_UUID = '00FF';
const CHARACTERISTIC_UUID = 'FF01';

type Props = NativeStackScreenProps<RootStackParamList, 'Transmit'>;

type ReceivedInfo = {
  odoCluster: string;
  timestamp: string;
  latitude: number;
  longitude: number;
};

const formatLocalISO = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const padMs = (n: number) => n.toString().padStart(3, "0");
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMs(date.getMilliseconds())}`;
};

const Transmit: React.FC<Props> = ({ route }) => {
  const { device } = route.params;
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [receivedData, setReceivedData] = useState<ReceivedInfo | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const eightBytesDecode = (prefix: string, multiplier: number, ...positions: number[]) => {
    return (hex: string) => {
      if (hex.startsWith(prefix) && hex.length >= 2 * positions.length) {
        const bytes = positions.map(p => hex.substr(2*p, 2)).join('');
        return parseInt(bytes, 16) * multiplier;
      }
      return null;
    };
  };

  const decodeData = (hex: string) => {
    const odo = eightBytesDecode('05', 0.1, 14, 15)(hex);
    if (odo !== null) {
      const timestamp = formatLocalISO(new Date());
      Geolocation.getCurrentPosition(
        pos => setReceivedData({ odoCluster: odo.toString(), timestamp, latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setReceivedData({ odoCluster: odo.toString(), timestamp, latitude: 0, longitude: 0 }),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const receiveData = async () => {
    if (!device.isConnected) {
      return Alert.alert('Error', 'Device not connected');
    }
    try {
      const sub = await device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (err, char) => {
          if (err) return Alert.alert('Subscription Error', err.message);
          if (char?.value) {
            const hex = Buffer.from(char.value, 'base64').toString('hex');
            decodeData(hex);
          }
        }
      );
      setSubscription(sub);
    } catch (e: any) {
      Alert.alert('Receive Error', e.message);
    }
  };

  useEffect(() => { receiveData(); }, []);
  useEffect(() => {
    return () => {
      if (subscription) {
        typeof subscription.remove === 'function'
          ? subscription.remove()
          : device.cancelConnection();
      }
    };
  }, [subscription]);

  const isResetEnabled = !!vehicleNumber.trim() && !!userName.trim();

  const handleServiceReset = async () => {
    // Ensure connection
    try {
      if (!device.isConnected) {
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
      }
    } catch {
      // ignore
    }

    const canBuf = Buffer.alloc(4);
    canBuf.writeUInt32LE(SERVICE_RESET_CAN_ID);
    const resetBuf = Buffer.from(RESET_COMMAND);
    const flagBuf = Buffer.from([1]);
    const payload = Buffer.concat([canBuf, resetBuf, flagBuf]).toString('base64');

    let bleOk = false;
    // Try withResponse first
    try {
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        payload
      );
      bleOk = true;
    } catch (e1) {
      console.warn('withResponse timeout:', e1);
      // Retry without response
      try {
        await device.writeCharacteristicWithoutResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          payload
        );
        bleOk = true;
      } catch (e2) {
        console.warn('withoutResponse failed:', e2);
        // Attempt reconnect and retry
        try {
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
          await device.writeCharacteristicWithoutResponseForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            payload
          );
          bleOk = true;
        } catch (e3) {
          console.error('Reconnect/write failed:', e3);
        }
      }
    }

    if (!bleOk) {
      return Alert.alert('BLE Error', 'Could not send reset to device.');
    }

    if (receivedData) {
      try {
        const ref = doc(collection(db, 'Service_reset'), receivedData.timestamp);
        await setDoc(ref, {
          vehicleNumber,
          userName,
          odoCluster: receivedData.odoCluster,
          timestamp: receivedData.timestamp,
          latitude: receivedData.latitude,
          longitude: receivedData.longitude,
        });
        Alert.alert('Success', 'Data pushed to Firebase.');
      } catch (fb) {
        console.error('FB error:', fb);
        Alert.alert('Firebase Error', 'Failed to push data.');
      }
    } else {
      Alert.alert('Info', 'No BLE data to push.');
    }
  };

  const confirmServiceReset = () => {
    if (!receivedData) {
      return Alert.alert('Service Return icon', 'Waiting for BLE data...');
    }
    Alert.alert(
      'Service Return icon',
      `OdoCluster: ${receivedData.odoCluster}\nLatitude: ${receivedData.latitude}\nLongitude: ${receivedData.longitude}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: handleServiceReset }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>NOTE: This will reset your service icon.</Text>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={setUserName}
      />
      <View style={styles.spacer} />
      <Button
        title="SEND SERVICE RESET"
        onPress={confirmServiceReset}
        disabled={!isResetEnabled}
        color={isResetEnabled ? 'red' : 'gray'}
      />
      {receivedData && (
        <View style={styles.receivedContainer}>
          <Text style={styles.receivedText}>OdoCluster: {receivedData.odoCluster}</Text>
          <Text style={styles.receivedText}>Timestamp: {receivedData.timestamp}</Text>
          <Text style={styles.receivedText}>Latitude: {receivedData.latitude}</Text>
          <Text style={styles.receivedText}>Longitude: {receivedData.longitude}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  description: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, marginVertical: 10, borderRadius: 4 },
  spacer: { height: 20 },
  receivedContainer: { marginTop: 20, alignItems: 'center' },
  receivedText: { fontSize: 16, textAlign: 'center' },
});

export default Transmit;
