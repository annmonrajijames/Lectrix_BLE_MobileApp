// App_to_VCU_features.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, ScrollView, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Device } from 'react-native-ble-plx';

type RootStackParamList = {
  DataTransfer: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: { device: Device };
  All_Parameters: { device: Device };
  Custom_Mode: { device: Device };
};

type AppToVCUFeaturesProps = NativeStackScreenProps<RootStackParamList, 'AppToVCUFeatures'>;

const AppToVCUFeatures: React.FC<AppToVCUFeaturesProps> = ({ navigation, route }) => {
  const { device } = route.params; // Assuming device is being passed
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Assuming you have a method to check if the device is connected
    const checkDeviceConnection = async () => {
      const connected = await device.isConnected();
      setIsConnected(connected);
    };

    checkDeviceConnection();
  }, [device]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text>Connecting to device...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title={device.name || 'Unknown Device'} onPress={() => navigation.navigate('Custom_Mode', { device })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default AppToVCUFeatures;
