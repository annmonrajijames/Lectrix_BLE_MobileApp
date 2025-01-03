import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';

type RootStackParamList = {
  DataDirection: { device: Device };
  Receive: { device: Device };
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const { ActivityStarter } = NativeModules;

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;

  const handleReceivePress = () => {
    // Call the native module to navigate to the ReceiveActivity in Android
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
        onPress={() => console.log('Transmit')}
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
