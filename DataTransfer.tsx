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
  const [CellVol02, setCellVol02] = useState<number | null>(null);
  const [CellVol03, setCellVol03] = useState<number | null>(null);
  const [CellVol04, setCellVol04] = useState<number | null>(null);
  const [CellVol05, setCellVol05] = useState<number | null>(null);
  const [CellVol06, setCellVol06] = useState<number | null>(null);
  const [CellVol07, setCellVol07] = useState<number | null>(null);
  const [CellVol08, setCellVol08] = useState<number | null>(null);
  const [CellVol09, setCellVol09] = useState<number | null>(null);
  const [CellVol10, setCellVol10] = useState<number | null>(null);
  const [CellVol11, setCellVol11] = useState<number | null>(null);
  const [CellVol12, setCellVol12] = useState<number | null>(null);
  const [CellVol13, setCellVol13] = useState<number | null>(null);
  const [CellVol14, setCellVol14] = useState<number | null>(null);
  const [CellVol15, setCellVol15] = useState<number | null>(null);
  const [CellVol16, setCellVol16] = useState<number | null>(null);

  const [PackCurr, setPackCurr] = useState<number | null>(null);
  const [SOC, setSOC] = useState<number | null>(null);
  const [IgnitionStatus, setIgnitionStatus] = useState<string | null>(null);
  const [Mode_Ack, setMode_Ack] = useState<number | null>(null);
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
    CellVol02: [],
    CellVol03: [],
    CellVol04: [],
    CellVol05: [],
    CellVol06: [],
    CellVol07: [],
    CellVol08: [],
    CellVol09: [],
    CellVol10: [],
    CellVol11: [],
    CellVol12: [],
    CellVol13: [],
    CellVol14: [],
    CellVol15: [],
    CellVol16: [],
    PackCurr: [],
    SOC: [],
    IgnitionStatus: [],
    Mode_Ack: [],
    isFirstCycle: true,
    firstLocalTime: null
  });
  

  const decodeData = (data: string, currentRecording: boolean) => {
    const packetNumberHex = data.substring(0, 2);
    const LocalTime = formatLocalTime();
    const CellVol01 = eight_bytes_decode('07', 0.0001, 7, 8)(data);
    const CellVol02 = eight_bytes_decode('07', 0.0001, 9, 10)(data);
    const CellVol03 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
    const CellVol04 = eight_bytes_decode('07', 0.0001, 11, 12)(data);
    const CellVol05 = eight_bytes_decode('10', 0.0001, 6, 7)(data);
    const CellVol06 = eight_bytes_decode('10', 0.0001, 8, 9)(data);
    const CellVol07 = eight_bytes_decode('10', 0.0001, 10, 11)(data);
    const CellVol08 = eight_bytes_decode('10', 0.0001, 12, 13)(data);
    const CellVol09 = eight_bytes_decode('08', 0.0001, 4, 5)(data);
    const CellVol10 = eight_bytes_decode('08', 0.0001, 6, 7)(data);
    const CellVol11 = eight_bytes_decode('08', 0.0001, 8, 9)(data);
    const CellVol12 = eight_bytes_decode('08', 0.0001, 10, 11)(data);
    const CellVol13 = eight_bytes_decode('08', 0.0001, 12, 13)(data);
    const CellVol14 = eight_bytes_decode('08', 0.0001, 14, 15)(data);
    const CellVol15 = eight_bytes_decode('08', 0.0001, 16, 17)(data);
    const CellVol16 = eight_bytes_decode('08', 0.0001, 18, 19)(data);

    const PackCurr = signed_eight_bytes_decode('09', 0.001, 9, 10, 11, 12)(data);
    const SOC = eight_bytes_decode('09', 1, 17)(data); 
    const IgnitionStatus = bit_decode('11', 18, 0)(data);
    const Mode_Ack = three_bit_decode(2, 7, 2, 1, 0)(data);

    if (CellVol01 !== null) {
      tempStorage.current.CellVol01.push(CellVol01);
      setCellVol01(CellVol01); 
    }
    if (CellVol02 !== null) {
      tempStorage.current.CellVol02.push(CellVol02);
      setCellVol02(CellVol02);
    }
    if (CellVol03 !== null) {
      tempStorage.current.CellVol03.push(CellVol03);
      setCellVol03(CellVol03);
    }
    if (CellVol04 !== null) {
      tempStorage.current.CellVol04.push(CellVol04);
      setCellVol04(CellVol04);
    }
    if (CellVol05 !== null) {
      tempStorage.current.CellVol05.push(CellVol05);
      setCellVol05(CellVol05);
    }
    if (CellVol06 !== null) {
      tempStorage.current.CellVol06.push(CellVol06);
      setCellVol06(CellVol06);
    }
    if (CellVol07 !== null) {
      tempStorage.current.CellVol07.push(CellVol07);
      setCellVol07(CellVol07);
    }
    if (CellVol08 !== null) {
      tempStorage.current.CellVol08.push(CellVol08);
      setCellVol08(CellVol08);
    }
    if (CellVol09 !== null) {
      tempStorage.current.CellVol09.push(CellVol09);
      setCellVol09(CellVol09);
    }
    if (CellVol10 !== null) {
      tempStorage.current.CellVol10.push(CellVol10);
      setCellVol10(CellVol10);
    }
    if (CellVol11 !== null) {
      tempStorage.current.CellVol11.push(CellVol11);
      setCellVol11(CellVol11);
    }
    if (CellVol12 !== null) {
      tempStorage.current.CellVol12.push(CellVol12);
      setCellVol12(CellVol12);
    }
    if (CellVol13 !== null) {
      tempStorage.current.CellVol13.push(CellVol13);
      setCellVol13(CellVol13);
    }
    if (CellVol14 !== null) {
      tempStorage.current.CellVol14.push(CellVol14);
      setCellVol14(CellVol14);
    }
    if (CellVol15 !== null) {
      tempStorage.current.CellVol15.push(CellVol15);
      setCellVol15(CellVol15);
    }
    if (CellVol16 !== null) {
      tempStorage.current.CellVol16.push(CellVol16);
      setCellVol16(CellVol16);
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
    if (Mode_Ack !== null) {
      tempStorage.current.Mode_Ack.push(Mode_Ack);
      setMode_Ack(Mode_Ack); 
    }

    if (packetNumberHex === '01' && tempStorage.current.isFirstCycle) {
      tempStorage.current.firstLocalTime = LocalTime;
    }

    if (packetNumberHex === '20') {
      tempStorage.current.CellVol01.forEach((CellVol01, index) => {
        const CellVol02 = tempStorage.current.CellVol02[index] ?? "N/A";
        const CellVol03 = tempStorage.current.CellVol03[index] ?? "N/A";
        const CellVol04 = tempStorage.current.CellVol04[index] ?? "N/A";
        const CellVol05 = tempStorage.current.CellVol05[index] ?? "N/A";
        const CellVol06 = tempStorage.current.CellVol06[index] ?? "N/A";
        const CellVol07 = tempStorage.current.CellVol07[index] ?? "N/A";
        const CellVol08 = tempStorage.current.CellVol08[index] ?? "N/A";
        const CellVol09 = tempStorage.current.CellVol09[index] ?? "N/A";
        const CellVol10 = tempStorage.current.CellVol10[index] ?? "N/A";
        const CellVol11 = tempStorage.current.CellVol11[index] ?? "N/A";
        const CellVol12 = tempStorage.current.CellVol12[index] ?? "N/A";
        const CellVol13 = tempStorage.current.CellVol13[index] ?? "N/A";
        const CellVol14 = tempStorage.current.CellVol14[index] ?? "N/A";
        const CellVol15 = tempStorage.current.CellVol15[index] ?? "N/A";
        const CellVol16 = tempStorage.current.CellVol16[index] ?? "N/A";

        const PackCurr = tempStorage.current.PackCurr[index] ?? "N/A";
        const SOC = tempStorage.current.SOC[index] ?? "N/A";
        const IgnitionStatus = tempStorage.current.IgnitionStatus[index] ?? "N/A";
        const Mode_Ack = tempStorage.current.Mode_Ack[index] ?? "N/A";
        const csvData = `${LocalTime},${CellVol01.toFixed(4)},${CellVol02},${CellVol03},${CellVol04},${CellVol05},${CellVol06},${CellVol07},${CellVol08},${CellVol09},${CellVol10},${CellVol11},${CellVol12},${CellVol13},${CellVol14},${CellVol15},${CellVol16},${PackCurr},${SOC},${IgnitionStatus},${Mode_Ack}`;
    
        if (!(tempStorage.current.isFirstCycle && tempStorage.current.firstLocalTime === LocalTime)) {
          FileSaveModule.writeData(csvData);
          console.log('Data Written:', csvData);
        }
      });
    
      tempStorage.current.isFirstCycle = false;
      tempStorage.current.CellVol01 = [];
      tempStorage.current.CellVol02 = [];
      tempStorage.current.CellVol03 = [];
      tempStorage.current.CellVol04 = [];
      tempStorage.current.CellVol05 = [];
      tempStorage.current.CellVol06 = [];
      tempStorage.current.CellVol07 = [];
      tempStorage.current.CellVol08 = [];
      tempStorage.current.CellVol09 = [];
      tempStorage.current.CellVol10 = [];
      tempStorage.current.CellVol11 = [];
      tempStorage.current.CellVol12 = [];
      tempStorage.current.CellVol13 = [];
      tempStorage.current.CellVol14 = [];
      tempStorage.current.CellVol15 = [];
      tempStorage.current.CellVol16 = [];
      tempStorage.current.PackCurr = [];
      tempStorage.current.SOC = [];
      tempStorage.current.IgnitionStatus = [];
      tempStorage.current.Mode_Ack = [];
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

  const three_bit_decode = (firstByteCheck: number, bytePosition: number, bit1: number, bit2: number, bit3: number) => {
    return (data: string) => {
      if (data.length >= 2 * (bytePosition + 1) && data.substring(0, 2) === firstByteCheck.toString().padStart(2, '0')) {
        const byte = data.substring(2 * bytePosition, 2 * bytePosition + 2);
        const bits = parseInt(byte, 16).toString(2).padStart(8, '0');
        const resultBits = bits[7 - bit1] + bits[7 - bit2] + bits[7 - bit3];
        return parseInt(resultBits, 2);  // Returns the decimal value of the bit sequence directly
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
        {CellVol02 !== null && <Text style={styles.CellVol02}>CellVol02: {CellVol02.toFixed(4)} V</Text>}
        {CellVol03 !== null && <Text style={styles.CellVol03}>CellVol03: {CellVol03.toFixed(4)} V</Text>}
        {CellVol04 !== null && <Text style={styles.CellVol04}>CellVol04: {CellVol04.toFixed(4)} V</Text>}
        {CellVol05 !== null && <Text style={styles.CellVol05}>CellVol05: {CellVol05.toFixed(4)} V</Text>}
        {CellVol06 !== null && <Text style={styles.CellVol06}>CellVol06: {CellVol06.toFixed(4)} V</Text>}
        {CellVol07 !== null && <Text style={styles.CellVol07}>CellVol07: {CellVol07.toFixed(4)} V</Text>}
        {CellVol08 !== null && <Text style={styles.CellVol08}>CellVol08: {CellVol08.toFixed(4)} V</Text>}
        {CellVol09 !== null && <Text style={styles.CellVol09}>CellVol09: {CellVol09.toFixed(4)} V</Text>}
        {CellVol10 !== null && <Text style={styles.CellVol10}>CellVol10: {CellVol10.toFixed(4)} V</Text>}
        {CellVol11 !== null && <Text style={styles.CellVol11}>CellVol11: {CellVol11.toFixed(4)} V</Text>}
        {CellVol12 !== null && <Text style={styles.CellVol12}>CellVol12: {CellVol12.toFixed(4)} V</Text>}
        {CellVol13 !== null && <Text style={styles.CellVol13}>CellVol13: {CellVol13.toFixed(4)} V</Text>}
        {CellVol14 !== null && <Text style={styles.CellVol14}>CellVol14: {CellVol14.toFixed(4)} V</Text>}
        {CellVol15 !== null && <Text style={styles.CellVol15}>CellVol15: {CellVol15.toFixed(4)} V</Text>}
        {CellVol16 !== null && <Text style={styles.CellVol16}>CellVol16: {CellVol16.toFixed(4)} V</Text>}
        {PackCurr !== null && <Text style={styles.PackCurr}>PackCurr: {PackCurr.toFixed(3)} A</Text>}
        {SOC !== null && <Text style={styles.SOC}>SOC: {SOC}%</Text>}
        {IgnitionStatus !== null && <Text style={styles.IgnitionStatus}>IgnitionStatus: {IgnitionStatus}</Text>}
        {Mode_Ack !== null && <Text style={styles.Mode_Ack}>Mode_Ack: {Mode_Ack}</Text>}
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
  CellVol02: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol03: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol04: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol05: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol06: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol07: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol08: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol09: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol10: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol11: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol12: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol13: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol14: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol15: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  CellVol16: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  PackCurr: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  SOC: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  IgnitionStatus: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  Mode_Ack: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DataTransfer;
