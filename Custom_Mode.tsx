import React, { useState } from 'react';
import { 
  View, Text, Button, StyleSheet, Alert, ScrollView, Switch 
} from 'react-native';
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

  const [Range, setRange] = useState(105);
  const [PickUp, setPickUp] = useState(105);
  const [TopSpeed, setTopSpeed] = useState(105);
  const [Slop, setSlop] = useState(105);
  const [Efficiency, setEfficiency] = useState(105);
  const [isAdvanced, setIsAdvanced] = useState(false);

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
    canId: string,
    showAlert: boolean = true
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

    try {
      const base64Data = Buffer.from(message, 'hex').toString('base64');
      await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, base64Data);
      console.log(`Sent parameter ${opCode} to CAN ID: ${canId}`);
    } catch (error: any) {
      console.error(`Write failed for OpCode ${opCode} at CAN ID ${canId}`, error);
      if (showAlert) {
        Alert.alert("Write Error", `Error writing data for OpCode ${opCode}: ${error.message}`);
      }
    }
  };

  const handleSendAllParameters = async () => {
    try {
      await writeParameterToDevice(Range, '0A', '0001', '18F20309');
      await writeParameterToDevice(PickUp, '0B', '0001', '18F20309');
      await writeParameterToDevice(TopSpeed, '0C', '0001', '18F20309');
      await writeParameterToDevice(Slop, '0D', '0002', '18F20309');
      await writeParameterToDevice(Efficiency, '0E', '0001', '18F20309');

      Alert.alert('Success', 'All parameters have been sent to the device successfully.');
    } catch (error: any) {
      console.error('Error sending parameters:', error);
      Alert.alert('Error', 'Failed to send all parameters. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Advanced Controls</Text>
        <Switch value={isAdvanced} onValueChange={setIsAdvanced} />
      </View>

      {/* Ride Experience Section */}
      <View style={styles.rideExperienceContainer}>
        <Text style={styles.sectionTitle}>Ride Experience</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Efficiency</Text>
          <Text style={styles.label}>Excitement</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={Efficiency}
          onValueChange={(value) => setEfficiency(value)}
          disabled={isAdvanced}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#2980b9"
        />
        <Text style={styles.value}>{Efficiency}</Text>
      </View>

      {/* Other Parameters Section */}
      <View style={styles.parametersContainer}>
        <Text style={styles.sectionTitle}>Parameters at 100% Battery</Text>

        <Text style={styles.label}>Regen</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={Range}
          onValueChange={(value) => setRange(value)}
          disabled={!isAdvanced}
          minimumTrackTintColor="#2ecc71"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#27ae60"
        />
        <Text style={styles.value}>{Range}</Text>

        <Text style={styles.label}>Pick up</Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={16}
          step={1}
          value={PickUp}
          onValueChange={(value) => setPickUp(value)}
          disabled={!isAdvanced}
          minimumTrackTintColor="#f39c12"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#e67e22"
        />
        <Text style={styles.value}>{PickUp}</Text>

        <Text style={styles.label}>Top Speed</Text>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={80}
          step={1}
          value={TopSpeed}
          onValueChange={(value) => setTopSpeed(value)}
          disabled={!isAdvanced}
          minimumTrackTintColor="#e74c3c"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#c0392b"
        />
        <Text style={styles.value}>{TopSpeed}</Text>

        <Text style={styles.label}>Slop</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={3}
          step={1}
          value={[0, 7, 10, 14].indexOf(Slop)}
          onValueChange={(index) => setSlop([0, 7, 10, 14][index])}
          disabled={!isAdvanced}
          minimumTrackTintColor="#9b59b6"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#8e44ad"
        />
        <Text style={styles.value}>{Slop}</Text>

        <Button title="Send All Parameters" onPress={handleSendAllParameters} color="#3498db" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Main ScrollView container
  scrollView: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },

  // Content container for proper padding and alignment
  contentContainer: { 
    padding: 16 
  },

  // Styling for the Advanced Controls switch
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  // Section for ride experience styling
  rideExperienceContainer: {
    padding: 16,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  // Styling for parameters container (sliders and labels)
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

  // Titles of each section
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 12 
  },

  // Label for sliders
  label: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginBottom: 8 
  },

  // Row container for side-by-side elements
  rowContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },

  // Slider Styling
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  slider: { 
    width: '100%', 
    height: 50,
  },

  // Custom thumb style for slider (React Native does not support direct styling of thumb)
  sliderThumb: {
    backgroundColor: '#3498db',
    width: 25,
    height: 25,
    borderRadius: 15,
    elevation: 5,
  },

  // Displayed value under each slider
  value: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#2c3e50'
  },

  // Button styling
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default Custom_Mode;
