import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';  // Import Buffer

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;

  const writeDataToCharacteristic = async () => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';
    const hexData = 'AA01020400080C02090000001214'; // Hex data

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(hexData, 'hex').toString('base64')
      );
      Alert.alert("Success", "Data written to the device successfully.");
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Data Transfer Page</Text>
      <Button title="WRITE" onPress={writeDataToCharacteristic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default DataTransfer;
