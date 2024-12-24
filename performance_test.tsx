// App_to_VCU_features.tsx
import React from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Device } from 'react-native-ble-plx';

type RootStackParamList = {
  DataTransfer: { device: Device };
  ReactPage: { device: Device };
  CurrentLimit: { device: Device };
};

type ReactPageProps = NativeStackScreenProps<RootStackParamList, 'ReactPage'>;

const ReactPage: React.FC<ReactPageProps> = ({ navigation, route }) => {
  const { device } = route.params; // Assuming device is being passed

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="performance_test" onPress={() => navigation.navigate('DataTransfer', { device })} />
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

export default ReactPage;
