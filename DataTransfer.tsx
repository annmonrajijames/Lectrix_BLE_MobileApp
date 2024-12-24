import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Button } from 'react-native';
import { Buffer } from 'buffer';
import { NativeModules } from 'react-native';

const { FileSaveModule } = NativeModules;

const DataTransfer: React.FC = () => {
  const [cellVol01, setCellVol01] = useState<number | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  // Use a ref to keep track of the recording state inside asynchronous operations
  const recordingRef = useRef(recording);
  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  // Function to generate random data starting with '07'
  const generateRandomData = () => {
    const randomPart = Math.random().toString(16).substring(2, 18); // Generates a random string
    const data = '07' + randomPart;
    return data;
  };

  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => (data: string) => {
    if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
      return parseInt(data.substring(2 * positions[0], 2 * positions[1] + 2), 16) * multiplier;
    }
    return null;
  };

  const decodeData = (data: string, currentRecording: boolean, startDecodeTime) => {
    const cellVol01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    if (cellVol01 !== null) {
      setCellVol01(cellVol01);
      if (currentRecording) {
        const timestamp = new Date().toISOString();
        const csvData = `${timestamp},${cellVol01}`;

        const preWriteTime = Date.now(); // Time just before sending data to native module
        FileSaveModule.writeData(csvData, (error, result) => {
          const postWriteTime = Date.now(); // Time after data is written

          console.log(`Decoding took ${preWriteTime - startDecodeTime} ms`);
          console.log('Data write response:', result);
          console.log(`Total process time from decoding to write complete: ${postWriteTime - startDecodeTime} ms`);
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const data = generateRandomData();
      const startDecodeTime = Date.now(); // Start timing right before decoding
      decodeData(data, recordingRef.current, startDecodeTime);
    }, 0); // Generate data as quickly as possible

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Button title="Choose Location to Store" onPress={async () => {
          const result = await FileSaveModule.chooseLocation();
          setFileUri(result);
          Alert.alert('Location Chosen', `File will be saved to: ${result}`);
        }} />
        <Button title="Start Recording" onPress={() => {
          if (!fileUri) {
            Alert.alert('Error', 'Please choose a location first!');
            return;
          }
          FileSaveModule.startRecording();
          setRecording(true);
        }} disabled={recording} />
        <Button title="Stop Recording" onPress={() => {
          FileSaveModule.stopRecording();
          setRecording(false);
          Alert.alert('Recording Stopped', 'The data recording has been stopped and saved.');
        }} disabled={!recording} />
        {cellVol01 !== null && <Text style={styles.cellVolText}>Cell Voltage 01: {cellVol01.toFixed(4)} V</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cellVolText: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
