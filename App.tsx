import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Button, Alert, View } from 'react-native';
import { NativeModules } from 'react-native';

const { FileSaveModule } = NativeModules;

const App = () => {
  const [recording, setRecording] = useState(false);
  const [locationChosen, setLocationChosen] = useState(false);

  let intervalId: string | number | NodeJS.Timeout | undefined;

  const chooseLocation = async () => {
    try {
      const result = await FileSaveModule.chooseLocation();
      Alert.alert('Location Chosen', `File will be saved to: ${result}`);
      setLocationChosen(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to choose file location');
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;  // Months start at 0!
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const startRecording = () => {
    if (!locationChosen) {
      Alert.alert('Error', 'Please choose a location first!');
      return;
    }
    FileSaveModule.startRecording();
    setRecording(true);
    let id = 0;
    intervalId = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 100);
      const timeStamp = formatTimestamp(); // Custom formatted timestamp
      FileSaveModule.writeData(timeStamp, ++id, randomNumber);
    }, 100);
  };

  const stopRecording = () => {
    clearInterval(intervalId);
    FileSaveModule.stopRecording();
    setRecording(false);
    Alert.alert('Recording Stopped', 'The data recording has been stopped and saved.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Choose Location to Store" onPress={chooseLocation} />
      <View style={styles.buttonContainer}>
        <Button title="Start Recording" onPress={startRecording} disabled={!locationChosen || recording} />
        <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});

export default App;
