import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import DataTransfer from './DataTransfer';
import DataDirection from './DataDirection';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import AppToVCUFeatures from './App_to_VCU_features'; // Make sure this import is correct
import CurrentLimit from './CurrentLimit';

type RootStackParamList = {
  Home: undefined;
  DataTransfer: { device: Device };
  DataDirection: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: { device: Device };
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
        navigation.navigate('DataDirection', { device });
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
          <View style={styles.deviceContainer}>
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceName}>{item.name || 'Unnamed device'}</Text>
              <Text style={styles.deviceId}>ID: {item.id}</Text>
              {/* Replace 'item.rssi' with actual RSSI value if available */}
              <Text style={styles.deviceRssi}>RSSI: {item.rssi || 'N/A'}</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={() => connectToDevice(item)}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.scanButton} onPress={scanAndConnect}>
        <Text style={styles.scanButtonText}>Scan for Devices</Text>
      </TouchableOpacity>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Scan BLE Devices' }} />
        <Stack.Screen name="DataDirection" component={DataDirection} options={{ title: 'Data Direction' }} />
        <Stack.Screen name="DataTransfer" component={DataTransfer} options={{ title: 'Data Transfer' }} />
        <Stack.Screen name="AppToVCUFeatures" component={AppToVCUFeatures} options={{ title: 'App to VCU Features' }} />
        <Stack.Screen name="CurrentLimit" component={CurrentLimit} options={{ title: 'Current Limit' }} />
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '100%',
  },
  deviceInfoContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deviceId: {
    fontSize: 14,
    marginBottom: 5,
  },
  deviceRssi: {
    fontSize: 14,
    marginBottom: 5,
  },
  connectButton: {
    backgroundColor: '#00aaaa',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#00aaaa',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;