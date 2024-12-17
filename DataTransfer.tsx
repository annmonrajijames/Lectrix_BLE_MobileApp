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
  const [packCurr, setPackCurr] = useState<number | null>(null);
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

  const signed_eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        let decimalValue = parseInt(bytes, 16);

        // Adjust for two's complement if the value is a negative number
        const byteLength = positions.length;
        const maxByteValue = Math.pow(2, 8 * byteLength); // Max value for byte length
        const signBit = Math.pow(2, 8 * byteLength - 1); // Value of the sign bit

        if (decimalValue >= signBit) {
          decimalValue -= maxByteValue;
        }

        return decimalValue * multiplier;
      }
      return null;
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

// Temporary storage to hold values from each packet until all are received
const tempStorage = useRef({ cellVol01: [], packCurr: [] });

const decodeData = (data: string, currentRecording: boolean) => {
  const startTime = performance.now(); // Start timing when function is called
  const packetNumberHex = data.substring(0, 2);
  console.log('Packet Number:', packetNumberHex, 'Received at:', startTime);

  const cellVol01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
  const packCurr = signed_eight_bytes_decode('09', 0.001, 9, 10, 11, 12)(data);

  if (cellVol01 !== null) {
      tempStorage.current.cellVol01.push(cellVol01);
  }
  if (packCurr !== null) {
      tempStorage.current.packCurr.push(packCurr);
  }

  // Check if this is the last packet, checking directly against the string '20'
  if (packetNumberHex === '20') {
      if (currentRecording) {
          const processTime = performance.now();
          console.log('Processing start at:', processTime, 'Processing delay:', processTime - startTime);

          const timestamp = formatTimestamp();
          // Process all accumulated data
          tempStorage.current.cellVol01.forEach((vol, index) => {
              const current = tempStorage.current.packCurr[index] ?? "N/A";
              const csvData = `${timestamp},${vol.toFixed(4)},${current}`;
              FileSaveModule.writeData(csvData);
              console.log('Data Written:', performance.now(), 'Write delay:', performance.now() - processTime);
          });

          console.log('Total processing time:', performance.now() - startTime);
          // Clear temporary storage after writing to file
          tempStorage.current = { cellVol01: [], packCurr: [] };
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
        {packCurr !== null && <Text style={styles.packCurrText}>Pack Current: {packCurr.toFixed(3)} A</Text>}
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
  packCurrText: {
    color: '#FF4500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
