import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  DataTransfer: { device: Device };
  DataDirection: { device: Device };
  AppToVCUFeatures: { device: Device }; // Add this line
};

type DataDirectionProps = NativeStackScreenProps<RootStackParamList, 'DataDirection'>;

const DataDirection: React.FC<DataDirectionProps> = ({ route, navigation }) => {
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Data Direction</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AppToVCUFeatures', { device })}
      >
        <Text style={styles.buttonText}>Mobile app to VCU</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('VCU to Mobile app pressed')}
      >
        <Text style={styles.buttonText}>VCU to Mobile app</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    marginBottom: 20, // Space between title and buttons
  },
  button: {
    backgroundColor: '#00aaaa',
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 10, // Space between buttons
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DataDirection;
