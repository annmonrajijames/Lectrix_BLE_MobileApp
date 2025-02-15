import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
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
  
  // BLE Data States
  const [SW_Version_MAJDecoder, setSW_Version_MAJDecoder] = useState<number | null>(null);
  const [SW_Version_MINDecoder, setSW_Version_MINDecoder] = useState<number | null>(null);
  const [HW_Version_MAJDecoder, setHW_Version_MAJDecoder] = useState<number | null>(null);
  const [HW_Version_MINDecoder, setHW_Version_MINDecoder] = useState<number | null>(null);

  // Firebase Data State
  const [firebaseData, setFirebaseData] = useState<any>(null);
  // Mismatch message state
  const [mismatchMessage, setMismatchMessage] = useState<string>("");

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
              if (error.message && error.message.includes("Operation was cancelled")) {
                console.log("Subscription cancelled as part of cleanup.");
                return;
              }
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
      if (subscription) {
        subscription.remove();
      }
    };
  }, [device]);

  // Fetch the most recent document from the "parameters" collection
  const fetchFirebaseData = async () => {
    try {
      const parametersCollectionRef = collection(db, "parameters");
      const querySnapshot = await getDocs(parametersCollectionRef);
  
      if (querySnapshot.empty) {
        console.log("❌ No documents found in the parameters collection.");
        Alert.alert("Error", "No data found in parameters collection.");
        return;
      }
  
      // Sort documents by document ID (assumed to be an ISO timestamp) in descending order
      const sortedDocs = querySnapshot.docs.sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      const latestData = sortedDocs[0].data();
      console.log("📂 Latest Document Data:", latestData);
  
      if (latestData) {
        setFirebaseData(latestData);
      }
  
    } catch (error) {
      console.error("🔥 Firebase Fetch Error:", error);
      if (error instanceof Error) {
        Alert.alert("Error", `Failed to fetch data: ${error.message}`);
      } else {
        Alert.alert("Error", "Failed to fetch data");
      }
    }
  };

  // Compare BLE and Firebase Data and update mismatchMessage
  useEffect(() => {
    if (firebaseData) {
      const mismatches: string[] = [];
      if (
        firebaseData.SW_Version_MAJDecoder !== undefined &&
        SW_Version_MAJDecoder !== null &&
        Number(firebaseData.SW_Version_MAJDecoder) !== SW_Version_MAJDecoder
      ) {
        mismatches.push("SW_Version_MAJ");
      }
      if (
        firebaseData.SW_Version_MINDecoder !== undefined &&
        SW_Version_MINDecoder !== null &&
        Number(firebaseData.SW_Version_MINDecoder) !== SW_Version_MINDecoder
      ) {
        mismatches.push("SW_Version_MIN");
      }
      if (
        firebaseData.HW_Version_MAJDecoder !== undefined &&
        HW_Version_MAJDecoder !== null &&
        Number(firebaseData.HW_Version_MAJDecoder) !== HW_Version_MAJDecoder
      ) {
        mismatches.push("HW_Version_MAJ");
      }
      if (
        firebaseData.HW_Version_MINDecoder !== undefined &&
        HW_Version_MINDecoder !== null &&
        Number(firebaseData.HW_Version_MINDecoder) !== HW_Version_MINDecoder
      ) {
        mismatches.push("HW_Version_MIN");
      }
      if (mismatches.length > 0) {
        setMismatchMessage(`Mismatched parameter(s): ${mismatches.join(", ")}`);
      } else {
        setMismatchMessage("All parameters match.");
      }
    }
  }, [
    firebaseData,
    SW_Version_MAJDecoder,
    SW_Version_MINDecoder,
    HW_Version_MAJDecoder,
    HW_Version_MINDecoder,
  ]);

  const eight_bytes_decode = (
    firstByteCheck: string,
    multiplier: number,
    ...positions: number[]
  ) => {
    return (data: string) => {
      if (
        data.length >= 2 * positions.length &&
        data.substring(0, 2) === firstByteCheck
      ) {
        const bytes = positions
          .map((pos) => data.substring(2 * pos, 2 * pos + 2))
          .join("");
        const decimalValue = parseInt(bytes, 16);
        return decimalValue * multiplier;
      }
      return null;
    };
  };

  // Decode BLE data and update state
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* BLE Data Section */}
        <Text style={styles.header}>BLE Data</Text>
        <Text style={styles.parameterText}>
          SW_Version_MAJ: {SW_Version_MAJDecoder !== null ? SW_Version_MAJDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          SW_Version_MIN: {SW_Version_MINDecoder !== null ? SW_Version_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          HW_Version_MAJ: {HW_Version_MAJDecoder !== null ? HW_Version_MAJDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          HW_Version_MIN: {HW_Version_MINDecoder !== null ? HW_Version_MINDecoder : "N/A"}
        </Text>

        {/* Firebase Data Section */}
        {firebaseData && (
          <View style={styles.firebaseContainer}>
            <Text style={styles.header}>Firebase Data</Text>
            <Text style={styles.parameterText}>
              SW_Version_MAJDecoder: {firebaseData.SW_Version_MAJDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              SW_Version_MINDecoder: {firebaseData.SW_Version_MINDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              HW_Version_MAJDecoder: {firebaseData.HW_Version_MAJDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              HW_Version_MINDecoder: {firebaseData.HW_Version_MINDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Timestamp: {firebaseData.timestamp || "N/A"}
            </Text>
            {mismatchMessage !== "" && (
              <Text style={styles.mismatchText}>{mismatchMessage}</Text>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.fixedButtonContainer}>
        <Button title="Fetch Firebase Data" onPress={fetchFirebaseData} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { alignItems: "center", padding: 20, paddingBottom: 120 },
  header: { fontSize: 24, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
  parameterText: { fontSize: 18, marginBottom: 5, textAlign: "center" },
  firebaseContainer: { marginTop: 30, alignItems: "center" },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  mismatchText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default PDIEOL;
