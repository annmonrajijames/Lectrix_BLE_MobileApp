import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, FlatList, StyleSheet, TextStyle, ViewStyle, Alert } from 'react-native';
import { Base64, BleError, BleManager, Device, ConnectionOptions, ConnectionPriority, TransactionId, Characteristic, Descriptor, Service, Subscription, UUID } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

interface DeviceWithRssi extends Device {
  rssi: number | null;
}

interface Styles {
  container: ViewStyle;
  title: TextStyle;
  deviceInfo: TextStyle;
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

      if (device) {  // Remove the condition that checks for device name
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
            requestConnectionPriority: function (connectionPriority: ConnectionPriority, transactionId?: TransactionId): Promise<Device> {
              throw new Error('Function not implemented.');
            },
            readRSSI: function (transactionId?: TransactionId): Promise<Device> {
              throw new Error('Function not implemented.');
            },
            requestMTU: function (mtu: number, transactionId?: TransactionId): Promise<Device> {
              throw new Error('Function not implemented.');
            },
            connect: function (options?: ConnectionOptions): Promise<Device> {
              throw new Error('Function not implemented.');
            },
            cancelConnection: function (): Promise<Device> {
              throw new Error('Function not implemented.');
            },
            isConnected: function (): Promise<boolean> {
              throw new Error('Function not implemented.');
            },
            onDisconnected: function (listener: (error: BleError | null, device: Device) => void): Subscription {
              throw new Error('Function not implemented.');
            },
            discoverAllServicesAndCharacteristics: function (transactionId?: TransactionId): Promise<Device> {
              throw new Error('Function not implemented.');
            },
            services: function (): Promise<Service[]> {
              throw new Error('Function not implemented.');
            },
            characteristicsForService: function (serviceUUID: string): Promise<Characteristic[]> {
              throw new Error('Function not implemented.');
            },
            descriptorsForService: function (serviceUUID: UUID, characteristicUUID: UUID): Promise<Array<Descriptor>> {
              throw new Error('Function not implemented.');
            },
            readCharacteristicForService: function (serviceUUID: UUID, characteristicUUID: UUID, transactionId?: TransactionId): Promise<Characteristic> {
              throw new Error('Function not implemented.');
            },
            writeCharacteristicWithResponseForService: function (serviceUUID: UUID, characteristicUUID: UUID, valueBase64: Base64, transactionId?: TransactionId): Promise<Characteristic> {
              throw new Error('Function not implemented.');
            },
            writeCharacteristicWithoutResponseForService: function (serviceUUID: UUID, characteristicUUID: UUID, valueBase64: Base64, transactionId?: TransactionId): Promise<Characteristic> {
              throw new Error('Function not implemented.');
            },
            monitorCharacteristicForService: function (serviceUUID: UUID, characteristicUUID: UUID, listener: (error: BleError | null, characteristic: Characteristic | null) => void, transactionId?: TransactionId): Subscription {
              throw new Error('Function not implemented.');
            },
            readDescriptorForService: function (serviceUUID: UUID, characteristicUUID: UUID, descriptorUUID: UUID, transactionId?: string): Promise<Descriptor> {
              throw new Error('Function not implemented.');
            },
            writeDescriptorForService: function (serviceUUID: UUID, characteristicUUID: UUID, descriptorUUID: UUID, valueBase64: Base64, transactionId?: string): Promise<Descriptor> {
              throw new Error('Function not implemented.');
            }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.deviceInfo}>{item.name || 'Unnamed device'} (ID: {item.id}, RSSI: {item.rssi})</Text>
        )}
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
  },
  deviceInfo: {
    fontSize: 16,
    marginVertical: 10,
  }
});

export default App;
