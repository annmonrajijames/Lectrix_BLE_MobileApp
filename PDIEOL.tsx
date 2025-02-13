import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, Button, TextInput } from "react-native";
import { Device } from "react-native-ble-plx";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Buffer } from "buffer";
import { db } from "./firebaseConfig"; // Ensure correct path
import { doc, getDoc } from "firebase/firestore";

type RootStackParamList = {
  PDIEOL: { device: Device };
};

type PDIEOLProps = NativeStackScreenProps<RootStackParamList, "PDIEOL">;

const PDIEOL: React.FC<PDIEOLProps> = ({ route }) => {
  const { device } = route.params;
  
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [isMatched, setIsMatched] = useState(false);

  const [SW_Version_MAJDecoder, setSW_Version_MAJDecoder] = useState<number | null>(null);
  const [SW_Version_MINDecoder, setSW_Version_MINDecoder] = useState<number | null>(null);
  const [HW_Version_MAJDecoder, setHW_Version_MAJDecoder] = useState<number | null>(null);
  const [HW_Version_MINDecoder, setHW_Version_MINDecoder] = useState<number | null>(null);

  const serviceUUID = "00FF";
  const characteristicUUID = "FF01";

  useEffect(() => {
    setupBLESubscription();
    return () => {
      device.cancelConnection();
    };
  }, [device]);

  const fetchFirebaseData = async () => {
    if (!vehicleNumber.trim()) {
      Alert.alert("Error", "Please enter a vehicle number");
      return;
    }
  
    const trimmedVehicleNumber = vehicleNumber.trim();
    console.log("🚀 Checking if vehicle exists:", trimmedVehicleNumber);
  
    try {
      const docRef = doc(db, "parameters", trimmedVehicleNumber);
      console.log("🔍 Firestore Document Path:", docRef.path); // Debugging
  
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.log("❌ No document found with ID:", trimmedVehicleNumber);
        Alert.alert("Error", "No data found for this vehicle number.");
        return;
      }
  
      console.log("✅ Vehicle found! Fetching data...");
      const data = docSnap.data();
      console.log("📂 Document Data:", data);
  
      // Ensure values exist before setting state
      setFirebaseData(data);
      setSW_Version_MAJDecoder(data?.SW_Version_MAJDecoder ?? null);
      setSW_Version_MINDecoder(data?.SW_Version_MINDecoder ?? null);
      setHW_Version_MAJDecoder(data?.HW_Version_MAJDecoder ?? null);
      setHW_Version_MINDecoder(data?.HW_Version_MINDecoder ?? null);
  
    } catch (error) {
      console.error("🔥 Firebase Fetch Error:", error);
      if (error instanceof Error) {
        Alert.alert("Error", `Failed to fetch data: ${error.message}`);
      } else {
        Alert.alert("Error", "Failed to fetch data");
      }
    }
  };
 
  const setupBLESubscription = async () => {
    try {
      const connectedDevice = await device.isConnected();
      if (!connectedDevice) {
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
      }

      await device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
        if (error) {
          console.error("Subscription error:", error);
          Alert.alert("Subscription Error", error.message);
          return;
        }

        if (characteristic?.value) {
          const data = Buffer.from(characteristic.value, "base64").toString("hex");
          // console.log("📡 BLE Data Received (Hex):", data); // Log BLE data to terminal
          decodeData(data);
        }
      });
    } catch (error: any) {
      console.error("Failed to set up subscription:", error);
      Alert.alert("Setup Error", error.message);
    }
  };

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

  // Define the correct type for state
  type VersionState = {
    SW_Version_MAJ: number | null;
    SW_Version_MIN: number | null;
    HW_Version_MAJ: number | null;
    HW_Version_MIN: number | null;
  };

  // Initialize state with null values
  const [prevValues, setPrevValues] = useState<VersionState>({
    SW_Version_MAJ: null,
    SW_Version_MIN: null,
    HW_Version_MAJ: null,
    HW_Version_MIN: null,
  });

  const decodeData = (data: string) => {
    const SW_MAJ = eight_bytes_decode("05", 1.0, 9)(data);
    const SW_MIN = eight_bytes_decode("05", 1.0, 10)(data);
    const HW_MAJ = eight_bytes_decode("05", 1.0, 11)(data);
    const HW_MIN = eight_bytes_decode("05", 1.0, 12)(data);

    // Ensure null values are replaced with previous values
    const newValues: VersionState = {
      SW_Version_MAJ: SW_MAJ !== null ? SW_MAJ : prevValues.SW_Version_MAJ,
      SW_Version_MIN: SW_MIN !== null ? SW_MIN : prevValues.SW_Version_MIN,
      HW_Version_MAJ: HW_MAJ !== null ? HW_MAJ : prevValues.HW_Version_MAJ,
      HW_Version_MIN: HW_MIN !== null ? HW_MIN : prevValues.HW_Version_MIN,
    };

    console.log("✅ Updated Decoded Values:", newValues);

    // Update states with the new values
    setSW_Version_MAJDecoder(newValues.SW_Version_MAJ);
    setSW_Version_MINDecoder(newValues.SW_Version_MIN);
    setHW_Version_MAJDecoder(newValues.HW_Version_MAJ);
    setHW_Version_MINDecoder(newValues.HW_Version_MIN);

    // Save the latest values as previous values for next time
    setPrevValues(newValues);
  };


  
  const handleCheckout = () => {
    if (!firebaseData) {
      Alert.alert("Error", "No data fetched from Firebase. Please enter a valid vehicle number and fetch data.");
      return;
    }
  
    if (
      firebaseData.SW_Version_MAJDecoder === SW_Version_MAJDecoder &&
      firebaseData.SW_Version_MINDecoder === SW_Version_MINDecoder &&
      firebaseData.HW_Version_MAJDecoder === HW_Version_MAJDecoder &&
      firebaseData.HW_Version_MINDecoder === HW_Version_MINDecoder
    ) {
      console.log("✅ Data Matched! BLE and Firebase values are the same.");
      Alert.alert("Checkout Successful", "All components match!");
    } else {
      console.log("❌ Data Mismatch! BLE and Firebase values are different.");
      console.log("🔍 Firebase Data:", firebaseData);
      console.log("🔍 BLE Data:", {
        SW_Version_MAJDecoder,
        SW_Version_MINDecoder,
        HW_Version_MAJDecoder,
        HW_Version_MINDecoder
      });
      Alert.alert("Please check the components", "Mismatch detected!");
    }
  };
  

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Vehicle Data</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />
        <Button title="Fetch Data" onPress={fetchFirebaseData} />

        {SW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>SW_Version_MAJ: {SW_Version_MAJDecoder} </Text>}
        {SW_Version_MINDecoder !== null && <Text style={styles.parameterText}>SW_Version_MIN: {SW_Version_MINDecoder} </Text>}
        {HW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>HW_Version_MAJ: {HW_Version_MAJDecoder} </Text>}
        {HW_Version_MINDecoder !== null && <Text style={styles.parameterText}>HW_Version_MIN: {HW_Version_MINDecoder} </Text>}

        {firebaseData && <Text style={styles.infoText}>Fetched Firebase Data</Text>}

        <Button title="Checkout" onPress={handleCheckout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  parameterText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  infoText: { fontSize: 16, color: "blue", marginBottom: 10 },
  warningText: { fontSize: 16, color: "red", marginBottom: 10 },
});

export default PDIEOL;
