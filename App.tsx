import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import HIL_Receive_from_vehicle from './HIL_Receive_from_vehicle';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

type RootStackParamList = {
  Home: undefined;
  HIL_Receive_from_vehicle: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: {device: Device};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    checkBluetoothState();
  }, []);

  const checkBluetoothState = async () => {
    const state = await BluetoothStateManager.getState();

    if (state === 'PoweredOff') {
      Alert.alert(
        'Enable Bluetooth',
        'This app needs Bluetooth to scan for devices. Would you like to enable it?',
        [
          { text: 'No', onPress: () => console.log('User declined Bluetooth enablement'), style: 'cancel' },
          { text: 'Yes', onPress: () => BluetoothStateManager.requestToEnable().then(() => requestBluetoothPermissions()) }
        ]
      );
    } else {
      requestBluetoothPermissions();
    }
  };

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
          result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Error", "Bluetooth permissions are required to scan for devices.");
      }
    }
    scanAndConnect();
  };

  const connectToDevice = (device: Device) => {
    manager.stopDeviceScan();
    device.connect()
      .then(device => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        navigation.navigate('HIL_Receive_from_vehicle', { device });
      })
      .catch((error: any) => {
        console.error("Connection failed", error);
        Alert.alert("Connection Error", `Error connecting to device: ${error.message}`);
      });
  };

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
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
    }, 10000); // Stop scanning after 10 seconds
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
      <Button title="Scan for Devices" onPress={scanAndConnect} />
    </View>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Scan BLE Devices' }} />
        <Stack.Screen name="HIL_Receive_from_vehicle" component={HIL_Receive_from_vehicle} options={{ title: 'Data Transfer' }} />
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
    backgroundColor: '#fff', // White background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // Black text
  },
  deviceInfo: {
    fontSize: 16,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFF', // White background for device info
    color: '#000', // Black text for device info
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF', // Blue button color
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text on buttons
    fontWeight: 'bold',
  },
});


export default App;