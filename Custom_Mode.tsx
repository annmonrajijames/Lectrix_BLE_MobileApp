import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
  Custom_Mode: { device: Device };
};

type Custom_ModeProps = NativeStackScreenProps<RootStackParamList, 'Custom_Mode'>;

const Custom_Mode: React.FC<Custom_ModeProps> = ({ route }) => {
  const { device } = route.params;

  const [PickUp, setPickUp] = useState(16);
  const [TopSpeed, setTopSpeed] = useState(30);
  const [Slop, setSlop] = useState(7);
  // const [Regen, setRegen] = useState(2); // Added Regen parameter

  // Compute values based on the formulas
  const currentLimit = 105 - ((PickUp - 6) / (16 - 6)) * (105 - 32);
  const frequency = 105 + ((TopSpeed - 30) / (80 - 30)) * (401 - 105);
  const slopeCurrentMap: Record<number, number> = { 3: 14, 7: 35, 10: 60, 14: 105 };
  const slopeCurrent = slopeCurrentMap[Slop];
  const MaxCur = Math.max(currentLimit, slopeCurrent);
  // const regenValues: Record<number, number> = { 25: 2, 50: 18, 100: 15 };
  // const RegenSendValues = regenValues[Regen];

  // Debugging: Log computed values whenever they chegen
  useEffect(() => {
    console.log(`Pickup Time: ${PickUp}s → Current Limit: ${Math.round(currentLimit)}A`);
  }, [PickUp]);

  useEffect(() => {
    console.log(`Top Speed: ${TopSpeed} Kmph → Frequency: ${Math.round(frequency)}Hz`);
  }, [TopSpeed]);

  useEffect(() => {
    console.log(`Slope: ${Slop}° → Current Limit: ${slopeCurrent}A`);
  }, [Slop]);

  useEffect(() => {
    console.log(`Maximum CurrentLimit: ${MaxCur}° A`);
  }, [Slop]);

  // useEffect(() => {
  //   console.log(`Regen: ${Regen}° A`);
  // }, [Regen]);

  
  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 65535) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 65535.');
      return null;
    }
    return decimalNumber.toString(16).padStart(4, '0').toUpperCase();
  };

  const convertOneByteDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 255) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 65535.');
      return null;
    }
    return decimalNumber.toString(16).padStart(2, '0').toUpperCase();
  };

  const writeParameterToDevice = async (
    parameterValue: string,
    opCode: string,
    payloadLength: string,
    canId: string
  ) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';


   // const parameterHex = convertDecimalToHex(parameterValue.toString());
   // if (!parameterHex) {
   //   return;
   // }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const message = SOF + Source + Destination + opCode + payloadLength + parameterValue;

    console.log(`Writing to device: ${message} (OpCode: ${opCode}, CAN ID: ${canId})`);

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      console.log(`Sent parameter ${opCode} successfully.`);
    } catch (error: any) {
      console.error(`Write failed for OpCode ${opCode} at CAN ID ${canId}`, error);
      Alert.alert("Write Error", `Error writing data for OpCode ${opCode}: ${error.message}`);
    }
  };

  const handleSendAllParameters = async () => {
    try {
      console.log("Sending all parameters...");
      await writeParameterToDevice(`${convertOneByteDecimalToHex(MaxCur.toString())}4125`, '0A', '0003', '18F20309');
      // await writeParameterToDevice(`${convertOneByteDecimalToHex(Regen.toString())!}0A0A`, '0B', '0003', '18F20309');
      //const packedMessage = `${0xC8}${0xC8}${0x50}${ convertDecimalToHex(frequency.toString())}${0x03}${0xE8}${0x03}${0x20}`;
      const packedMessage = `C8C850${ convertDecimalToHex(frequency.toString())}03E80320`;

      await writeParameterToDevice(packedMessage, '0F', '0009', '18F20309');
      // await writeParameterToDevice(slopeCurrent, '0D', '0002', '18F20309');

      Alert.alert('Success', 'All parameters have been sent to the device successfully.');
    } catch (error: any) {
      console.error('Error sending parameters:', error);
      Alert.alert('Error', 'Failed to send all parameters. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#283c86', '#45a247']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Custom Mode Settings</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Pick Up Time (Seconds)</Text>
          <Text style={styles.value}>{PickUp}s → {Math.round(currentLimit)} A</Text>
          <Slider
            style={styles.slider}
            minimumValue={6}
            maximumValue={16}
            step={1}
            value={PickUp}
            onValueChange={setPickUp}
            minimumTrackTintColor="#f39c12"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#e67e22"
          />
            
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Top Speed (Kmph)</Text>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={80}
            step={1}
            value={TopSpeed}
            onValueChange={setTopSpeed}
            minimumTrackTintColor="#e74c3c"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#c0392b"
          />
          <Text style={styles.value}>{TopSpeed} Kmph → {Math.round(frequency)} Hz</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Slope (Degrees)</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={3}
            step={1}
            value={[3, 7, 10, 14].indexOf(Slop)}
            onValueChange={(index) => setSlop([3, 7, 10, 14][index])}
            minimumTrackTintColor="#9b59b6"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#8e44ad"
          />
          <Text style={styles.value}>{Slop}° → {slopeCurrent} A</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSendAllParameters}>
          <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Send All Parameters</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  valueContainer: {
    alignItems: 'center', // Center aligns the text under sliders properly
    marginTop: 8,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 6,
    textAlign: 'right',
  },
  button: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Custom_Mode;
