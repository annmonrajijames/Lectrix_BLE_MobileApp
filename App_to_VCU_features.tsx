// App_to_VCU_features.tsx
import React from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Device } from 'react-native-ble-plx';

type RootStackParamList = {
  DataTransfer: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: {device: Device};
  All_Parameters: { device: Device };
};

type AppToVCUFeaturesProps = NativeStackScreenProps<RootStackParamList, 'AppToVCUFeatures'>;

const AppToVCUFeatures: React.FC<AppToVCUFeaturesProps> = ({ navigation, route }) => {
  const { device } = route.params; // Assuming device is being passed

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="RTC Time Sync" onPress={() => navigation.navigate('DataTransfer', { device })} />
      <Button title="Vehicle Lock" onPress={() => console.log('Vehicle Lock')} />
      <Button title="BLE advertise name change" onPress={() => console.log('BLE advertise name change')} />
      <Button title="VCU reset" onPress={() => console.log('VCU reset')} />
      <Button title="Navigation" onPress={() => console.log('Navigation')} />
      <Button title="Mobile ICON" onPress={() => console.log('Mobile ICON')} />
      <Button title="Current Limit" onPress={() => navigation.navigate('CurrentLimit', { device })} />
      <Button title="Regen Limit" onPress={() => console.log('Regen Limit')} />
      <Button title="RPM Limit" onPress={() => console.log('RPM Limit')} />
      <Button title="Temperature limits-for warning" onPress={() => console.log('Temperature limits-for warning')} />
      <Button title="Temperature limits-for cut off" onPress={() => console.log('Temperature limits-for cut off')} />
      <Button title="Alert" onPress={() => console.log('Alert')} />
      <Button title="Music interface" onPress={() => console.log('Music interface')} />
      <Button title="All_Parameters" onPress={() => navigation.navigate('All_Parameters', { device })} />
    </ScrollView>
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
