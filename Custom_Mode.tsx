import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';

type RootStackParamList = {
  Custom_Mode: { device: Device };
};

type Custom_ModeProps = NativeStackScreenProps<RootStackParamList, 'Custom_Mode'>;

const Custom_Mode: React.FC<Custom_ModeProps> = ({ route }) => {
  const { device } = route.params;

  const [PickUp, setPickUp] = useState(16);
  const [TopSpeed, setTopSpeed] = useState(30);
  const [Slop, setSlop] = useState(7);

  // Compute values based on the formulas
  const currentLimit = 105 - ((PickUp - 6) / (16 - 6)) * (105 - 32);
  const frequency = 105 + ((TopSpeed - 30) / (80 - 30)) * (401 - 105);
  const slopeCurrentMap: Record<number, number> = { 7: 35, 10: 60, 14: 105 };
  const slopeCurrent = slopeCurrentMap[Slop];
  const MaxCur = Math.max(currentLimit, slopeCurrent);

  // Debugging: Log computed values whenever they change
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

  const convertDecimalToHex = (decimal: string) => {
    const decimalNumber = parseInt(decimal, 10);
    if (isNaN(decimalNumber) || decimalNumber < 0 || decimalNumber > 255) {
      Alert.alert('Invalid Input', 'Please enter a valid decimal number between 0 and 255.');
      return null;
    }
    return decimalNumber.toString(16).padStart(2, '0').toUpperCase();
  };

  const writeParameterToDevice = async (
    parameterValue: number,
    opCode: string,
    payloadLength: string,
    canId: string
  ) => {
    const serviceUUID = '00FF';
    const characteristicUUID = 'FF01';

    const parameterHex = convertDecimalToHex(parameterValue.toString());
    if (!parameterHex) {
      return;
    }

    const SOF = 'AA';
    const Source = '01';
    const Destination = '02';
    const message = SOF + Source + Destination + opCode + payloadLength + parameterHex;

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
      await writeParameterToDevice(MaxCur, '0B', '0001', '18F20309');
      await writeParameterToDevice(frequency, '0C', '0001', '18F20309');
      // await writeParameterToDevice(slopeCurrent, '0D', '0002', '18F20309');

      Alert.alert('Success', 'All parameters have been sent to the device successfully.');
    } catch (error: any) {
      console.error('Error sending parameters:', error);
      Alert.alert('Error', 'Failed to send all parameters. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.parametersContainer}>
        <Text style={styles.sectionTitle}>Parameters at 100% Battery</Text>

        <Text style={styles.label}>Pick up (Seconds)</Text>
        <Slider
          style={styles.slider}
          minimumValue={6}
          maximumValue={16}
          step={1}
          value={16 - (PickUp - 6)} // Inverts the slider movement
          onValueChange={(value) => setPickUp(16 - (value - 6))} // Adjusts the state accordingly
          minimumTrackTintColor="#f39c12"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#e67e22"
        />
        <Text style={styles.value}>PickUp: {PickUp}s → Current Limit: {Math.round(currentLimit)} A</Text>       

        <Text style={styles.label}>Top Speed (Kmph)</Text>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={80}
          step={1}
          value={TopSpeed}
          onValueChange={(value) => setTopSpeed(value)}
          minimumTrackTintColor="#e74c3c"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#c0392b"
        />
        <Text style={styles.value}>Top Speed: {TopSpeed} Kmph → Frequency: {Math.round(frequency)} Hz</Text>

        <Text style={styles.label}>Slope (Degrees)</Text>
        <Text style={styles.value}>Slope: {Slop}° → Current Limit: {slopeCurrent} A</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          step={1}
          value={[0,7, 10, 14].indexOf(Slop)}
          onValueChange={(index) => setSlop([0,7, 10, 14][index])}
          minimumTrackTintColor="#9b59b6"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#8e44ad"
        />
        

        <Button title="Send All Parameters" onPress={handleSendAllParameters} color="#3498db" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },

  contentContainer: { 
    padding: 16 
  },

  parametersContainer: { 
    padding: 16, 
    backgroundColor: '#ffffff', 
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 12 
  },

  label: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 8 
  },

  slider: { 
    width: '100%', 
    height: 50,
  },

  value: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
});

export default Custom_Mode;
