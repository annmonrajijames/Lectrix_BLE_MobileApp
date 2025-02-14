import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import AppToVCUFeatures from './App_to_VCU_features'; // Make sure this import is correct
import Custom_Mode from './Custom_Mode';

type RootStackParamList = {
  Home: undefined;
  AppToVCUFeatures: { device: Device };
  Custom_Mode: { device: Device };
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
        navigation.navigate('AppToVCUFeatures', { device });
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
        <Stack.Screen name="AppToVCUFeatures" component={AppToVCUFeatures} options={{ title: 'App to VCU Features' }} />
        <Stack.Screen name="Custom_Mode" component={Custom_Mode} options={{ title: 'Custom Mode' }} />
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
  deviceInfo: {
    fontSize: 16,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
  }
});

export default App;