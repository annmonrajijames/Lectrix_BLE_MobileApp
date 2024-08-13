import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import DataTransfer from './DataTransfer';
 
type RootStackParamList = {
  Home: undefined;
  DataTransfer: { device: Device };
};
 
const Stack = createNativeStackNavigator<RootStackParamList>();
 
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
 
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
 
  useEffect(() => {
    checkBluetoothState();
  }, []);
 
  async function checkBluetoothState() {
    const bluetoothState = await BluetoothStateManager.getState();
 
    if (bluetoothState === 'PoweredOff') {
      Alert.alert(
        'Enable Bluetooth',
        'This app needs to use Bluetooth. Would you like to enable it?',
        [
          { text: 'No', onPress: () => console.log('User declined Bluetooth permissions'), style: 'cancel' },
          { text: 'Yes', onPress: async () => {
              await BluetoothStateManager.requestToEnable(); // Request to enable Bluetooth
              requestBluetoothPermissions();
            }
          },
        ]
      );
    } else {
      requestBluetoothPermissions();
    }
  }
 
  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      try {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
 
        const granted = result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
                        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED;
 
        setPermissionGranted(granted);
        // console.log("Bluetooth permissions granted:", granted);
 
        if (granted) {
          startScanning();
        } else {
          Alert.alert('Permissions Required', 'Bluetooth permissions are needed to scan and connect to devices.');
        }
      } catch (error) {
        console.error('Error requesting Bluetooth permissions', error);
        Alert.alert('Permissions Error', 'An error occurred while requesting Bluetooth permissions.');
      }
    } else {
      setPermissionGranted(true);
      startScanning();
    }
  }
 
  const startScanning = () => {
    if (!permissionGranted) {
      // console.log('No permissions to use Bluetooth. Requesting...');
      requestBluetoothPermissions();
      return;
    }
 
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        Alert.alert('Scan Error', `Error scanning for devices: ${error.message}`);
        return;
      }
      if (device) {
        setDevices(prevDevices => {
          const deviceExists = prevDevices.some(d => d.id === device.id);
          return deviceExists ? prevDevices : [...prevDevices, device];
        });
      }
    });
 
    setTimeout(() => {
      manager.stopDeviceScan();
      console.log('Scanning stopped');
    }, 10000); // Stop scanning after 10 seconds
  };
 
  const connectToDevice = (device: Device) => {
    manager.stopDeviceScan();
    device.connect()
      .then(device => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        navigation.navigate('DataTransfer', { device });
      })
      .catch((error: any) => {
        console.error("Connection failed:", error);
        Alert.alert("Connection Error", `Error connecting to device: ${error.message}`);
      });
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceInfo}>{item.name || 'Unnamed device'} (ID: {item.id})</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Scan for Devices" onPress={startScanning} />
    </View>
  );
};
 
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Scan BLE Devices' }} />
        <Stack.Screen name="DataTransfer" component={DataTransfer} options={{ title: 'Data Transfer' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deviceInfo: {
    fontSize: 16,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
  },
});
 
export default App;
 