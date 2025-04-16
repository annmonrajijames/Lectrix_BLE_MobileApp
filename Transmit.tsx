import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Geolocation from '@react-native-community/geolocation';
import { db } from "./firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

const SERVICE_RESET_CAN_ID = 0x18F60001; // CAN ID for service reset
const RESET_COMMAND = "RESET";           // Command to reset
const SERVICE_UUID = '00FF';             // Replace with actual service UUID
const CHARACTERISTIC_UUID = 'FF01';       // Replace with actual characteristic UUID

type Props = NativeStackScreenProps<RootStackParamList, 'Transmit'>;

// Define a type to hold the decoded value, timestamp, and location coordinates.
type ReceivedInfo = {
  odoCluster: string;
  timestamp: string;
  latitude: number;
  longitude: number;
};

// Provided timestamp formatter (using local time)
const formatLocalISO = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const padMs = (num: number) => num.toString().padStart(3, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMs(date.getMilliseconds())}`;
};

const Transmit: React.FC<Props> = ({ route }) => {
  const { device } = route.params;
  
  // States for the two entry fields.
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [userName, setUserName] = useState('');
  
  // State for the received BLE data.
  const [receivedData, setReceivedData] = useState<ReceivedInfo | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // Helper function for BLE data decoding.
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

  // Retrieve and decode the BLE data.
  const decodeData = (data: string) => {
    const odoCluster = eight_bytes_decode('05', 0.1, 14, 15)(data);
    if (odoCluster !== null) {
      const timestamp = formatLocalISO(new Date());
      // Retrieve current location using the community Geolocation module.
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log("Decoded OdoCluster:", odoCluster, "Timestamp:", timestamp, "Lat:", latitude, "Long:", longitude);
          setReceivedData({
            odoCluster: odoCluster.toString(),
            timestamp,
            latitude,
            longitude
          });
        },
        error => {
          console.error("Error getting location", error);
          // Use fallback values if location retrieval fails.
          setReceivedData({
            odoCluster: odoCluster.toString(),
            timestamp,
            latitude: 0,
            longitude: 0
          });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("Packet does not match the expected format, ignoring...");
    }
  };

  // Subscribes to BLE notifications.
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

  // When component unmounts, cancel subscription.
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

  // Returns true if both vehicle number and user name are entered.
  const isResetEnabled = vehicleNumber.trim().length > 0 && userName.trim().length > 0;

  // This function is called when the user confirms the reset in the dialog.
  const handleServiceReset = async () => {
    try {
      // Prepare and send the service reset command via BLE.
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

      // Push the data to Firebase.
      if (receivedData) {
        const docRef = doc(collection(db, 'Service_reset'), receivedData.timestamp);
        await setDoc(docRef, {
          vehicleNumber,
          userName,
          odoCluster: receivedData.odoCluster,
          timestamp: receivedData.timestamp,
          latitude: receivedData.latitude,
          longitude: receivedData.longitude,
        });
      }

      // Show success dialog with data.
      Alert.alert(
        'Success',
        `Service reset message sent to the device.\nOdoCluster: ${receivedData?.odoCluster}\nTimestamp: ${receivedData?.timestamp}\nLatitude: ${receivedData?.latitude}\nLongitude: ${receivedData?.longitude}`
      );
    } catch (error) {
      console.error("Failed to send service reset or push data to Firebase:", error);
      Alert.alert("Error", "Failed to send service reset message or push data to Firebase. Please try again.");
    }
  };

  // Function to show the confirmation dialog.
  const confirmServiceReset = () => {
    if (!receivedData) {
      // If BLE data has not been received yet, notify the user.
      Alert.alert('Service Return icon', 'Data (OdoCluster, Latitude, Longitude) not available yet. Please tap "RECEIVE" first.');
      return;
    }

    // Construct the dialog message with the BLE data.
    const message = `OdoCluster: ${receivedData.odoCluster}\nLatitude: ${receivedData.latitude}\nLongitude: ${receivedData.longitude}`;

    Alert.alert(
      'Service Return icon',
      message,
      [
        { text: 'Cancel', onPress: () => console.log('Service reset cancelled'), style: 'cancel' },
        { text: 'Confirm', onPress: () => handleServiceReset() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>NOTE: This will reset your service icon.</Text>
      
      {/* Vehicle Number entry */}
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />
      
      {/* User Name entry */}
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={setUserName}
      />
      
      <View style={styles.spacer} />
      
      {/* "SEND SERVICE RESET" button is enabled only if both fields are entered */}
      <Button
        title="SEND SERVICE RESET"
        onPress={confirmServiceReset}
        disabled={!isResetEnabled}
        color={isResetEnabled ? "red" : "gray"}
      />
      
      <View style={styles.spacer} />
      
      <Button title="RECEIVE" onPress={receiveData} />
      
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 4,
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
