import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  TextInput,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Buffer } from "buffer";
import { db } from "./firebaseConfig"; // Ensure correct path
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

type RootStackParamList = {
  PDIEOL: { device: Device };
};

type PDIEOLProps = NativeStackScreenProps<RootStackParamList, "PDIEOL">;

/**
 * Helper function to parse a custom timestamp string in the format:
 * "YYYY-MM-DD_HH-mm-ss-zzz" (for example, "2025-02-15_16-55-06-040")
 * and return a Date object.
 *
 * This function assumes that the last part (zzz) is the offset in hours and minutes
 * (without a colon) and that it represents a negative offset (e.g. "040" means "-04:00").
 */
const parseCustomTimestamp = (ts: string): Date | null => {
  const parts = ts.split("_");
  if (parts.length !== 2) return null;
  const datePart = parts[0]; // e.g., "2025-02-15"
  const timePart = parts[1]; // e.g., "16-55-06-040"
  const timeComponents = timePart.split("-");
  if (timeComponents.length !== 4) return null;
  const [hour, minute, second, offsetRaw] = timeComponents;
  // Assume offsetRaw is a 3-digit string representing a negative offset.
  // For example, "040" becomes "-04:00"
  const offsetStr = "-" + offsetRaw.slice(0, 2) + ":" + offsetRaw.slice(2).padEnd(2, "0");
  // Build an ISO string. For example: "2025-02-15T16:55:06-04:00"
  const isoString = `${datePart}T${hour}:${minute}:${second}${offsetStr}`;
  const parsedDate = new Date(isoString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

/**
 * Helper function to format a Date in local time as an ISO-like string.
 * For example, if local time is 21:27:25.993, it returns "2025-02-15T21:27:25.993"
 */
const formatLocalISO = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const padMs = (num: number) => num.toString().padStart(3, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMs(date.getMilliseconds())}`;
};

const PDIEOL: React.FC<PDIEOLProps> = ({ route }) => {
  const { device } = route.params;
  
  // Entry Box States
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [testerName, setTesterName] = useState<string>("");

  // BLE Data States
  const [SW_Version_MAJDecoder, setSW_Version_MAJDecoder] = useState<number | null>(null);
  const [SW_Version_MINDecoder, setSW_Version_MINDecoder] = useState<number | null>(null);
  const [HW_Version_MAJDecoder, setHW_Version_MAJDecoder] = useState<number | null>(null);
  const [HW_Version_MINDecoder, setHW_Version_MINDecoder] = useState<number | null>(null);

  // Firebase Data State and Mismatch Message
  const [firebaseData, setFirebaseData] = useState<any>(null);
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

  const fetchFirebaseData = async () => {
    try {
      const parametersCollectionRef = collection(db, "parameters");
      const querySnapshot = await getDocs(parametersCollectionRef);
      if (querySnapshot.empty) {
        Alert.alert("Error", "No data found in parameters collection.");
        return;
      }
      // Sort documents by document ID (assumed to be in proper ISO format) in descending order
      const sortedDocs = querySnapshot.docs.sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      const latestData = sortedDocs[0].data();
      console.log("📂 Latest Document Data:", latestData);
      if (latestData) {
        setFirebaseData(latestData);
      }
    } catch (error) {
      console.error("Firebase Fetch Error:", error);
      Alert.alert("Error", `Failed to fetch data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

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
      setMismatchMessage(
        mismatches.length > 0
          ? `Mismatched parameter(s): ${mismatches.join(", ")}`
          : "All parameters match."
      );
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

  // When pushing data, use the fetched firebaseData.timestamp directly for Admin_timestamp.
  // For Tester_timestamp, generate the current local time in the desired ISO format without trailing "Z".
  const pushVehicleData = async () => {
    if (!firebaseData) {
      Alert.alert("Error", "Firebase data is not available.");
      return;
    }
    if (mismatchMessage !== "All parameters match.") {
      Alert.alert("Error", "Parameters do not match. Cannot push data.");
      return;
    }
    if (!vehicleNumber || !testerName) {
      Alert.alert("Error", "Please enter both Vehicle Number and Tester Name.");
      return;
    }
    // Use the fetched timestamp as Admin_timestamp (assumed to already be in the correct format)
    const adminTimestamp = firebaseData.timestamp;
    // Generate Tester_timestamp using the local time formatter
    const testerTimestamp = formatLocalISO(new Date());
    
    const docRef = doc(db, "Matched Vehicle", vehicleNumber);
    try {
      await setDoc(docRef, {
        vehicleNumber,
        testerName,
        SW_Version_MAJDecoder,
        SW_Version_MINDecoder,
        HW_Version_MAJDecoder,
        HW_Version_MINDecoder,
        Admin_timestamp: adminTimestamp, // e.g. "2025-02-15T17:20:30.040"
        Tester_timestamp: testerTimestamp, // e.g. "2025-02-15T21:27:25.993" if local time is that
      });
      Alert.alert("Success", "Vehicle data pushed successfully!");
    } catch (error) {
      console.error("Push Error:", error);
      Alert.alert("Error", "Failed to push vehicle data.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.entryContainer}>
          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
          />
          <Text style={styles.label}>Tester Name</Text>
          <TextInput
            style={styles.input}
            value={testerName}
            onChangeText={setTesterName}
          />
        </View>
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
        <Button
          title="PUSH Vehicle data along with vehicle number and tester name"
          onPress={pushVehicleData}
          disabled={!(firebaseData && mismatchMessage === "All parameters match.")}
        />
        <View style={{ height: 10 }} />
        <Button title="Fetch Firebase Data" onPress={fetchFirebaseData} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { alignItems: "center", padding: 20, paddingBottom: 140 },
  entryContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "5%",
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 5,
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  parameterText: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
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
