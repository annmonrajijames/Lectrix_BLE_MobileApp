import React from 'react';
import { View, Button, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Device } from 'react-native-ble-plx';

type RootStackParamList = {
  DataTransfer: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: { device: Device };
};

type AppToVCUFeaturesProps = NativeStackScreenProps<RootStackParamList, 'AppToVCUFeatures'>;

const AppToVCUFeatures: React.FC<AppToVCUFeaturesProps> = ({ navigation, route }) => {
  const { device } = route.params; // Assuming device is being passed

  const featureButtons = [
    { title: 'RTC Time Sync', onPress: () => navigation.navigate('DataTransfer', { device }) },
    { title: 'Vehicle Lock', onPress: () => console.log('Vehicle Lock') },
    { title: 'BLE advertise name change', onPress: () => console.log('BLE advertise name change') },
    { title: 'VCU reset', onPress: () => console.log('VCU reset') },
    { title: 'Navigation', onPress: () => console.log('Navigation') },
    { title: 'Mobile ICON', onPress: () => console.log('Mobile ICON') },
    { title: 'Current Limit', onPress: () => navigation.navigate('CurrentLimit', { device }) },
    { title: 'Regen Limit', onPress: () => console.log('Regen Limit') },
    { title: 'RPM Limit', onPress: () => console.log('RPM Limit') },
    { title: 'Temperature limits-for warning', onPress: () => console.log('Temperature limits-for warning') },
    { title: 'Temperature limits-for cut off', onPress: () => console.log('Temperature limits-for cut off') },
    { title: 'Alert', onPress: () => console.log('Alert') },
    { title: 'Music interface', onPress: () => console.log('Music interface') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {featureButtons.map((feature, index) => (
        <View key={index} style={styles.buttonRow}>
          <TouchableOpacity style={styles.leftButton}>
            <Text style={styles.featureText}>{feature.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.openButton} onPress={feature.onPress}>
            <Text style={styles.buttonText}>Open</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  leftButton: {
    flex: 3,
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  openButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#00aaaa',
    borderRadius: 5,
    marginLeft: 10,
  },
  featureText: {
    color: '#000', // Set font color to black
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AppToVCUFeatures;
