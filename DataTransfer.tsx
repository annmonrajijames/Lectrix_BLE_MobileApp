import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [inputData, setInputData] = useState('');
  const [receivedData, setReceivedData] = useState('');
  const [hexData, setHexData] = useState('');
  const [decData, setDecData] = useState('');

  const serviceUUID = '00FF';
  const characteristicUUID = 'FF01';

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
          if (error) {
            console.error("Subscription error:", error);
            Alert.alert("Subscription Error", `Error subscribing to characteristic: ${error.message}`);
            return;
          }

          if (characteristic?.value) {
            const data = Buffer.from(characteristic.value, 'base64').toString('hex');
            setReceivedData(data);
            formatData(data);
          }
        });
      } catch (error: any) {
        console.error("Failed to set up subscription:", error);
        Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
      }
    };

    setupSubscription();

    return () => {
      device.cancelConnection();  // Ensure cleanup on component unmount
    };
  }, [device]);

  const formatData = (hexData: string) => {
    let hexString = '';
    let decString = '';
    for (let i = 0; i < hexData.length; i += 2) {
      const byte = hexData.substr(i, 2);
      const decimal = parseInt(byte, 16);
      hexString += `${byte} `;
      decString += `${decimal} `;
    }
    setHexData(hexString);
    setDecData(decString);
  };

  const writeDataToCharacteristic = async () => {
    try {
      const base64Data = Buffer.from(inputData, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        base64Data
      );
      Alert.alert("Success", "Data written to the device successfully.");
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Transfer Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Hex Data to Write"
        placeholderTextColor="#808080" 
        value={inputData}
        onChangeText={setInputData}
        autoCapitalize="none"
      />
      <Button title="WRITE" onPress={writeDataToCharacteristic} />
      {hexData ? <Text style={styles.hexText}>Hexadecimal: {hexData}</Text> : null}
      {decData ? <Text style={styles.decText}>Decimal: {decData}</Text> : null}
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  title: {
    color: '#0000FF', // Sets the text color to blue
    fontSize: 20, // Sets the size of the font
    fontWeight: 'bold', // Makes the font bold
  },
  hexText: {
    color: 'black', // Sets the text color to black for hexadecimal
  },
  decText: {
    color: 'green', // Sets the text color to green for decimal
  },
});

export default DataTransfer;
