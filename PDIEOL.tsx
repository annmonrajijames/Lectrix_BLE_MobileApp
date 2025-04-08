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

  // BLE Data States (decoded from BLE notifications)
  const [Cluster_Version_SW_MAJDecoder, setCluster_Version_SW_MAJDecoder] = useState<number | null>(null);
  const [Cluster_Version_SW_MINDecoder, setCluster_Version_SW_MINDecoder] = useState<number | null>(null);
  const [Cluster_Version_HW_MAJDecoder, setCluster_Version_HW_MAJDecoder] = useState<number | null>(null);
  const [Cluster_Version_HW_MINDecoder, setCluster_Version_HW_MINDecoder] = useState<number | null>(null);
  const [MCU_Version_Firmware_IdDecoder, setMCU_Version_Firmware_IdDecoder] = useState<string | null>(null);

  // Additional BLE Decoded Parameters
  const [Battery_Version_ConfigVerDecoder, setBattery_Version_ConfigVerDecoder] = useState<string | null>(null);
  const [Battery_Version_InternalFWVerDecoder, setBattery_Version_InternalFWVerDecoder] = useState<string | null>(null);
  const [Battery_Version_InternalFWSubVerDecoder, setBattery_Version_InternalFWSubVerDecoder] = useState<string | null>(null);
  const [Battery_Version_HwVerDecoder, setBattery_Version_HwVerDecoder] = useState<string | null>(null);
  const [Battery_Version_FwVerDecoder, setBattery_Version_FwVerDecoder] = useState<string | null>(null);
  const [Battery_Version_FWSubVerDecoder, setBattery_Version_FWSubVerDecoder] = useState<string | null>(null);

  // Charger parameters
  const [Charger_Version_Hardware_MAJDecoder, setCharger_Version_Hardware_MAJDecoder] = useState<string | null>(null);
  const [Charger_Version_Software_MAJDecoder, setCharger_Version_Software_MAJDecoder] = useState<string | null>(null);
  // New parameters added for MIN versions
  const [Charger_Version_Hardware_MINDecoder, setCharger_Version_Hardware_MINDecoder] = useState<number | null>(null);
  const [Charger_Version_Software_MINDecoder, setCharger_Version_Software_MINDecoder] = useState<number | null>(null);

  // Firebase Data State (contains the pushed document)
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [mismatchMessage, setMismatchMessage] = useState<string>("");

  // Modal visibility state for Firebase Data pop-up
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // New state to store the parameter group selection
  // Options: "all", "withoutCharger", "onlyCharger"
  const [selectedDataOption, setSelectedDataOption] = useState<string>("all");

  const serviceUUID = "00FF";
  const characteristicUUID = "FF01";

  // Decodes selected bytes to a number.
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

  // Decodes selected bytes to an ASCII string.
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

  // Automatically fetch Firebase data when the component mounts.
  useEffect(() => {
    fetchFirebaseData();
  }, []);

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
              if (
                error.message &&
                error.message.includes("Operation was cancelled")
              ) {
                return;
              }
              Alert.alert("Subscription Error", error.message);
              return;
            }
            if (characteristic?.value) {
              const data = Buffer.from(
                characteristic.value,
                "base64"
              ).toString("hex");
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

  // Update mismatch check based on the selected parameter group
  useEffect(() => {
    if (firebaseData) {
      const mismatches: string[] = [];
      // Flags to determine which set of parameters to check
      const checkNonCharger = selectedDataOption !== "onlyCharger";
      const checkCharger = selectedDataOption !== "withoutCharger";

      if (checkNonCharger) {
        // Check primary parameters
        if (
          firebaseData.Cluster_Version_SW_MAJDecoder !== undefined &&
          Cluster_Version_SW_MAJDecoder !== null &&
          Number(firebaseData.Cluster_Version_SW_MAJDecoder) !== Cluster_Version_SW_MAJDecoder
        ) {
          mismatches.push("Cluster_Version_SW_MAJ");
        }
        if (
          firebaseData.Cluster_Version_SW_MINDecoder !== undefined &&
          Cluster_Version_SW_MINDecoder !== null &&
          Number(firebaseData.Cluster_Version_SW_MINDecoder) !== Cluster_Version_SW_MINDecoder
        ) {
          mismatches.push("Cluster_Version_SW_MIN");
        }
        if (
          firebaseData.Cluster_Version_HW_MAJDecoder !== undefined &&
          Cluster_Version_HW_MAJDecoder !== null &&
          Number(firebaseData.Cluster_Version_HW_MAJDecoder) !== Cluster_Version_HW_MAJDecoder
        ) {
          mismatches.push("Cluster_Version_HW_MAJ");
        }
        if (
          firebaseData.Cluster_Version_HW_MINDecoder !== undefined &&
          Cluster_Version_HW_MINDecoder !== null &&
          Number(firebaseData.Cluster_Version_HW_MINDecoder) !== Cluster_Version_HW_MINDecoder
        ) {
          mismatches.push("Cluster_Version_HW_MIN");
        }
        if (
          firebaseData.MCU_Version_Firmware_Id !== undefined &&
          MCU_Version_Firmware_IdDecoder !== null &&
          firebaseData.MCU_Version_Firmware_Id !== MCU_Version_Firmware_IdDecoder
        ) {
          mismatches.push("MCU_Version_Firmware_Id");
        }
  
        const fbBattery_Version_ConfigVer =
          firebaseData.Battery_Version_ConfigVerDecoder !== undefined
            ? firebaseData.Battery_Version_ConfigVerDecoder
            : firebaseData.Battery_Version_ConfigVer;
        if (
          fbBattery_Version_ConfigVer !== undefined &&
          fbBattery_Version_ConfigVer !== null &&
          Battery_Version_ConfigVerDecoder !== null &&
          fbBattery_Version_ConfigVer !== Battery_Version_ConfigVerDecoder
        ) {
          mismatches.push("Battery_Version_ConfigVer");
        }
  
        const fbBattery_Version_InternalFWVer =
          firebaseData.Battery_Version_InternalFWVerDecoder !== undefined
            ? firebaseData.Battery_Version_InternalFWVerDecoder
            : firebaseData.Battery_Version_InternalFWVer;
        if (
          fbBattery_Version_InternalFWVer !== undefined &&
          fbBattery_Version_InternalFWVer !== null &&
          Battery_Version_InternalFWVerDecoder !== null &&
          fbBattery_Version_InternalFWVer !== Battery_Version_InternalFWVerDecoder
        ) {
          mismatches.push("Battery_Version_InternalFWVer");
        }
  
        const fbBattery_Version_InternalFWSubVer =
          firebaseData.Battery_Version_InternalFWSubVerDecoder !== undefined
            ? firebaseData.Battery_Version_InternalFWSubVerDecoder
            : firebaseData.Battery_Version_InternalFWSubVer;
        if (
          fbBattery_Version_InternalFWSubVer !== undefined &&
          fbBattery_Version_InternalFWSubVer !== null &&
          Battery_Version_InternalFWSubVerDecoder !== null &&
          fbBattery_Version_InternalFWSubVer !== Battery_Version_InternalFWSubVerDecoder
        ) {
          mismatches.push("Battery_Version_InternalFWSubVer");
        }
  
        const fbBattery_Version_HwVer =
          firebaseData.Battery_Version_HwVerDecoder !== undefined
            ? firebaseData.Battery_Version_HwVerDecoder
            : firebaseData.Battery_Version_HwVer;
        if (
          fbBattery_Version_HwVer !== undefined &&
          fbBattery_Version_HwVer !== null &&
          Battery_Version_HwVerDecoder !== null &&
          fbBattery_Version_HwVer !== Battery_Version_HwVerDecoder
        ) {
          mismatches.push("Battery_Version_HwVer");
        }
  
        const fbBattery_Version_FwVer =
          firebaseData.Battery_Version_FwVerDecoder !== undefined
            ? firebaseData.Battery_Version_FwVerDecoder
            : firebaseData.Battery_Version_FwVer;
        if (
          fbBattery_Version_FwVer !== undefined &&
          fbBattery_Version_FwVer !== null &&
          Battery_Version_FwVerDecoder !== null &&
          fbBattery_Version_FwVer !== Battery_Version_FwVerDecoder
        ) {
          mismatches.push("Battery_Version_FwVer");
        }
  
        const fbBattery_Version_FWSubVer =
          firebaseData.Battery_Version_FWSubVerDecoder !== undefined
            ? firebaseData.Battery_Version_FWSubVerDecoder
            : firebaseData.Battery_Version_FWSubVer;
        if (
          fbBattery_Version_FWSubVer !== undefined &&
          fbBattery_Version_FWSubVer !== null &&
          Battery_Version_FWSubVerDecoder !== null &&
          fbBattery_Version_FWSubVer !== Battery_Version_FWSubVerDecoder
        ) {
          mismatches.push("Battery_Version_FWSubVer");
        }
      }

      if (checkCharger) {
        // Check Charger parameters (MAJ and MIN)
        const fbChargerHardware =
          firebaseData.Charger_Version_Hardware_MAJDecoder !== undefined
            ? firebaseData.Charger_Version_Hardware_MAJDecoder
            : firebaseData.Charger_Version_Hardware_MAJ;
        if (
          fbChargerHardware !== undefined &&
          fbChargerHardware !== null &&
          Charger_Version_Hardware_MAJDecoder !== null &&
          fbChargerHardware !== Charger_Version_Hardware_MAJDecoder
        ) {
          mismatches.push("Charger_Version_Hardware_MAJ");
        }
  
        const fbChargerSoftware =
          firebaseData.Charger_Version_Software_MAJDecoder !== undefined
            ? firebaseData.Charger_Version_Software_MAJDecoder
            : firebaseData.Charger_Version_Software_MAJ;
        if (
          fbChargerSoftware !== undefined &&
          fbChargerSoftware !== null &&
          Charger_Version_Software_MAJDecoder !== null &&
          fbChargerSoftware !== Charger_Version_Software_MAJDecoder
        ) {
          mismatches.push("Charger_Version_Software_MAJ");
        }
  
        const fbChargerHardwareMIN =
          firebaseData.Charger_Version_Hardware_MINDecoder !== undefined
            ? firebaseData.Charger_Version_Hardware_MINDecoder
            : firebaseData.Charger_Version_Hardware_MIN;
        if (
          fbChargerHardwareMIN !== undefined &&
          fbChargerHardwareMIN !== null &&
          Charger_Version_Hardware_MINDecoder !== null &&
          Number(fbChargerHardwareMIN) !== Charger_Version_Hardware_MINDecoder
        ) {
          mismatches.push("Charger_Version_Hardware_MIN");
        }
      
        const fbChargerSoftwareMIN =
          firebaseData.Charger_Version_Software_MINDecoder !== undefined
            ? firebaseData.Charger_Version_Software_MINDecoder
            : firebaseData.Charger_Version_Software_MIN;
        if (
          fbChargerSoftwareMIN !== undefined &&
          fbChargerSoftwareMIN !== null &&
          Charger_Version_Software_MINDecoder !== null &&
          Number(fbChargerSoftwareMIN) !== Charger_Version_Software_MINDecoder
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
    Cluster_Version_SW_MAJDecoder,
    Cluster_Version_SW_MINDecoder,
    Cluster_Version_HW_MAJDecoder,
    Cluster_Version_HW_MINDecoder,
    MCU_Version_Firmware_IdDecoder,
    Battery_Version_ConfigVerDecoder,
    Battery_Version_InternalFWVerDecoder,
    Battery_Version_InternalFWSubVerDecoder,
    Battery_Version_HwVerDecoder,
    Battery_Version_FwVerDecoder,
    Battery_Version_FWSubVerDecoder,
    Charger_Version_Hardware_MAJDecoder,
    Charger_Version_Software_MAJDecoder,
    Charger_Version_Hardware_MINDecoder,
    Charger_Version_Software_MINDecoder,
  ]);

  const decodeData = (data: string) => {
    // Decode numeric values
    const SW_MAJ = eight_bytes_decode("05", 1.0, 9)(data);
    const SW_MIN = eight_bytes_decode("05", 1.0, 10)(data);
    const HW_MAJ = eight_bytes_decode("05", 1.0, 11)(data);
    const HW_MIN = eight_bytes_decode("05", 1.0, 12)(data);
    const MCU_Version_Firmware_Id = eight_bytes_ascii_decode("04", 15, 14, 13, 12, 11, 10, 9, 8)(data);

    // Decode additional parameters
    const battery_Version_ConfigVer = eight_bytes_ascii_decode("14", 2, 3, 4)(data);
    const battery_Version_InternalFWVer = eight_bytes_ascii_decode("14", 5, 6, 7)(data);
    const battery_Version_InternalFWSubVer = eight_bytes_ascii_decode("14", 8, 9)(data);
    const battery_Version_HwVer = eight_bytes_ascii_decode("06", 10, 11, 12)(data);
    const battery_Version_FwVer = eight_bytes_ascii_decode("06", 13, 14, 15)(data);
    const battery_Version_FWSubVer = eight_bytes_ascii_decode("06", 16, 17)(data);

    // Decode Charger parameters (MAJ and MIN)
    const chargerHardwareVersionMAJ = eight_bytes_ascii_decode("20", 1)(data);
    const chargerSoftwareVersionMAJ = eight_bytes_ascii_decode("20", 3)(data);
    const chargerHardwareVersionMIN = eight_bytes_decode("20", 1.0, 2)(data);
    const chargerSoftwareVersionMIN = eight_bytes_decode("20", 1.0, 4)(data);

    if (MCU_Version_Firmware_Id !== null) setMCU_Version_Firmware_IdDecoder(MCU_Version_Firmware_Id);
    if (SW_MAJ !== null) setCluster_Version_SW_MAJDecoder(SW_MAJ);
    if (SW_MIN !== null) setCluster_Version_SW_MINDecoder(SW_MIN);
    if (HW_MAJ !== null) setCluster_Version_HW_MAJDecoder(HW_MAJ);
    if (HW_MIN !== null) setCluster_Version_HW_MINDecoder(HW_MIN);

    if (battery_Version_ConfigVer !== null) setBattery_Version_ConfigVerDecoder(battery_Version_ConfigVer);
    if (battery_Version_InternalFWVer !== null) setBattery_Version_InternalFWVerDecoder(battery_Version_InternalFWVer);
    if (battery_Version_InternalFWSubVer !== null) setBattery_Version_InternalFWSubVerDecoder(battery_Version_InternalFWSubVer);
    if (battery_Version_HwVer !== null) setBattery_Version_HwVerDecoder(battery_Version_HwVer);
    if (battery_Version_FwVer !== null) setBattery_Version_FwVerDecoder(battery_Version_FwVer);
    if (battery_Version_FWSubVer !== null) setBattery_Version_FWSubVerDecoder(battery_Version_FWSubVer);

    if (chargerHardwareVersionMAJ !== null) setCharger_Version_Hardware_MAJDecoder(chargerHardwareVersionMAJ);
    if (chargerSoftwareVersionMAJ !== null) setCharger_Version_Software_MAJDecoder(chargerSoftwareVersionMAJ);
    if (chargerHardwareVersionMIN !== null) setCharger_Version_Hardware_MINDecoder(chargerHardwareVersionMIN);
    if (chargerSoftwareVersionMIN !== null) setCharger_Version_Software_MINDecoder(chargerSoftwareVersionMIN);
  };

  // Compute the required BLE data based on the selected option
  let allBLEDataAvailable;
  if (selectedDataOption === "all") {
    allBLEDataAvailable =
      Cluster_Version_SW_MAJDecoder !== null &&
      Cluster_Version_SW_MINDecoder !== null &&
      Cluster_Version_HW_MAJDecoder !== null &&
      Cluster_Version_HW_MINDecoder !== null &&
      MCU_Version_Firmware_IdDecoder !== null &&
      Battery_Version_ConfigVerDecoder !== null &&
      Battery_Version_InternalFWVerDecoder !== null &&
      Battery_Version_InternalFWSubVerDecoder !== null &&
      Battery_Version_HwVerDecoder !== null &&
      Battery_Version_FwVerDecoder !== null &&
      Battery_Version_FWSubVerDecoder !== null &&
      Charger_Version_Hardware_MAJDecoder !== null &&
      Charger_Version_Software_MAJDecoder !== null &&
      Charger_Version_Hardware_MINDecoder !== null &&
      Charger_Version_Software_MINDecoder !== null;
  } else if (selectedDataOption === "withoutCharger") {
    allBLEDataAvailable =
      Cluster_Version_SW_MAJDecoder !== null &&
      Cluster_Version_SW_MINDecoder !== null &&
      Cluster_Version_HW_MAJDecoder !== null &&
      Cluster_Version_HW_MINDecoder !== null &&
      MCU_Version_Firmware_IdDecoder !== null &&
      Battery_Version_ConfigVerDecoder !== null &&
      Battery_Version_InternalFWVerDecoder !== null &&
      Battery_Version_InternalFWSubVerDecoder !== null &&
      Battery_Version_HwVerDecoder !== null &&
      Battery_Version_FwVerDecoder !== null &&
      Battery_Version_FWSubVerDecoder !== null;
  } else if (selectedDataOption === "onlyCharger") {
    allBLEDataAvailable =
      Charger_Version_Hardware_MAJDecoder !== null &&
      Charger_Version_Software_MAJDecoder !== null &&
      Charger_Version_Hardware_MINDecoder !== null &&
      Charger_Version_Software_MINDecoder !== null;
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
  
    // Determine the Data_choice value based on the selected option
    let dataChoice = "";
    if (selectedDataOption === "all") {
      dataChoice = "All Vehicle Data";
    } else if (selectedDataOption === "withoutCharger") {
      dataChoice = "Without Charger";
    } else if (selectedDataOption === "onlyCharger") {
      dataChoice = "Only Charger";
    }
  
    // When pushing data, store the BLE-decoded values under keys that include "Decoder"
    const docRef = doc(db, "Matched Vehicle", vehicleNumber);
    try {
      await setDoc(docRef, {
        vehicleNumber,
        testerName,
        Cluster_Version_SW_MAJDecoder,
        Cluster_Version_SW_MINDecoder,
        Cluster_Version_HW_MAJDecoder,
        Cluster_Version_HW_MINDecoder,
        MCU_Version_Firmware_Id: MCU_Version_Firmware_IdDecoder,
        Battery_Version_ConfigVerDecoder,
        Battery_Version_InternalFWVerDecoder,
        Battery_Version_InternalFWSubVerDecoder,
        Battery_Version_HwVerDecoder,
        Battery_Version_FwVerDecoder,
        Battery_Version_FWSubVerDecoder,
        Charger_Version_Hardware_MAJDecoder,
        Charger_Version_Software_MAJDecoder,
        Charger_Version_Hardware_MINDecoder,
        Charger_Version_Software_MINDecoder,
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
              selectedDataOption === "all" && styles.radioButtonSelected,
            ]}
            onPress={() => setSelectedDataOption("all")}
          >
            <Text style={styles.radioText}>All Vehicle Data</Text>
          </TouchableOpacity>
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
              selectedDataOption === "onlyCharger" && styles.radioButtonSelected,
            ]}
            onPress={() => setSelectedDataOption("onlyCharger")}
          >
            <Text style={styles.radioText}>Only Charger</Text>
          </TouchableOpacity>
        </View>

        {/* Info Button Section Above the "Vehicle data" Label */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Press to see Version number set by admin</Text>
          <Button title="ℹ️" onPress={() => setModalVisible(true)} />
        </View>

        {/* Vehicle Data Header */}
        <Text style={styles.header}>Vehicle data</Text>
        <Text style={styles.parameterText}>
          Cluster_Version_SW_MAJ:{" "}
          {Cluster_Version_SW_MAJDecoder !== null ? Cluster_Version_SW_MAJDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Cluster_Version_SW_MIN:{" "}
          {Cluster_Version_SW_MINDecoder !== null ? Cluster_Version_SW_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Cluster_Version_HW_MAJ:{" "}
          {Cluster_Version_HW_MAJDecoder !== null ? Cluster_Version_HW_MAJDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Cluster_Version_HW_MIN:{" "}
          {Cluster_Version_HW_MINDecoder !== null ? Cluster_Version_HW_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          MCU_Version_Firmware_Id:{" "}
          {MCU_Version_Firmware_IdDecoder !== null ? MCU_Version_Firmware_IdDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_ConfigVer: {Battery_Version_ConfigVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_InternalFWVer: {Battery_Version_InternalFWVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_InternalFWSubVer: {Battery_Version_InternalFWSubVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_HwVer: {Battery_Version_HwVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_FwVer: {Battery_Version_FwVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Battery_Version_FWSubVer: {Battery_Version_FWSubVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Hardware_MAJ:{" "}
          {Charger_Version_Hardware_MAJDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Software_MAJ:{" "}
          {Charger_Version_Software_MAJDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Hardware_MIN:{" "}
          {Charger_Version_Hardware_MINDecoder !== null ? Charger_Version_Hardware_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger_Version_Software_MIN:{" "}
          {Charger_Version_Software_MINDecoder !== null ? Charger_Version_Software_MINDecoder : "N/A"}
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
                    Cluster_Version_SW_MAJ: {firebaseData.Cluster_Version_SW_MAJDecoder || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Cluster_Version_SW_MIN: {firebaseData.Cluster_Version_SW_MINDecoder || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Cluster_Version_HW_MAJ: {firebaseData.Cluster_Version_HW_MAJDecoder || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Cluster_Version_HW_MIN: {firebaseData.Cluster_Version_HW_MINDecoder || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    MCU_Version_Firmware_Id: {firebaseData.MCU_Version_Firmware_Id || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_ConfigVer: {firebaseData.Battery_Version_ConfigVerDecoder || firebaseData.Battery_Version_ConfigVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_InternalFWVer: {firebaseData.Battery_Version_InternalFWVerDecoder || firebaseData.Battery_Version_InternalFWVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_InternalFWSubVer: {firebaseData.Battery_Version_InternalFWSubVerDecoder || firebaseData.Battery_Version_InternalFWSubVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_HwVer: {firebaseData.Battery_Version_HwVerDecoder || firebaseData.Battery_Version_HwVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_FwVer: {firebaseData.Battery_Version_FwVerDecoder || firebaseData.Battery_Version_FwVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Battery_Version_FWSubVer: {firebaseData.Battery_Version_FWSubVerDecoder || firebaseData.Battery_Version_FWSubVer || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Hardware_MAJ: {firebaseData.Charger_Version_Hardware_MAJDecoder || firebaseData.Charger_Version_Hardware_MAJ || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Software_MAJ: {firebaseData.Charger_Version_Software_MAJDecoder || firebaseData.Charger_Version_Software_MAJ || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Hardware_MIN: {firebaseData.Charger_Version_Hardware_MINDecoder || firebaseData.Charger_Version_Hardware_MIN || "N/A"}
                  </Text>
                  <Text style={styles.parameterText}>
                    Charger_Version_Software_MIN: {firebaseData.Charger_Version_Software_MINDecoder || firebaseData.Charger_Version_Software_MIN || "N/A"}
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
