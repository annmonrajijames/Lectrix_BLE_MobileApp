import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { Buffer } from 'buffer';

type Props = NativeStackScreenProps<RootStackParamList, 'SOCTransmit'>;

const SOCTransmit: React.FC<Props> = ({ route }) => {
  const { device } = route.params;
  const [socValue, setSocValue] = useState('');

  const sendSOCValue = async () => {
    try {
      if (!socValue) {
        Alert.alert('Error', 'Please enter a valid SOC value.');
        return;
      }

      // Use the 128-bit representation of your 16-bit UUIDs
      const serviceUUID = '00FF'; // 16-bit UUID 0x00FF expanded to 128-bit
      const characteristicUUID = 'FF01'; // 16-bit UUID 0xFF01 expanded to 128-bit

      // Convert the SOC value to Base64 using Buffer
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(socValue, 'utf-8').toString('base64')
      );

      Alert.alert('Success', `SOC value "${socValue}" sent to the device.`);
    } catch (error) {
      console.error('Failed to send SOC value:', error);
      Alert.alert('Error', 'Failed to send SOC value. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter SOC Value:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={socValue}
        onChangeText={setSocValue}
        placeholder="Enter SOC value"
      />
      <Button title="Send SOC" onPress={sendSOCValue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default SOCTransmit;