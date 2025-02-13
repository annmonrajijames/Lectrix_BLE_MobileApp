import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';

// Define parameter keys
type ParameterKeys = 'SW_Version_MAJDecoder' | 'SW_Version_MINDecoder' | 'HW_Version_MAJDecoder' | 'HW_Version_MINDecoder';

const AddParametersScreen = () => {
  const [vehicleNumber, setVehicleNumber] = useState(''); // State for vehicle number
  const [parameters, setParameters] = useState<Record<ParameterKeys, string>>({
    SW_Version_MAJDecoder: '',
    SW_Version_MINDecoder: '',
    HW_Version_MAJDecoder: '',
    HW_Version_MINDecoder: '',
  });

  // Handle input change
  const handleInputChange = (name: ParameterKeys, value: string) => {
    setParameters(prevState => ({ ...prevState, [name]: value }));
  };

  // Test Firestore connection
  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'parameters'));
        console.log('✅ Firestore Read Successful:', querySnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error('❌ Firestore Read Error:', error);
        Alert.alert('Firestore Error', 'Failed to connect to Firestore.');
      }
    };

    testFirestoreConnection();
  }, []);

  // Upload to Firestore with Vehicle Number as Document ID
  const uploadToFirebase = async () => {
    try {
      if (!db) {
        throw new Error('Firestore instance is not initialized.');
      }

      if (!vehicleNumber.trim()) {
        Alert.alert('Error', 'Please enter a valid Vehicle Number.');
        return;
      }

      await setDoc(doc(db, 'parameters', vehicleNumber), parameters);
      console.log('✅ Document added with ID (Vehicle Number):', vehicleNumber);
      Alert.alert('Success', `Parameters added for Vehicle: ${vehicleNumber}`);

      // Reset input fields
      setVehicleNumber('');
      setParameters({
        SW_Version_MAJDecoder: '',
        SW_Version_MINDecoder: '',
        HW_Version_MAJDecoder: '',
        HW_Version_MINDecoder: '',
      });
    } catch (error) {
      console.error('❌ Error adding document:', error);
      Alert.alert('Error', 'Failed to add parameters: ' + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Vehicle Number & Parameter Values</Text>

      {/* Vehicle Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle Number:</Text>
        <TextInput
          style={styles.input}
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="Enter vehicle number"
        />
      </View>

      {/* Parameter Inputs */}
      {Object.keys(parameters).map(key => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{key}:</Text>
          <TextInput
            style={styles.input}
            value={parameters[key as ParameterKeys]}
            onChangeText={text => handleInputChange(key as ParameterKeys, text)}
            keyboardType="numeric"
            placeholder="Enter value"
          />
        </View>
      ))}

      <Button title="Upload to Firebase" onPress={uploadToFirebase} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
