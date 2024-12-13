import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  TransmitReceivePage: { device: any };
  SOCTransmit: { device: any };
  HIL_Receive_from_vehicle: { device: any };
};

const TransmitReceivePage: React.FC<NativeStackScreenProps<RootStackParamList, 'TransmitReceivePage'>> = ({ route, navigation }) => {
  const { device } = route.params;

  const handleTransmitPress = () => {
    // Navigate to the SOCTransmit page
    navigation.navigate('SOCTransmit', { device });
  };

  const handleReceivePress = () => {
    // Navigate to the Data Transfer page
    navigation.navigate('HIL_Receive_from_vehicle', { device });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose an action:</Text>
      <Button title="Transmit (SOC)" onPress={handleTransmitPress} />
      <Button title="Receive Data" onPress={handleReceivePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default TransmitReceivePage;