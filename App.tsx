import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { BleManager, Device } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import DataDirection from './DataDirection';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import Receive from './Receive'; 
import PDIEOL from './PDIEOL';
import AddParametersScreen from './AddParametersScreen';

type RootStackParamList = {
  Home: undefined;
  DataDirection: { device: Device };
  Receive: { device: Device };
  PDIEOL: { device: Device };
  AddParameters: { device: Device };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [showAllDevices, setShowAllDevices] = useState(false);

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

  const filteredDevices = showAllDevices ? devices : devices.filter(device => device.name?.toLowerCase().includes('lectrix'));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Devices:</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={showAllDevices}
          onValueChange={setShowAllDevices}
        />
        <Text style={styles.label}>Show All Devices</Text>
      </View>
      <FlatList
        data={filteredDevices}
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
        <Stack.Screen name="DataDirection" component={DataDirection} options={{ title: 'Data Direction' }} />
        <Stack.Screen name="Receive" component={Receive} options={{ title: 'Receive' }} />
        <Stack.Screen name="PDIEOL" component={PDIEOL} options={{ title: 'PDIEOL' }} />
        <Stack.Screen name="AddParameters" component={AddParametersScreen} options={{ title: 'Add Parameters' }} />
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default App;