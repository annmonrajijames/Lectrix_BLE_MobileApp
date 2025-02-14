import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Device } from 'react-native-ble-plx';

const screenWidth = Dimensions.get('window').width; // Get screen width

type RootStackParamList = {
  DataTransfer: { device: Device };
  AppToVCUFeatures: { device: Device };
  CurrentLimit: { device: Device };
  All_Parameters: { device: Device };
  Custom_Mode: { device: Device };
};

type AppToVCUFeaturesProps = NativeStackScreenProps<RootStackParamList, 'AppToVCUFeatures'>;

const AppToVCUFeatures: React.FC<AppToVCUFeaturesProps> = ({ navigation, route }) => {
  const { device } = route.params;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkDeviceConnection = async () => {
      const connected = await device.isConnected();
      setIsConnected(connected);
    };

    checkDeviceConnection();
  }, [device]);

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text>Connecting to device...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Full-Width Styled Device Name Button */}
      <TouchableOpacity
        style={styles.deviceButton}
        onPress={() => navigation.navigate('Custom_Mode', { device })}
      >
        <Text style={styles.deviceButtonText}>{device.name || 'Unknown Device'}</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>App to VCU Features</Text>
        {/* Add other UI components here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000', // Black background
  },
  deviceButton: {
    width: screenWidth - 20, // Full width minus some margin
    alignSelf: 'center',
    backgroundColor: '#808080', // Gray button
    height: 60, // Increased height for a longer button
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center', // Ensures text is vertically centered
    elevation: 3, // Shadow for Android
    shadowColor: '#fff', // White shadow for better contrast
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative', // Allows absolute positioning of text inside
  },
  deviceButtonText: {
    fontSize: 18,
    color: '#fff', // White text for contrast
    fontWeight: 'bold',
    position: 'absolute', // Positioning text inside the button
    top: 5, // Moves text to the top
    left: 10, // Moves text to the left
    textAlignVertical: 'top',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff', // White text
    textAlign: 'center',
  },
});

export default AppToVCUFeatures;


