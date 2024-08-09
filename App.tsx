import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, FlatList, StyleSheet, TextStyle, ViewStyle, Alert, TouchableOpacity } from 'react-native';
import { BleManager, Device, ConnectionOptions, ConnectionPriority, TransactionId } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

interface DeviceWithRssi extends Device {
  rssi: number | null;
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  deviceContainer: ViewStyle;
  deviceInfo: TextStyle;
  connectButton: ViewStyle;
  separator: ViewStyle;
}

const App: React.FC = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<DeviceWithRssi[]>([]);
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
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const granted = result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
                      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED;

      setPermissionGranted(granted);
      console.log("Bluetooth permissions granted:", granted);

      if (granted) {
        startScanning();
      }
    } else {
      setPermissionGranted(true);
      startScanning();
    }
  }

  const startScanning = () => {
    if (!permissionGranted) {
      console.log('No permissions to use Bluetooth. Requesting...');
      requestBluetoothPermissions();
      return;
    }

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device && device.name) {  // Only add devices with a name
        setDevices(prevDevices => {
          const existingDevice = prevDevices.find(d => d.id === device.id);
          if (existingDevice) {
            return prevDevices.map(d =>
              d.id === device.id ? {...d, rssi: device.rssi} as DeviceWithRssi : d
            );
          }
          const newDevice: DeviceWithRssi = {
            ...device,
            rssi: device.rssi,
          };
          return [...prevDevices, newDevice];
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      console.log('Scanning stopped');
    }, 10000); // Stop scanning after 10 seconds
  };

  const connectToDevice = (device: DeviceWithRssi) => {
    // Implement your device connection logic here
    console.log('Connecting to', device.name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <View>
              <Text style={styles.deviceInfo}>{item.name}</Text>
              <Text style={styles.deviceInfo}>ID: {item.id}</Text>
              <Text style={styles.deviceInfo}>RSSI: {item.rssi}</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={() => connectToDevice(item)}>
              <Text style={{ color: 'white' }}>Connect</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Button title="Scan for Devices" onPress={startScanning} />
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
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
    textAlign: 'center',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  deviceInfo: {
    fontSize: 16,
  },
  connectButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  separator: {
    height: 2,
    width: '100%',
    backgroundColor: '#ddd',
  }
});

export default App;
