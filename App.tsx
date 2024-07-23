import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, FlatList, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  deviceInfo: TextStyle;
}

const App: React.FC = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

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
    } else {
      // Assume permissions are granted on iOS or older Android versions
      setPermissionGranted(true);
    }
  }

  const scanAndConnect = () => {
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
      if (device) {
        setDevices(prevDevices => {
          // Prevent duplicate devices by checking before adding
          if (prevDevices.find(d => d.id === device.id)) {
            return prevDevices;
          }
          return [...prevDevices, device];
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      console.log('Scanning stopped');
    }, 10000); // Stop scanning after 10 seconds
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.deviceInfo}>{item.name || 'Unnamed device'} (ID: {item.id})</Text>
        )}
      />
      <Button title="Scan for Devices" onPress={scanAndConnect} />
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
  },
  deviceInfo: {
    fontSize: 16,
    marginVertical: 10,
  }
});

export default App;
