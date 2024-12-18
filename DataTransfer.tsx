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
  const [CellVol01, setCellVol01] = useState<number | null>(null);
  const [PackCurr, setPackCurr] = useState<number | null>(null);
  const [SOC, setSOC] = useState<number | null>(null); 
  const [IgnitionStatus, setIgnitionStatus] = useState<number | null>(null);
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

  const tempStorage = useRef({
    CellVol01: [],
    PackCurr: [],
    SOC: [],
    IgnitionStatus: [],
    isFirstCycle: true,
    firstLocalTime: null
  });

  const decodeData = (data: string, currentRecording: boolean) => {
    const packetNumberHex = data.substring(0, 2);
    const LocalTime = formatLocalTime();
    const CellVol01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    const PackCurr = signed_eight_bytes_decode('09', 0.001, 9, 10, 11, 12)(data);
    const SOC = eight_bytes_decode('09', 1, 17)(data); 
    const IgnitionStatus = bit_decode('11', 18, 0)(data);

    if (CellVol01 !== null) {
      tempStorage.current.CellVol01.push(CellVol01);
      setCellVol01(CellVol01); 
    }
    if (PackCurr !== null) {
      tempStorage.current.PackCurr.push(PackCurr);
      setPackCurr(PackCurr);
    }
    if (SOC !== null) {
      tempStorage.current.SOC.push(SOC);
      setSOC(SOC); 
    }
    if (IgnitionStatus !== null) {
      tempStorage.current.IgnitionStatus.push(IgnitionStatus);
      setIgnitionStatus(IgnitionStatus); 
    }

    if (packetNumberHex === '01' && tempStorage.current.isFirstCycle) {
      tempStorage.current.firstLocalTime = LocalTime;
    }

    if (packetNumberHex === '20') {
      tempStorage.current.CellVol01.forEach((CellVol01, index) => {
        const PackCurr = tempStorage.current.PackCurr[index] ?? "N/A";
        const SOC = tempStorage.current.SOC[index] ?? "N/A";
        const IgnitionStatus = tempStorage.current.IgnitionStatus[index] ?? "N/A";
        const csvData = `${LocalTime},${CellVol01.toFixed(4)},${PackCurr},${SOC},${IgnitionStatus}`;
    
        if (!(tempStorage.current.isFirstCycle && tempStorage.current.firstLocalTime === LocalTime)) {
          FileSaveModule.writeData(csvData);
          console.log('Data Written:', csvData);
        }
      });
    
      tempStorage.current.isFirstCycle = false;
      tempStorage.current.CellVol01 = [];
      tempStorage.current.PackCurr = [];
      tempStorage.current.SOC = [];
      tempStorage.current.IgnitionStatus = [];
      tempStorage.current.firstLocalTime = null;
    }
  };

  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map(pos => data.substring(2 * pos, 2 * pos + 2)).join('');
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    }
  }

  const bit_decode = (firstByteCheck: string, bytePosition: number, bitPosition: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        return bits[7 - bitPosition] === '1' ? 1 : 0;
      }
      return null;
    }
  }
  
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
  }

  const formatLocalTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months start at 0!
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
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
          setRecording(true);
        }} disabled={recording} />
        <Button title="Stop Recording" onPress={() => {
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
        {CellVol01 !== null && <Text style={styles.CellVol01}>CellVol01: {CellVol01.toFixed(4)} V</Text>}
        {PackCurr !== null && <Text style={styles.PackCurr}>PackCurr: {PackCurr.toFixed(3)} A</Text>}
        {SOC !== null && <Text style={styles.SOC}>SOC: {SOC}%</Text>}
        {IgnitionStatus !== null && <Text style={styles.IgnitionStatus}>IgnitionStatus: {IgnitionStatus}</Text>}
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
  CellVol01: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackCurr: {
    color: '#FF4500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  SOC: {
    color: '#32CD32', // Green color for SOC
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  IgnitionStatus: {
    color: '#32CD32', // Green color for IgnitionStatus
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default DataTransfer;
