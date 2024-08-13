import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DataTransfer from './DataTransfer'; // Make sure this path is correct

const Stack = createNativeStackNavigator();

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  const connectToDevice = (device: Device) => {
    manager.stopDeviceScan();
    device.connect()
      .then((device) => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        navigation.navigate('DataTransfer');
      })
      .catch((error) => {
        console.log(error);
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DataTransfer" component={DataTransfer} />
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
  }
});

export default App;
