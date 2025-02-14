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
    let subscription: { remove: () => void } | undefined;
  
    const setupBLESubscription = async () => {
      try {
        const connected = await device.isConnected();
        if (!connected) {
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
        }
  
        subscription = device.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          (error, characteristic) => {
            if (error) {
              console.error("Subscription error:", error);
              Alert.alert("Subscription Error", error.message);
              return;
            }
  
            if (characteristic?.value) {
              const data = Buffer.from(characteristic.value, "base64").toString("hex");
              decodeData(data);
            }
          }
        );
      } catch (error: any) {
        console.error("Failed to set up subscription:", error);
        Alert.alert("Setup Error", error.message);
      }
    };
  
    setupBLESubscription();
  
    return () => {
      // Clean up the subscription if it exists
      if (subscription) {
        subscription.remove();
      }
      // Optionally, you can cancel the device connection if that's part of your desired lifecycle.
      // Note: If you cancel the connection here, ensure that your reconnection logic handles it on re-enter.
      // device.cancelConnection();
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

  const handleCheckout = () => {
    if (!firebaseData) {
      Alert.alert("Error", "No data fetched from Firebase. Please enter a valid vehicle number and fetch data.");
      return;
    }

    const matches =
      firebaseData.SW_Version_MAJ === SW_Version_MAJDecoder &&
      firebaseData.SW_Version_MIN === SW_Version_MINDecoder &&
      firebaseData.HW_Version_MAJ === HW_Version_MAJDecoder &&
      firebaseData.HW_Version_MIN === HW_Version_MINDecoder;

    if (matches) {
      Alert.alert("Checkout Successful", "All components match!");
    } else {
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

        {SW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>SW_Version_MAJ: {SW_Version_MAJDecoder} V</Text>}
        {SW_Version_MINDecoder !== null && <Text style={styles.parameterText}>SW_Version_MIN: {SW_Version_MINDecoder} V</Text>}
        {HW_Version_MAJDecoder !== null && <Text style={styles.parameterText}>HW_Version_MAJ: {HW_Version_MAJDecoder} V</Text>}
        {HW_Version_MINDecoder !== null && <Text style={styles.parameterText}>HW_Version_MIN: {HW_Version_MINDecoder} V</Text>}

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
