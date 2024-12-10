import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Button } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Buffer } from 'buffer';
import { NativeModules } from 'react-native';

type RootStackParamList = {
  DataTransfer: { device: Device };
};

type DataTransferProps = NativeStackScreenProps<RootStackParamList, 'DataTransfer'>;

const { FileSaveModule } = NativeModules;

const DataTransfer: React.FC<DataTransferProps> = ({ route }) => {
  const { device } = route.params;
  const [cellVol01, setCellVol01] = useState<number | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const recordingRef = useRef(recording);
  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    const setupSubscription = async () => {
      await device.monitorCharacteristicForService('00FF', 'FF01', (error, characteristic) => {
        if (error) {
          Alert.alert("Subscription Error", error.message);
          return;
        }
        if (characteristic?.value) {
          const data = Buffer.from(characteristic.value, 'base64').toString('hex');
          decodeData(data, recordingRef.current);
        }
      });
      return () => device.cancelConnection();
    };
    setupSubscription();
  }, [device]);

  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => (data: string) => {
    if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
      return parseInt(data.substring(2 * positions[0], 2 * positions[1] + 2), 16) * multiplier;
    }
    return null;
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

  const decodeData = (data: string, currentRecording: boolean) => {
    const cellVol01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    if (cellVol01 !== null) {
      setCellVol01(cellVol01);
      console.log('Updated cellVol01:', cellVol01);
      console.log("DEBUG currentRecording"+currentRecording);
      if (currentRecording) {
        const timestamp = formatTimestamp();  // Updated line to use formatTimestamp function
        const csvData = `${timestamp},${cellVol01}`;
        FileSaveModule.writeData(csvData);
        console.log('Sending data to native module:', csvData);
      }
    }
  };

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
        <Button title="View File" onPress={async () => {
          if (fileUri) {
            await FileSaveModule.viewFile(fileUri);
          }
        }} disabled={!fileUri} />
        <Button title="Share File" onPress={async () => {
          if (fileUri) {
            const result = await FileSaveModule.shareFile(fileUri);
            Alert.alert('Share', result.message);
          }
        }} disabled={!fileUri} />
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
