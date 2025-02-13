import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, getDoc, doc } from 'firebase/firestore';

// Define parameter keys
type ParameterKeys =
  | 'SW_Version_MAJDecoder'
  | 'SW_Version_MINDecoder'
  | 'HW_Version_MAJDecoder'
  | 'HW_Version_MINDecoder';

const AddParametersScreen = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(true);

  // Parameter state
  const [parameters, setParameters] = useState<Record<ParameterKeys, string>>({
    SW_Version_MAJDecoder: '',
    SW_Version_MINDecoder: '',
    HW_Version_MAJDecoder: '',
    HW_Version_MINDecoder: '',
  });

  // Fetch the admin password from Firestore on component mount
  useEffect(() => {
    const fetchAdminPassword = async () => {
      try {
        // Assuming the admin password is stored in Firestore under settings/addParameters with a field "password"
        const docRef = doc(db, 'settings', 'addParameters');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminPassword(data.password);
        } else {
          console.error('Admin password configuration not found.');
          Alert.alert('Error', 'Admin password configuration not found.');
        }
      } catch (error) {
        console.error('Error fetching admin password:', error);
        Alert.alert('Error', 'Failed to fetch admin password.');
      } finally {
        setLoadingPassword(false);
      }
    };

    fetchAdminPassword();
  }, []);

  // Optional: test Firestore connection (only runs after authentication)
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

    if (isAuthenticated) {
      testFirestoreConnection();
    }
  }, [isAuthenticated]);

  // Handle parameter input change
  const handleInputChange = (name: ParameterKeys, value: string) => {
    setParameters(prevState => ({ ...prevState, [name]: value }));
  };

  // Upload parameters to Firebase
  const uploadToFirebase = async () => {
    try {
      if (!db) {
        throw new Error('Firestore instance is not initialized.');
      }

      const docRef = await addDoc(collection(db, 'parameters'), parameters);
      console.log('✅ Document added with ID:', docRef.id);
      Alert.alert('Success', 'Parameters added to Firebase!');

      // Reset input fields
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

  // Handle the authentication check
  const handleAuthentication = () => {
    if (enteredPassword === adminPassword) {
      setIsAuthenticated(true);
    } else {
      Alert.alert('Error', 'Incorrect password!');
    }
  };

  // Show a loading state while fetching the password from Firestore
  if (loadingPassword) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If the user is not authenticated, show a password prompt
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Enter Password to Access Parameters</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={enteredPassword}
          onChangeText={setEnteredPassword}
        />
        <Button title="Authenticate" onPress={handleAuthentication} />
      </View>
    );
  }

  // Once authenticated, show the main parameter form
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Parameter Values</Text>

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
