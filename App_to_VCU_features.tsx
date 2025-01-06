// App_to_VCU_features.tsx
import React from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Device } from 'react-native-ble-plx';

type RootStackParamList = {
  DataTransfer: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: {device: Device};
  RegenLimit: {device: Device};
  F1: { device: Device };
  F2: { device: Device };
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
      <Button title="Regen Limit" onPress={() => navigation.navigate('RegenLimit', { device })} />
      <Button title="RPM Limit" onPress={() => console.log('RPM Limit')} />
      <Button title="Temperature limits-for warning" onPress={() => console.log('Temperature limits-for warning')} />
      <Button title="Temperature limits-for cut off" onPress={() => console.log('Temperature limits-for cut off')} />
      <Button title="Alert" onPress={() => console.log('Alert')} />
      <Button title="Music interface" onPress={() => console.log('Music interface')} />
      <Button title="F1" onPress={() => navigation.navigate('F1', { device })} />
      <Button title="F2" onPress={() => navigation.navigate('F2', { device })} />
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
