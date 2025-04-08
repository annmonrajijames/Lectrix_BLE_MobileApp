import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';

// Define parameter keys including the updated names for display.
type ParameterKeys =
  | 'Cluster_Version_SW_MAJDecoder'
  | 'Cluster_Version_SW_MINDecoder'
  | 'Cluster_Version_HW_MAJDecoder'
  | 'Cluster_Version_HW_MINDecoder'
  | 'Battery_Version_HwVer'
  | 'Battery_Version_FwVer'
  | 'Battery_Version_FWSubVer'
  | 'Battery_Version_ConfigVer'
  | 'Battery_Version_InternalFWVer'
  | 'Battery_Version_InternalFWSubVer'
  | 'MCU_Version_Firmware_Id'
  | 'Charger_Version_Hardware_MAJ'
  | 'Charger_Version_Hardware_MIN'
  | 'Charger_Version_Software_MAJ'
  | 'Charger_Version_Software_MIN';

// Mapping from the original parameter key to the new key name.
const displayMapping: Partial<Record<ParameterKeys, string>> = {
  Cluster_Version_SW_MAJDecoder: 'Cluster_Version_SW_MAJ',
  Cluster_Version_SW_MINDecoder: 'Cluster_Version_SW_MIN',
  Cluster_Version_HW_MAJDecoder: 'Cluster_Version_HW_MAJ',
  Cluster_Version_HW_MINDecoder: 'Cluster_Version_HW_MIN',
};

const AddParametersScreen = () => {
  const [parameters, setParameters] = useState<Record<ParameterKeys, string>>({
    Cluster_Version_SW_MAJDecoder: '',
    Cluster_Version_SW_MINDecoder: '',
    Cluster_Version_HW_MAJDecoder: '',
    Cluster_Version_HW_MINDecoder: '',
    Battery_Version_HwVer: '',
    Battery_Version_FwVer: '',
    Battery_Version_FWSubVer: '',
    Battery_Version_ConfigVer: '',
    Battery_Version_InternalFWVer: '',
    Battery_Version_InternalFWSubVer: '',
    MCU_Version_Firmware_Id: '',
    Charger_Version_Hardware_MAJ: '',
    Charger_Version_Hardware_MIN: '',
    Charger_Version_Software_MAJ: '',
    Charger_Version_Software_MIN: '',
  });

  // Handle input change for parameters.
  const handleInputChange = (name: ParameterKeys, value: string) => {
    setParameters(prevState => ({ ...prevState, [name]: value }));
  };

  // Test Firestore connection on mount.
  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'parameters'));
        console.log(
          '✅ Firestore Read Successful:',
          querySnapshot.docs.map(doc => doc.data())
        );
      } catch (error) {
        console.error('❌ Firestore Read Error:', error);
        Alert.alert('Firestore Error', 'Failed to connect to Firestore.');
      }
    };

    testFirestoreConnection();
  }, []);

  // Generate a local time string in the format YYYY-MM-DDTHH:mm:ss.SSS using the device's local time.
  const getFormattedLocalTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // Modified uploadToFirebase function
  const uploadToFirebase = async () => {
    try {
      if (!db) {
        throw new Error('Firestore instance is not initialized.');
      }

      const localTime = getFormattedLocalTime();

      // Create a new object with new key names if available from displayMapping.
      const dataToUpload: Record<string, string> = {};
      Object.keys(parameters).forEach((key) => {
        const typedKey = key as ParameterKeys;
        // Use the mapped key name if exists, otherwise use the original key.
        const newKey = displayMapping[typedKey] || typedKey;
        dataToUpload[newKey] = parameters[typedKey];
      });

      // Add timestamp to the object.
      dataToUpload.timestamp = localTime;

      await setDoc(doc(db, 'parameters', localTime), dataToUpload);

      console.log('✅ Document added with ID (Local Time):', localTime);
      Alert.alert('Success', `Parameters added at ${localTime}`);

      // Reset parameter input fields.
      setParameters({
        Cluster_Version_SW_MAJDecoder: '',
        Cluster_Version_SW_MINDecoder: '',
        Cluster_Version_HW_MAJDecoder: '',
        Cluster_Version_HW_MINDecoder: '',
        Battery_Version_HwVer: '',
        Battery_Version_FwVer: '',
        Battery_Version_FWSubVer: '',
        Battery_Version_ConfigVer: '',
        Battery_Version_InternalFWVer: '',
        Battery_Version_InternalFWSubVer: '',
        MCU_Version_Firmware_Id: '',
        Charger_Version_Hardware_MAJ: '',
        Charger_Version_Hardware_MIN: '',
        Charger_Version_Software_MAJ: '',
        Charger_Version_Software_MIN: '',
      });
    } catch (error) {
      console.error('❌ Error adding document:', error);
      Alert.alert('Error', 'Failed to add parameters: ' + (error as Error).message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Enter Parameter Values</Text>

      {/* Render an input for each parameter */}
      {Object.keys(parameters).map(key => {
        // Use the mapped display name if it exists, otherwise default to the original key.
        const displayKey = displayMapping[key as ParameterKeys] || key;
        return (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{displayKey}:</Text>
            <TextInput
              style={styles.input}
              value={parameters[key as ParameterKeys]}
              onChangeText={text => handleInputChange(key as ParameterKeys, text)}
              keyboardType="default"
              placeholder="Enter value"
            />
          </View>
        );
      })}

      <Button title="Upload to Firebase" onPress={uploadToFirebase} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default AddParametersScreen;
