import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  // State for managing save functionality
  const [savedValues, setSavedValues] = useState({ PickUp, TopSpeed, Slop });
  const [isSendEnabled, setIsSendEnabled] = useState(false);
  const [originalValues, setOriginalValues] = useState({ PickUp: 16, TopSpeed: 30, Slop: 7 });


  // Load saved values from AsyncStorage when component mounts
  useEffect(() => {
    const loadSavedValues = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedParameters');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setPickUp(parsedData.PickUp);
          setTopSpeed(parsedData.TopSpeed);
          setSlop(parsedData.Slop);
          setIsSendEnabled(true); // Enable the Send button if values exist
        }
      } catch (error) {
        console.error('Error loading saved values:', error);
      }
    };

    loadSavedValues();
  }, []); // Run only when the screen is first loaded

  // Disable Send button if any slider value is changed
  useEffect(() => {
    if (
      PickUp !== originalValues.PickUp ||
      TopSpeed !== originalValues.TopSpeed ||
      Slop !== originalValues.Slop
    ) {
      setIsSendEnabled(false);
    }
  }, [PickUp, TopSpeed, Slop]);

  // Save the current values when "Save" button is clicked
  const handleSave = async () => {
    const newValues = { PickUp, TopSpeed, Slop };
    try {
      await AsyncStorage.setItem('savedParameters', JSON.stringify(newValues));
      setIsSendEnabled(true); // Enable send button after saving
      Alert.alert('Saved', 'Parameters have been saved successfully.');
    } catch (error) {
      console.error('Error saving values:', error);
    }
  };

  // Compute values based on the formulas
  const currentLimit = 105 - ((PickUp - 6) / (16 - 6)) * (105 - 32);
  const frequency = 105 + ((TopSpeed - 30) / (80 - 30)) * (401 - 105);
  const slopeCurrentMap: Record<number, number> = { 3: 14, 7: 35, 10: 60, 14: 105 };
  const slopeCurrent = slopeCurrentMap[Slop];
  const MaxCur = Math.max(currentLimit, slopeCurrent);
  // const regenValues: Record<number, number> = { 25: 2, 50: 18, 100: 15 };
  // const RegenSendValues = regenValues[Regen];
  // const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await device.isConnected();
      if (!connected) {
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect to device.');
    }
  };
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
        <Text style={styles.header}>{device.name || 'Unknown Device'}</Text>

        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Pick Up Time (Seconds)</Text>
            <Text style={styles.label}>0-40 kmph in {PickUp}s</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={6}
              maximumValue={16}
              step={1}
              value={PickUp}
              onValueChange={setPickUp}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="white"
            />
            
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Top Speed (Kmph)</Text>
            <Text style={styles.label}>{TopSpeed} Kmph </Text>
          </View>
          <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={80}
            step={1}
            value={TopSpeed}
            onValueChange={setTopSpeed}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="white"
          />
          </View>
          
        </View>

        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <Text style={styles.label}>Slope (Degrees)</Text>
            <Text style={styles.label}>{Slop}° with single ride</Text>
          </View>
          <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={3}
            step={1}
            value={[3, 7, 10, 14].indexOf(Slop)}
            onValueChange={(index) => setSlop([3, 7, 10, 14][index])}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="white"
          />
          </View>
        </View>


        <View style={styles.buttonRow}>
         {/* Save Button */}
         <TouchableOpacity style={styles.button} onPress={handleSave}>
          <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, !isSendEnabled && styles.disabledButton]} 
          onPress={handleSendAllParameters}
          disabled={!isSendEnabled}
        >
          <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Send</Text>
          </LinearGradient>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    fontSize: 24,
    backgroundColor: '#000',
  },
  card: {
    width: '100%',
    backgroundColor: '#000',
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
    color: '#fff',
    marginBottom: 6,
    lineHeight: 22, // Ensure text isn't getting clipped
  },
  valueContainer: {
    alignItems: 'center', // Center aligns the text under sliders properly
    marginTop: 8,
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    height: 18,  // Thicker background for tube effect
    borderRadius: 15,
    backgroundColor: 'black',  // Tube background color
    borderWidth: 2,  // Border thickness
    borderColor: 'white',  // Border color
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  slider: {
    width: '100%',
    height: 10, // Increase height for better appearance
    marginHorizontal: -15, // Adjust to ensure thumb reaches the border
  },
  sliderTrack: {
    height: 14, // Thicker track
    borderRadius: 100, // Rounded tube-like effect
    backgroundColor: 'black',
    transform: [{ translateY: -4 }], // Align perfectly with thumb
  },
  sliderThumb: {
    width: 100000,  // Big and thick thumb (moving dot)
    height: 3000, 
    borderRadius: 100, // Perfect circle
    backgroundColor: 'white', 
    borderWidth: 2,
    borderColor: 'white', 
    elevation: 5, // Shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ translateY: -15 }], // Move it up so it sits on top of the track
  },
  sliderBorder: {
    width: '100%',
    borderWidth: 2,  // Border thickness
    borderColor: 'black',  // Border color
    borderRadius: 10,  // Optional: Rounded border
    padding: 2,  // Optional: Adjust spacing
    position: 'relative'
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    textAlign: 'right',  // Centers text properly
    width: '100%',        // Ensures full width
    flexWrap: 'wrap',     // Allows text wrapping
    marginTop: 10,        // Adds spacing
    marginBottom: 10,     // Adds spacing
    paddingHorizontal: 20, // Prevents text from getting cut
    lineHeight: 22, // Ensure text isn't getting clipped
  },
  
  button: {
    width: '50%',
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
  // Row container for side-by-side elements
  rowContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',  // Align buttons in a row
    justifyContent: 'space-between',  // Space buttons evenly
    marginTop: 15,
  },
  buttonSpacing: {
    flex: 1,  // Make both buttons equal width
    marginHorizontal: 5,  // Add spacing between buttons
  },

});



export default Custom_Mode;
