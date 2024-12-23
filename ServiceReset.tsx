import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { BleError, Device } from 'react-native-ble-plx';

interface SendServiceResetProps {
  route: any;
}

const SendServiceReset: React.FC<SendServiceResetProps> = ({ route }) => {
  const { device } = route.params;
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up listeners on unmount
      if (device) {
        device.removeListener('disconnected');
      }
    };
  }, [device]);

  const handleServiceReset = () => {
    setIsSending(true);

    // Replace with your actual service reset logic
    device.writeCharacteristicWithResponseForService(
      '00FF',  // Replace with your service UUID
      'FF01',  // Replace with your characteristic UUID
      Buffer.from([0x01]).toString('base64') // Example service reset command
    )
      .then(() => {
        Alert.alert('Service Reset', 'Service reset message sent successfully.');
        setIsSending(false);
      })
      .catch((error: BleError) => {
        console.error(error);
        Alert.alert('Error', 'Failed to send service reset message.');
        setIsSending(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Reset</Text>
      <Button
        title={isSending ? 'Sending...' : 'Send Service Reset'}
        onPress={handleServiceReset}
        disabled={isSending}
      />
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

export { SendServiceReset };
