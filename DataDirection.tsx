// DataDirection.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  DataTransfer: { device: Device };
  DataDirection: { device: Device };
  Receive: { device: Device }; // Add this line
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text>Select Data Direction</Text>
      <Button
        title="Mobile app to VCU"
        onPress={() => navigation.navigate('Receive', { device })}
      />
      <Button
        title="VCU to Mobile app"
        onPress={() => console.log('VCU to Mobile app pressed')}
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
