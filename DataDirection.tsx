// DataDirection.tsx

import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

  // State for PDI-EOL password modal.
  const [pdiEolModalVisible, setPdiEolModalVisible] = useState(false);
  const [pdiEolInput, setPdiEolInput] = useState('');

  // State for Service Reset password modal.
  const [serviceResetModalVisible, setServiceResetModalVisible] = useState(false);
  const [serviceResetInput, setServiceResetInput] = useState('');

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

  // Handle PDI-EOL button press.
  const handlePdiEolPress = () => {
    setPdiEolModalVisible(true);
  };

  // Handle SERVICE RESET button press.
  const handleServiceResetPress = () => {
    setServiceResetModalVisible(true);
  };

  // Verify the password for PDI-EOL.
  const checkPdiEolPassword = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, "authentication", "password");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const expectedPassword = docSnap.data().PDIEOL;
        if (pdiEolInput === expectedPassword) {
          setPdiEolModalVisible(false);
          setPdiEolInput('');
          navigation.navigate('PDIEOL', { device });
        } else {
          Alert.alert("Error", "Incorrect password.");
        }
      } else {
        Alert.alert("Error", "Authentication data not found.");
      }
    } catch (error) {
      console.error("Error fetching PDI-EOL password:", error);
      Alert.alert("Error", "Failed to verify password.");
    }
  };

  // Verify the password for Service Reset.
  const checkServiceResetPassword = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, "authentication", "password1");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const expectedPassword = docSnap.data().ServiceReset;
        if (serviceResetInput === expectedPassword) {
          setServiceResetModalVisible(false);
          setServiceResetInput('');
          navigation.navigate('Transmit', { device });
        } else {
          Alert.alert("Error", "Incorrect password.");
        }
      } else {
        Alert.alert("Error", "Authentication data not found.");
      }
    } catch (error) {
      console.error("Error fetching Service Reset password:", error);
      Alert.alert("Error", "Failed to verify password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select Data Direction</Text>
      <Button title="Diagnose" onPress={handleReceivePress} />
      <Button title="SERVICE RESET" onPress={handleServiceResetPress} />
      <Button title="PDI-EOL" onPress={handlePdiEolPress} />
      <Button title="Go to Add Parameters" onPress={() => navigation.navigate('AddParameters', { device })} />

      {/* Modal for PDI-EOL password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pdiEolModalVisible}
        onRequestClose={() => setPdiEolModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password for PDI-EOL</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              secureTextEntry={true}
              value={pdiEolInput}
              onChangeText={setPdiEolInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={() => setPdiEolModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={checkPdiEolPassword}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Service Reset password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={serviceResetModalVisible}
        onRequestClose={() => setServiceResetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password for Service Reset</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              secureTextEntry={true}
              value={serviceResetInput}
              onChangeText={setServiceResetInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={() => setServiceResetModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={checkServiceResetPassword}>
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
