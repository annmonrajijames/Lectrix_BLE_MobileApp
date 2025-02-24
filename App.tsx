import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, 
  Platform, PermissionsAndroid, ActivityIndicator 
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import AppToVCUFeatures from './App_to_VCU_features';
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
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const initBluetooth = async () => {
      await checkBluetoothState();
    };
    initBluetooth();
  
    return () => {
      manager.destroy();
    };
  }, []);
  
  const checkBluetoothState = async () => {
    const state = await BluetoothStateManager.getState();
    if (state === 'PoweredOff') {
      Alert.alert(
        'Enable Bluetooth',
        'This app requires Bluetooth to scan devices. Enable now?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => BluetoothStateManager.requestToEnable().then(requestBluetoothPermissions) }
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

      if (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !== PermissionsAndroid.RESULTS.GRANTED ||
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert("Permission Error", "Bluetooth permissions are required.");
        return;
      }
    }
    scanAndConnect();
  };

  const scanAndConnect = () => {
    setDevices([]);
    setScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        setScanning(false);
        return;
      }
      if (device) {
        setDevices(prevDevices => 
          prevDevices.some(d => d.id === device.id) ? prevDevices : [...prevDevices, device]
        );
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000); // Stop after 10 seconds
  };

  const connectToDevice = (device: Device) => {
    manager.stopDeviceScan();
    device.connect()
      .then(d => d.discoverAllServicesAndCharacteristics())
      .then(d => navigation.navigate('AppToVCUFeatures', { device: d }))
      .catch(error => {
        console.error("Connection failed", error);
        Alert.alert("Connection Error", `Failed to connect: ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Available BLE Devices:</Text>

      {scanning && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        contentContainerStyle={devices.length === 0 && styles.emptyList}
        ListEmptyComponent={!scanning ? <Text style={styles.noDevicesText}>No devices found.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceCard} onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
            <Text style={styles.deviceId}>ID: {item.id}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.scanButton} onPress={scanAndConnect} disabled={scanning}>
        <Text style={styles.scanButtonText}>{scanning ? "Scanning..." : "🔄 Scan Devices"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const App: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerStyle: { backgroundColor: '#1E1E1E' },
      headerTintColor: '#fff',
      headerTitleStyle: { 
        fontWeight: 'bold', 
        fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
      },
    }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'BLE Scanner' }} />
      <Stack.Screen name="AppToVCUFeatures" component={AppToVCUFeatures} options={{ title: 'Customise Mode' }} />
      <Stack.Screen name="Custom_Mode" component={Custom_Mode} options={{ title: 'Custom Mode' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    color: 'gray',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  noDevicesText: {
    color: '#888',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  deviceCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  deviceName: {
    fontSize: 18,
    color: 'gray',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  deviceId: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Light' : 'Poppins-Light',
  },
  scanButton: {
    backgroundColor: 'blue',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default App;
