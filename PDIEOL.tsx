import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, Button } from "react-native";
import { Device } from "react-native-ble-plx";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Buffer } from "buffer";
import { db } from "./firebaseConfig"; // Ensure correct path
import { collection, getDocs } from "firebase/firestore";

type RootStackParamList = {
  PDIEOL: { device: Device };
};

type PDIEOLProps = NativeStackScreenProps<RootStackParamList, "PDIEOL">;

const PDIEOL: React.FC<PDIEOLProps> = ({ route }) => {
  const { device } = route.params;
  
  // State for values received from BLE
  const [SW_Version_MAJDecoder, setSW_Version_MAJDecoder] = useState<number | null>(null);
  const [SW_Version_MINDecoder, setSW_Version_MINDecoder] = useState<number | null>(null);
  const [HW_Version_MAJDecoder, setHW_Version_MAJDecoder] = useState<number | null>(null);
  const [HW_Version_MINDecoder, setHW_Version_MINDecoder] = useState<number | null>(null);

  // State for values from Firebase
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [isMatched, setIsMatched] = useState(false);

  const serviceUUID = "00FF";
  const characteristicUUID = "FF01";

  useEffect(() => {
    fetchData();
    setupBLESubscription();

    return () => {
      device.cancelConnection();
    };
  }, [device]);

  const fetchData = async () => {
    try {
      // ✅ Correct Firestore Query Syntax
      const querySnapshot = await getDocs(collection(db, "PDIEOL"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      console.log("Fetched Data:", data);
    } catch (error) {
      console.error("🔥 Error fetching data from Firebase:", error);
    }
  };
  
  fetchData();

  // Setup BLE subscription
  const setupBLESubscription = async () => {
    try {
      console.log("Checking connection...");
      
      // Ensure device is connected before subscribing
      const connectedDevice = await device.isConnected();
      if (!connectedDevice) {
        console.log("Device not connected. Trying to connect...");
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
      }
  
      console.log("Subscribing to characteristic...");
      await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
        if (error) {
          console.error("Subscription error:", error);
          Alert.alert("Subscription Error", `Error subscribing to characteristic: ${(error as Error).message}`);
          return;
        }
  
        if (characteristic?.value) {
          const data = Buffer.from(characteristic.value, "base64").toString("hex");
          decodeData(data);
        }
      });
    } catch (error: any) {
      console.error("Failed to set up subscription:", error);
      Alert.alert("Setup Error", `Error setting up characteristic subscription: ${error.message}`);
    }
  };
  

  // Decode BLE data
  const eight_bytes_decode = (firstByteCheck: string, multiplier: number, ...positions: number[]) => {
    return (data: string) => {
      if (data.length >= 2 * positions.length && data.substring(0, 2) === firstByteCheck) {
        const bytes = positions.map((pos) => data.substring(2 * pos, 2 * pos + 2)).join("");
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    };
  };

  // Extract and store values from BLE data
  const decodeData = (data: string) => {
    const SW_MAJ = eight_bytes_decode("05", 1.0, 9)(data);
    const SW_MIN = eight_bytes_decode("05", 1.0, 10)(data);
    const HW_MAJ = eight_bytes_decode("05", 1.0, 11)(data);
    const HW_MIN = eight_bytes_decode("05", 1.0, 12)(data);

    if (SW_MAJ !== null) setSW_Version_MAJDecoder(SW_MAJ);
    if (SW_MIN !== null) setSW_Version_MINDecoder(SW_MIN);
    if (HW_MAJ !== null) setHW_Version_MAJDecoder(HW_MAJ);
    if (HW_MIN !== null) setHW_Version_MINDecoder(HW_MIN);
  };

  // Compare Firebase and BLE values
  useEffect(() => {
    if (firebaseData && SW_Version_MAJDecoder !== null && SW_Version_MINDecoder !== null &&
        HW_Version_MAJDecoder !== null && HW_Version_MINDecoder !== null) {
      const matches =
        firebaseData.SW_Version_MAJ === SW_Version_MAJDecoder &&
        firebaseData.SW_Version_MIN === SW_Version_MINDecoder &&
        firebaseData.HW_Version_MAJ === HW_Version_MAJDecoder &&
        firebaseData.HW_Version_MIN === HW_Version_MINDecoder;

      setIsMatched(matches);
      if (!matches) {
        Alert.alert("Mismatch", "Please check the component!");
      }
    }
  }, [firebaseData, SW_Version_MAJDecoder, SW_Version_MINDecoder, HW_Version_MAJDecoder, HW_Version_MINDecoder]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Vehicle Data</Text>
        
        {SW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>SW_Version_MAJ: {SW_Version_MAJDecoder} V</Text>}
        {SW_Version_MINDecoder !== null && <Text style={styles.parameterText}>SW_Version_MIN: {SW_Version_MINDecoder} V</Text>}
        {HW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>HW_Version_MAJ: {HW_Version_MAJDecoder} V</Text>}
        {HW_Version_MINDecoder !== null && <Text style={styles.parameterText}>HW_Version_MIN: {HW_Version_MINDecoder} V</Text>}

        {firebaseData && <Text style={styles.infoText}>Fetched Firebase Data</Text>}
        
        {isMatched ? (
          <Button title="Checkout" onPress={() => Alert.alert("Success", "Checkout Completed!")} />
        ) : (
          <Text style={styles.warningText}>Waiting for correct data...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  parameterText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  infoText: { fontSize: 16, color: "blue", marginBottom: 10 },
  warningText: { fontSize: 16, color: "red", marginBottom: 10 },
});

export default PDIEOL;
