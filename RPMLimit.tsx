import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import Slider from '@react-native-community/slider';

type RootStackParamList = {
  RPMLimit: { device: Device };
};

type RPMLimitProps = NativeStackScreenProps<RootStackParamList, 'RPMLimit'>;

const RPMLimit: React.FC<RPMLimitProps> = ({ route }) => {
  const { device } = route.params;
  
  // Initialized with default values within the updated limits
  const [customModeCurrLimit, setCustomModeCurrLimit] = useState(9000); // Between 7000-12000 RPM
  const [powerModeLimit, setPowerModeLimit] = useState(12000); // Between 10000-15000 RPM
  const [ecoModeCurrLimit, setEcoModeCurrLimit] = useState(8000); // Between 6000-9000 RPM
  const [receivedData, setReceivedData] = useState('');

  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber)) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number.');
      return null;
    }
    return decimalNumber.toString(16).padStart(4, '0').toUpperCase(); // Adjusted to pad to 4 hex digits
  };

  const handleSliderChange = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(value);
    writeDataToCharacteristic(false);
  };

  const writeDataToCharacteristic = async (showAlert: boolean = true) => {
    const serviceUUID = '1819';
    const characteristicUUID = 'EE02';

    const customModeHex = convertDecimalToHex(customModeCurrLimit.toString());
    const powerModeHex = convertDecimalToHex(powerModeLimit.toString());
    const ecoModeHex = convertDecimalToHex(ecoModeCurrLimit.toString());

    if (!customModeHex || !powerModeHex || !ecoModeHex) {
      return; // Stops the process if any input is invalid
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const OpCode = '0C';
    const Payload_Length = '0003';
    const message = SOF + Source + Destination + OpCode + Payload_Length + customModeHex + powerModeHex + ecoModeHex;

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      if (showAlert) {
        Alert.alert("Success", "Data written to the device successfully.");
      }
    } catch (error: any) {
      console.error("Write failed", error);
      Alert.alert("Write Error", `Error writing data to device: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPM Limit Setup</Text>
      
      {/* Custom Mode */}
      <Text style={styles.label}>Custom Mode (7,000-12,000 RPM)</Text>
      <TextInput
        style={styles.input}
        placeholder="7000-12000"
        placeholderTextColor="#808080"
        value={customModeCurrLimit.toString()}
        onChangeText={text => setCustomModeCurrLimit(Math.max(7000, Math.min(parseInt(text) || 7000, 12000)))}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={7000}
        maximumValue={12000}
        step={100}
        value={customModeCurrLimit}
        onValueChange={value => handleSliderChange(value, setCustomModeCurrLimit)}
      />

      {/* Power Mode */}
      <Text style={styles.label}>Power Mode (10,000-15,000 RPM)</Text>
      <TextInput
        style={styles.input}
        placeholder="10000-15000"
        placeholderTextColor="#808080"
        value={powerModeLimit.toString()}
        onChangeText={text => setPowerModeLimit(Math.max(10000, Math.min(parseInt(text) || 10000, 15000)))}
        keyboardType="numeric"
        maxLength={5}
      />
      <Slider
        style={styles.slider}
        minimumValue={10000}
        maximumValue={15000}
        step={100}
        value={powerModeLimit}
        onValueChange={value => handleSliderChange(value, setPowerModeLimit)}
      />

      {/* Eco Mode */}
      <Text style={styles.label}>Eco Mode (6,000-9,000 RPM)</Text>
      <TextInput
        style={styles.input}
        placeholder="6000-9000"
        placeholderTextColor="#808080"
        value={ecoModeCurrLimit.toString()}
        onChangeText={text => setEcoModeCurrLimit(Math.max(6000, Math.min(parseInt(text) || 6000, 9000)))}
        keyboardType="numeric"
        maxLength={4}
      />
      <Slider
        style={styles.slider}
        minimumValue={6000}
        maximumValue={9000}
        step={100}
        value={ecoModeCurrLimit}
        onValueChange={value => handleSliderChange(value, setEcoModeCurrLimit)}
      />
      
      <Button title="WRITE" onPress={() => writeDataToCharacteristic(true)} />
      
      {receivedData ? <Text>Received Data: {receivedData}</Text> : null}
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
    width: '60%',  
    height: 35,    
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  title: {
    color: '#0000FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default RPMLimit;
