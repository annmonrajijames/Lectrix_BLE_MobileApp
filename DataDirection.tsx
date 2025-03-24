// DataDirection.tsx

import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Add the 'Transmit' route type to the RootStackParamList.
type RootStackParamList = {
  DataDirection: { device: Device };
  Receive: { device: Device };
  PDIEOL: { device: Device };
  AddParameters: { device: Device };
  Transmit: { device: Device };
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const { ActivityStarter } = NativeModules;

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;
  console.log("MAC ID:" + device.id);

  // State to control password modal and input value.
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Check connection status and attempt reconnection if needed.
  useEffect(() => {
    const checkAndReconnect = async () => {
      if (!device) {
        Alert.alert("Error", "No BLE device found. Please reconnect.");
        return;
      }
      try {
        const isConnected = await device.isConnected();
        if (!isConnected) {
          console.log("Device is not connected. Attempting to reconnect...");
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
          console.log("Reconnection successful.");
        }
      } catch (error: any) {
        console.error("Error during reconnection:", error);
        Alert.alert("Connection Error", "Unable to reconnect to the device.");
      }
    };

    checkAndReconnect();
  }, [device]);

  const handleReceivePress = () => {
    ActivityStarter.navigateToReceiveActivity({ address: device.id });
  };

  // Handler for PDI-EOL button press that shows the password prompt modal.
  const handlePDIEOLPress = () => {
    setPasswordModalVisible(true);
  };

  // Check the entered password against the one stored in Firestore.
  const checkPassword = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, "authentication", "password");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const expectedPassword = docSnap.data().PDIEOL;
        if (passwordInput === expectedPassword) {
          setPasswordModalVisible(false);
          setPasswordInput('');
          navigation.navigate('PDIEOL', { device });
        } else {
          Alert.alert("Error", "Incorrect password.");
        }
      } else {
        Alert.alert("Error", "Authentication data not found.");
      }
    } catch (error) {
      console.error("Error fetching password:", error);
      Alert.alert("Error", "Failed to verify password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select Data Direction</Text>
      <Button title="Diagnose" onPress={handleReceivePress} />
      <Button title="Service Reset" onPress={() => navigation.navigate('Transmit', { device })} />
      <Button title="PDI-EOL" onPress={handlePDIEOLPress} />
      <Button title="Go to Add Parameters" onPress={() => navigation.navigate('AddParameters', { device })} />

      {/* Password Prompt Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              secureTextEntry={true}
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={checkPassword}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});

export default DataDirection;
