// PDIEOL.tsx
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
  Modal,
  TouchableOpacity,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Buffer } from "buffer";
import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

type RootStackParamList = {
  PDIEOL: { device: Device };
  DataDirection: { device: Device };
};

type PDIEOLProps = NativeStackScreenProps<RootStackParamList, "PDIEOL">;

const parseCustomTimestamp = (ts: string): Date | null => {
  const parts = ts.split("_");
  if (parts.length !== 2) return null;
  const datePart = parts[0];
  const timePart = parts[1];
  const timeComponents = timePart.split("-");
  if (timeComponents.length !== 4) return null;
  const [hour, minute, second, offsetRaw] = timeComponents;
  const offsetStr =
    "-" + offsetRaw.slice(0, 2) + ":" + offsetRaw.slice(2).padEnd(2, "0");
  const isoString = `${datePart}T${hour}:${minute}:${second}${offsetStr}`;
  const parsedDate = new Date(isoString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatLocalISO = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const padMs = (num: number) => num.toString().padStart(3, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}.${padMs(date.getMilliseconds())}`;
};

const PDIEOL: React.FC<PDIEOLProps> = ({ route, navigation }) => {
  const { device } = route.params;

  // Entry Box States
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [testerName, setTesterName] = useState<string>("");

  // BLE Data States for admin parameters (using the exact same keys).
  const [Cluster_Software_Version, setCluster_Software_Version] = useState<number | null>(null);
  const [Cluster_Hardware_Version, setCluster_Hardware_Version] = useState<string | null>(null);
  const [MCU_Version_Firmware_Id, setMCU_Version_Firmware_Id] = useState<string | null>(null);

  // Additional BLE Decoded Parameters (key names remain unchanged).
  const [Battery_Version_ConfigVer, setBattery_Version_ConfigVer] = useState<string | null>(null);
  const [Battery_Version_InternalFWVer, setBattery_Version_InternalFWVer] = useState<string | null>(null);
  const [Battery_Version_InternalFWSubVer, setBattery_Version_InternalFWSubVer] = useState<string | null>(null);
  const [Battery_Version_HwVer, setBattery_Version_HwVer] = useState<string | null>(null);
  const [Battery_Version_FwVer, setBattery_Version_FwVer] = useState<string | null>(null);
  const [Battery_Version_FWSubVer, setBattery_Version_FWSubVer] = useState<string | null>(null);

  // Charger parameters
  const [Charger_Version_Hardware_MAJ, setCharger_Version_Hardware_MAJ] = useState<string | null>(null);
  const [Charger_Version_Software_MAJ, setCharger_Version_Software_MAJ] = useState<string | null>(null);
  const [Charger_Version_Hardware_MIN, setCharger_Version_Hardware_MIN] = useState<number | null>(null);
  const [Charger_Version_Software_MIN, setCharger_Version_Software_MIN] = useState<number | null>(null);

  // Firebase Data State (contains the pushed document)
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [mismatchMessage, setMismatchMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // New state to store the parameter group selection:
  // Options: "all", "withoutCharger", "onlyCharger"
  const [selectedDataOption, setSelectedDataOption] = useState<string>("withoutCharger");

  const serviceUUID = "00FF";
  const characteristicUUID = "FF01";

  // Decoding functions (unchanged in logic)
  const eight_bytes_decode = (
    firstByteCheck: string,
    multiplier: number,
    ...positions: number[]
  ) => {
    return (data: string) => {
      const maxPos = Math.max(...positions);
      if (
        data.length >= 2 * (maxPos + 1) &&
        data.substring(0, 2) === firstByteCheck
      ) {
        const bytes = positions
          .map((pos) => data.substring(2 * pos, 2 * pos + 2))
          .join("");
        return parseInt(bytes, 16) * multiplier;
      }
      return null;
    };
  };
  const eight_bytes_RawHex_decode = (
    firstByteCheck: string,
    ...positions: number[]
  ) => {
    return (data: string) => {
      const maxPos = Math.max(...positions);
      if (
        data.length >= 2 * (maxPos + 1) &&
        data.substring(0, 2) === firstByteCheck
      ) {
        // Extract hexadecimal pairs from specified positions and join them directly
        const rawHex = positions
          .map((pos) => data.substring(2 * pos, 2 * pos + 2))
          .join("");
        return rawHex;
      }
      return null;
    };
  };
  
  const eight_bytes_ascii_decode = (
    firstByteCheck: string,
    ...positions: number[]
  ) => {
    return (data: string) => {
      const maxPos = Math.max(...positions);
      if (
        data.length >= 2 * (maxPos + 1) &&
        data.substring(0, 2) === firstByteCheck
      ) {
        return positions
          .map((pos) =>
            String.fromCharCode(
              parseInt(data.substring(2 * pos, 2 * pos + 2), 16)
            )
          )
          .join("");
      }
      return null;
    };
  };

  // Fetch the most recent admin data from Firebase on mount.
  useEffect(() => {
    fetchFirebaseData();
  }, []);

  // Set up BLE subscription on mount.
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
                return;
              }
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
      const sortedDocs = querySnapshot.docs.sort((a, b) =>
        b.id.localeCompare(a.id)
      );
      const latestData = sortedDocs[0].data();
      if (latestData) {
        setFirebaseData(latestData);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to fetch data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Update mismatch check based on the selected parameter group.
  useEffect(() => {
    if (firebaseData) {
      const mismatches: string[] = [];
      const checkNonCharger = selectedDataOption !== "onlyCharger";
      const checkCharger = selectedDataOption !== "withoutCharger";

      if (checkNonCharger) {
        if (
          firebaseData.Cluster_Software_Version !== undefined &&
          Cluster_Software_Version !== null &&
          Number(firebaseData.Cluster_Software_Version) !== Cluster_Software_Version
        ) {
          mismatches.push("Cluster_Software_Version");
        }
        if (
          firebaseData.Cluster_Hardware_Version !== undefined &&
          Cluster_Hardware_Version !== null &&
          String(firebaseData.Cluster_Hardware_Version) !== Cluster_Hardware_Version
        ) {
          mismatches.push("Cluster_Hardware_Version");
        }
        if (
          firebaseData.MCU_Version_Firmware_Id !== undefined &&
          MCU_Version_Firmware_Id !== null &&
          firebaseData.MCU_Version_Firmware_Id !== MCU_Version_Firmware_Id
        ) {
          mismatches.push("MCU_Version_Firmware_Id");
        }
        if (
          firebaseData.Battery_Version_ConfigVer !== undefined &&
          Battery_Version_ConfigVer !== null &&
          firebaseData.Battery_Version_ConfigVer !== Battery_Version_ConfigVer
        ) {
          mismatches.push("Battery_Version_ConfigVer");
        }
        if (
          firebaseData.Battery_Version_InternalFWVer !== undefined &&
          Battery_Version_InternalFWVer !== null &&
          firebaseData.Battery_Version_InternalFWVer !== Battery_Version_InternalFWVer
        ) {
          mismatches.push("Battery_Version_InternalFWVer");
        }
        if (
          firebaseData.Battery_Version_InternalFWSubVer !== undefined &&
          Battery_Version_InternalFWSubVer !== null &&
          firebaseData.Battery_Version_InternalFWSubVer !== Battery_Version_InternalFWSubVer
        ) {
          mismatches.push("Battery_Version_InternalFWSubVer");
        }
        if (
          firebaseData.Battery_Version_HwVer !== undefined &&
          Battery_Version_HwVer !== null &&
          firebaseData.Battery_Version_HwVer !== Battery_Version_HwVer
        ) {
          mismatches.push("Battery_Version_HwVer");
        }
        if (
          firebaseData.Battery_Version_FwVer !== undefined &&
          Battery_Version_FwVer !== null &&
          firebaseData.Battery_Version_FwVer !== Battery_Version_FwVer
        ) {
          mismatches.push("Battery_Version_FwVer");
        }
        if (
          firebaseData.Battery_Version_FWSubVer !== undefined &&
          Battery_Version_FWSubVer !== null &&
          firebaseData.Battery_Version_FWSubVer !== Battery_Version_FWSubVer
        ) {
          mismatches.push("Battery_Version_FWSubVer");
        }
      }
      if (checkCharger) {
        if (
          firebaseData.Charger_Version_Hardware_MAJ !== undefined &&
          Charger_Version_Hardware_MAJ !== null &&
          firebaseData.Charger_Version_Hardware_MAJ !== Charger_Version_Hardware_MAJ
        ) {
          mismatches.push("Charger_Version_Hardware_MAJ");
        }
        if (
          firebaseData.Charger_Version_Software_MAJ !== undefined &&
          Charger_Version_Software_MAJ !== null &&
          firebaseData.Charger_Version_Software_MAJ !== Charger_Version_Software_MAJ
        ) {
          mismatches.push("Charger_Version_Software_MAJ");
        }
        if (
          firebaseData.Charger_Version_Hardware_MIN !== undefined &&
          Charger_Version_Hardware_MIN !== null &&
          Number(firebaseData.Charger_Version_Hardware_MIN) !== Charger_Version_Hardware_MIN
        ) {
          mismatches.push("Charger_Version_Hardware_MIN");
        }
        if (
          firebaseData.Charger_Version_Software_MIN !== undefined &&
          Charger_Version_Software_MIN !== null &&
          Number(firebaseData.Charger_Version_Software_MIN) !== Charger_Version_Software_MIN
        ) {
          mismatches.push("Charger_Version_Software_MIN");
        }
      }
      setMismatchMessage(
        mismatches.length > 0
          ? `Mismatched parameter(s): ${mismatches.join(", ")}`
          : "All parameters match."
      );
    }
  }, [
    firebaseData,
    selectedDataOption,
    Cluster_Software_Version,
    Cluster_Hardware_Version,
    MCU_Version_Firmware_Id,
    Battery_Version_ConfigVer,
    Battery_Version_InternalFWVer,
    Battery_Version_InternalFWSubVer,
    Battery_Version_HwVer,
    Battery_Version_FwVer,
    Battery_Version_FWSubVer,
    Charger_Version_Hardware_MAJ,
    Charger_Version_Software_MAJ,
    Charger_Version_Hardware_MIN,
    Charger_Version_Software_MIN,
  ]);

  const decodeData = (data: string) => {
    // Decode numeric values using the updated setters.
    const SW_MAJ = eight_bytes_decode("05", 1.0, 9)(data);
    const SW_MIN = eight_bytes_RawHex_decode ("05", 10)(data);
    const MCU_Id = eight_bytes_ascii_decode("04", 8, 9, 10, 11, 12, 13, 14, 15)(data);

    // Decode additional parameters.
    const battery_ConfigVer = eight_bytes_ascii_decode("14", 2, 3, 4)(data);
    const battery_InternalFWVer = eight_bytes_ascii_decode("14", 5, 6, 7)(data);
    const battery_InternalFWSubVer = eight_bytes_ascii_decode("14", 8, 9)(data);
    const battery_HwVer = eight_bytes_ascii_decode("06", 10, 11, 12)(data);
    const battery_FwVer = eight_bytes_ascii_decode("06", 13, 14, 15)(data);
    const battery_FWSubVer = eight_bytes_ascii_decode("06", 16, 17)(data);

    // Decode Charger parameters.
    const chargerHardwareMAJ = eight_bytes_ascii_decode("20", 1)(data);
    const chargerSoftwareMAJ = eight_bytes_ascii_decode("20", 3)(data);
    const chargerHardwareMIN = eight_bytes_decode("20", 1.0, 2)(data);
    const chargerSoftwareMIN = eight_bytes_decode("20", 1.0, 4)(data);

    if (MCU_Id !== null) setMCU_Version_Firmware_Id(MCU_Id);
    if (SW_MAJ !== null) setCluster_Software_Version(SW_MAJ);
    if (SW_MIN !== null) setCluster_Hardware_Version(SW_MIN);

    if (battery_ConfigVer !== null) setBattery_Version_ConfigVer(battery_ConfigVer);
    if (battery_InternalFWVer !== null) setBattery_Version_InternalFWVer(battery_InternalFWVer);
    if (battery_InternalFWSubVer !== null) setBattery_Version_InternalFWSubVer(battery_InternalFWSubVer);
    if (battery_HwVer !== null) setBattery_Version_HwVer(battery_HwVer);
    if (battery_FwVer !== null) setBattery_Version_FwVer(battery_FwVer);
    if (battery_FWSubVer !== null) setBattery_Version_FWSubVer(battery_FWSubVer);

    if (chargerHardwareMAJ !== null) setCharger_Version_Hardware_MAJ(chargerHardwareMAJ);
    if (chargerSoftwareMAJ !== null) setCharger_Version_Software_MAJ(chargerSoftwareMAJ);
    if (chargerHardwareMIN !== null) setCharger_Version_Hardware_MIN(chargerHardwareMIN);
    if (chargerSoftwareMIN !== null) setCharger_Version_Software_MIN(chargerSoftwareMIN);
  };

  // Determine if all required BLE data is available based on the chosen option.
  let allBLEDataAvailable;
  if (selectedDataOption === "all") {
    allBLEDataAvailable =
      Cluster_Software_Version !== null &&
      Cluster_Hardware_Version !== null &&
      MCU_Version_Firmware_Id !== null &&
      Battery_Version_ConfigVer !== null &&
      Battery_Version_InternalFWVer !== null &&
      Battery_Version_InternalFWSubVer !== null &&
      Battery_Version_HwVer !== null &&
      Battery_Version_FwVer !== null &&
      Battery_Version_FWSubVer !== null &&
      Charger_Version_Hardware_MAJ !== null &&
      Charger_Version_Software_MAJ !== null &&
      Charger_Version_Hardware_MIN !== null &&
      Charger_Version_Software_MIN !== null;
  } else if (selectedDataOption === "withoutCharger") {
    allBLEDataAvailable =
      Cluster_Software_Version !== null &&
      Cluster_Hardware_Version !== null &&
      MCU_Version_Firmware_Id !== null &&
      Battery_Version_ConfigVer !== null &&
      Battery_Version_InternalFWVer !== null &&
      Battery_Version_InternalFWSubVer !== null &&
      Battery_Version_HwVer !== null &&
      Battery_Version_FwVer !== null &&
      Battery_Version_FWSubVer !== null;
  } else if (selectedDataOption === "onlyCharger") {
    allBLEDataAvailable =
      Charger_Version_Hardware_MAJ !== null &&
      Charger_Version_Software_MAJ !== null &&
      Charger_Version_Hardware_MIN !== null &&
      Charger_Version_Software_MIN !== null;
  }

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
    const adminTimestamp = firebaseData.timestamp;
    const testerTimestamp = formatLocalISO(new Date());
  
    let dataChoice = "";
    if (selectedDataOption === "withoutCharger") { 
      dataChoice = "Without Charger"; 
    } else if (selectedDataOption === "all") { 
      dataChoice = "All Vehicle Data"; 
    } else if (selectedDataOption === "onlyCharger") {
      dataChoice = "Only Charger";
    }
  
    // Use the exact parameter key names to push vehicle data.
    const docRef = doc(db, "Matched Vehicle", vehicleNumber);
    try {
      await setDoc(docRef, {
        vehicleNumber,
        testerName,
        Cluster_Software_Version,
        Cluster_Hardware_Version,
        MCU_Version_Firmware_Id,
        Battery_Version_ConfigVer,
        Battery_Version_InternalFWVer,
        Battery_Version_InternalFWSubVer,
        Battery_Version_HwVer,
        Battery_Version_FwVer,
        Battery_Version_FWSubVer,
        Charger_Version_Hardware_MAJ,
        Charger_Version_Software_MAJ,
        Charger_Version_Hardware_MIN,
        Charger_Version_Software_MIN,
        Admin_timestamp: adminTimestamp,
        Tester_timestamp: testerTimestamp,
        Data_choice: dataChoice,
      });
      Alert.alert(
        "Check completed & Upload",
        "",
        [{ text: "OK", onPress: () => navigation.navigate("DataDirection", { device }) }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to push vehicle data.");
    }
  };  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Entry Section */}
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

        {/* Radio Buttons for Data Options */}
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedDataOption === "withoutCharger" && styles.radioButtonSelected,
            ]}
            onPress={() => setSelectedDataOption("withoutCharger")}
          >
            <Text style={styles.radioText}>Without Charger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedDataOption === "all" && styles.radioButtonSelected,
            ]}
            onPress={() => setSelectedDataOption("all")}
          >
            <Text style={styles.radioText}>All Vehicle Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedDataOption === "onlyCharger" && styles.radioButtonSelected,
            ]}
            onPress={() => setSelectedDataOption("onlyCharger")}
          >
            <Text style={styles.radioText}>Only Charger</Text>
          </TouchableOpacity>
        </View>

        {/* Info Button Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Press to see Version number set by admin</Text>
          <Button title="ℹ️" onPress={() => setModalVisible(true)} />
        </View>

        {/* Vehicle Data Header */}
        <Text style={styles.header}>Vehicle data</Text>
        <Text style={styles.parameterText}>
          Cluster_Software_Version: {Cluster_Software_Version !== null ? Cluster_Software_Version : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Cluster_Hardware_Version: {Cluster_Hardware_Version !== null ? Cluster_Hardware_Version : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          MCU_Version_Firmware_Id: {MCU_Version_Firmware_Id !== null ? MCU_Version_Firmware_Id : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_ConfigVer: {Battery_Version_ConfigVer || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_InternalFWVer: {Battery_Version_InternalFWVer || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_InternalFWSubVer: {Battery_Version_InternalFWSubVer || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_HwVer: {Battery_Version_HwVer || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_FwVer: {Battery_Version_FwVer || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_FWSubVer: {Battery_Version_FWSubVer || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Hardware_MAJ: {Charger_Version_Hardware_MAJ || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Software_MAJ: {Charger_Version_Software_MAJ || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Hardware_MIN: {Charger_Version_Hardware_MIN !== null ? Charger_Version_Hardware_MIN : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Software_MIN: {Charger_Version_Software_MIN !== null ? Charger_Version_Software_MIN : "N/A"}
        </Text>
      </ScrollView>
      <View style={styles.fixedButtonContainer}>
        <Button
          title="PUSH Vehicle data along with vehicle number and tester name"
          onPress={pushVehicleData}
          disabled={
            !(
              firebaseData &&
              mismatchMessage === "All parameters match." &&
              allBLEDataAvailable
            )
          }
        />
      </View>

      {/* Firebase Data Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Firebase Data</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {firebaseData ? (
                <>
                  <Text style={styles.parameterText}>
                    Cluster_Software_Version: {firebaseData.Cluster_Software_Version || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Cluster_Hardware_Version: {firebaseData.Cluster_Hardware_Version || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    MCU_Version_Firmware_Id: {firebaseData.MCU_Version_Firmware_Id || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_ConfigVer: {firebaseData.Battery_Version_ConfigVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_InternalFWVer: {firebaseData.Battery_Version_InternalFWVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_InternalFWSubVer: {firebaseData.Battery_Version_InternalFWSubVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_HwVer: {firebaseData.Battery_Version_HwVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_FwVer: {firebaseData.Battery_Version_FwVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_FWSubVer: {firebaseData.Battery_Version_FWSubVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Hardware_MAJ: {firebaseData.Charger_Version_Hardware_MAJ || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Software_MAJ: {firebaseData.Charger_Version_Software_MAJ || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Hardware_MIN: {firebaseData.Charger_Version_Hardware_MIN || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Software_MIN: {firebaseData.Charger_Version_Software_MIN || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Timestamp: {firebaseData.timestamp || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    {mismatchMessage}
                  </Text>
                </>
              ) : (
                <Text style={styles.parameterText}>No Firebase data available.</Text>
              )}
            </ScrollView>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
  },
  radioButtonSelected: {
    backgroundColor: "#ddd",
    borderColor: "#333",
  },
  radioText: {
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginRight: 8,
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
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default PDIEOL;
