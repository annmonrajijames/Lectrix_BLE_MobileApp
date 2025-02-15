import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';

// Define parameter keys
type ParameterKeys =
  | 'SW_Version_MAJDecoder'
  | 'SW_Version_MINDecoder'
  | 'HW_Version_MAJDecoder'
  | 'HW_Version_MINDecoder';

const AddParametersScreen = () => {
  const [parameters, setParameters] = useState<Record<ParameterKeys, string>>({
    SW_Version_MAJDecoder: '',
    SW_Version_MINDecoder: '',
    HW_Version_MAJDecoder: '',
    HW_Version_MINDecoder: '',
  });

  // Handle input change for parameters
  const handleInputChange = (name: ParameterKeys, value: string) => {
    setParameters(prevState => ({ ...prevState, [name]: value }));
  };

  // Test Firestore connection on mount
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

  // Function to format local time as YYYY-MM-DD_HH-mm-ss
  const getFormattedLocalTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  };

  // Upload to Firestore with local time as Document ID
  const uploadToFirebase = async () => {
    try {
      if (!db) {
        throw new Error('Firestore instance is not initialized.');
      }

      // Generate a local time string formatted as YYYY-MM-DD_HH-mm-ss
      const localTime = getFormattedLocalTime();

      // Upload document with localTime as the document ID, and include the timestamp in the document fields
      await setDoc(doc(db, 'parameters', localTime), {
        ...parameters,
        timestamp: localTime,
      });

      console.log('✅ Document added with ID (Local Time):', localTime);
      Alert.alert('Success', `Parameters added at ${localTime}`);

      // Reset parameter input fields
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
      <Text style={styles.heading}>Enter Parameter Values</Text>

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
