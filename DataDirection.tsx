import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';

// Add the 'Transmit' route type to the RootStackParamList.
type RootStackParamList = {
  DataDirection: { device: Device };
  Receive: { device: Device };
  PDIEOL: { device: Device };
  AddParameters: { device: Device };
  Transmit: { device: Device }; // New route
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const { ActivityStarter } = NativeModules;

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;
  console.log("MAC ID:" + device.id);
  
  const handleReceivePress = () => {
    ActivityStarter.navigateToReceiveActivity({ address: device.id });
  };

  return (
    <View style={styles.container}>
      <Text>Select Data Direction</Text>
      <Button
        title="Receive"
        onPress={handleReceivePress}
      />
      <Button
        title="Transmit"
        onPress={() => navigation.navigate('Transmit', { device })}  // Navigate to Transmit screen
      />
      <Button
        title="Go to PDIEOL"
        onPress={() => navigation.navigate('PDIEOL', { device })}
      />
      <Button
        title="Go to Add Parameters"
        onPress={() => navigation.navigate('AddParameters', { device })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default DataDirection;
