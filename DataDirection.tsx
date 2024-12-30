// DataDirection.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
  
type RootStackParamList = {
  DataDirection: { device: Device };
  Receive: { device: Device };
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text>Select Data Direction</Text>
      <Button
        title="Receive"
        onPress={() => navigation.navigate('Receive', { device })}
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
