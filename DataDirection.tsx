// DataDirection.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import your initialized Firestore instance

type RootStackParamList = {
  DataDirection: { device: Device };
  Receive: { device: Device };
  PDIEOL: { device: Device };
  AddParameters: { device: Device };
  Transmit: { device: Device };
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const { ActivityStarter } = NativeModules;

// Custom Button component for nicer styling
interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <Text style={styles.customButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;
  // For Service Reset password modal:
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // For PDI-EOL password modal:
  const [pdiModalVisible, setPdiModalVisible] = useState(false);
  const [pdiPasswordInput, setPdiPasswordInput] = useState('');

  useEffect(() => {
    // Check connection status and attempt reconnection if needed.
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

  // --- Service Reset functionality ---
  const handleServiceResetPress = () => {
    setModalVisible(true);
  };

  const verifyPassword = async () => {
    try {
      const docRef = doc(db, 'authentication', 'password1');
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const expectedPassword = docSnapshot.data()?.ServiceReset;
        if (passwordInput === expectedPassword) {
          setModalVisible(false);
          setPasswordInput(''); // Clear after successful verification
          navigation.navigate('Transmit', { device });
        } else {
          Alert.alert("Error", "Incorrect password for Service Reset.");
        }
      } else {
        Alert.alert("Error", "Password document not found.");
      }
    } catch (error) {
      console.error("Error verifying Service Reset password:", error);
      Alert.alert("Error", "Failed to verify password.");
    }
  };

  // --- PDI-EOL functionality ---
  const handlePDIEOLPress = () => {
    setPdiModalVisible(true);
  };

  const verifyPDIEOLPassword = async () => {
    try {
      const docRef = doc(db, 'authentication', 'password');
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const expectedPassword = docSnapshot.data()?.PDIEOL;
        if (pdiPasswordInput === expectedPassword) {
          setPdiModalVisible(false);
          setPdiPasswordInput(''); // Clear after successful verification
          navigation.navigate('PDIEOL', { device });
        } else {
          Alert.alert("Error", "Incorrect password for PDI-EOL.");
        }
      } else {
        Alert.alert("Error", "Password document not found for PDI-EOL.");
      }
    } catch (error) {
      console.error("Error verifying PDI-EOL password:", error);
      Alert.alert("Error", "Failed to verify password.");
    }
  };

  return (
    <View style={styles.container}>
      <CustomButton title="Diagnose" onPress={handleReceivePress} />
      <CustomButton title="Service Reset" onPress={handleServiceResetPress} />
      <CustomButton title="PDI-EOL" onPress={handlePDIEOLPress} />

      {/* Modal for Service Reset password */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Service Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <View style={styles.modalButtons}>
              <CustomButton title="Cancel" onPress={() => setModalVisible(false)} />
              <CustomButton title="Confirm" onPress={verifyPassword} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for PDI-EOL password */}
      <Modal
        transparent={true}
        visible={pdiModalVisible}
        animationType="slide"
        onRequestClose={() => setPdiModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter PDI-EOL Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={pdiPasswordInput}
              onChangeText={setPdiPasswordInput}
            />
            <View style={styles.modalButtons}>
              <CustomButton title="Cancel" onPress={() => setPdiModalVisible(false)} />
              <CustomButton title="Confirm" onPress={verifyPDIEOLPassword} />
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
    backgroundColor: '#F5F5F5', // light background color for a cleaner look
  },
  customButton: {
    backgroundColor: '#007AFF', // iOS default blue button color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default DataDirection;
