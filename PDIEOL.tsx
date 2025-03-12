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
import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

type RootStackParamList = {
  PDIEOL: { device: Device };
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

const PDIEOL: React.FC<PDIEOLProps> = ({ route }) => {
  const { device } = route.params;

  // Entry Box States
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [testerName, setTesterName] = useState<string>("");

  // BLE Data States (decoded from BLE notifications)
  const [SW_Version_MAJDecoder, setSW_Version_MAJDecoder] = useState<number | null>(null);
  const [SW_Version_MINDecoder, setSW_Version_MINDecoder] = useState<number | null>(null);
  const [HW_Version_MAJDecoder, setHW_Version_MAJDecoder] = useState<number | null>(null);
  const [HW_Version_MINDecoder, setHW_Version_MINDecoder] = useState<number | null>(null);
  const [MCU_Firmware_IdDecoder, setMCU_Firmware_IdDecoder] = useState<string | null>(null);

  // Additional BLE Decoded Parameters
  const [ConfigVerDecoder, setConfigVerDecoder] = useState<string | null>(null);
  const [InternalFWVerDecoder, setInternalFWVerDecoder] = useState<string | null>(null);
  const [InternalFWSubVerDecoder, setInternalFWSubVerDecoder] = useState<string | null>(null);
  const [HwVerDecoder, setHwVerDecoder] = useState<string | null>(null);
  const [FwVerDecoder, setFwVerDecoder] = useState<string | null>(null);
  const [FWSubVerDecoder, setFWSubVerDecoder] = useState<string | null>(null);

  // Charger parameters
  const [Charger_Hardware_Version_MAJDecoder, setCharger_Hardware_Version_MAJDecoder] = useState<string | null>(null);
  const [Charger_Software_Version_MAJDecoder, setCharger_Software_Version_MAJDecoder] = useState<string | null>(null);
  // New parameters added for MIN versions
  const [Charger_Hardware_Version_MINDecoder, setCharger_Hardware_Version_MINDecoder] = useState<number | null>(null);
  const [Charger_Software_Version_MINDecoder, setCharger_Software_Version_MINDecoder] = useState<number | null>(null);

  // Firebase Data State (contains the pushed document)
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [mismatchMessage, setMismatchMessage] = useState<string>("");

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

  useEffect(() => {
    if (firebaseData) {
      const mismatches: string[] = [];

      // Check primary parameters (using Firebase's Decoder keys)
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
      if (
        firebaseData.MCU_Firmware_Id !== undefined &&
        MCU_Firmware_IdDecoder !== null &&
        firebaseData.MCU_Firmware_Id !== MCU_Firmware_IdDecoder
      ) {
        mismatches.push("MCU_Firmware_Id");
      }

      // Check additional parameters
      const fbConfigVer =
        firebaseData.ConfigVerDecoder !== undefined
          ? firebaseData.ConfigVerDecoder
          : firebaseData.ConfigVer;
      if (
        fbConfigVer !== undefined &&
        fbConfigVer !== null &&
        ConfigVerDecoder !== null &&
        fbConfigVer !== ConfigVerDecoder
      ) {
        mismatches.push("ConfigVer");
      }

      const fbInternalFWVer =
        firebaseData.InternalFWVerDecoder !== undefined
          ? firebaseData.InternalFWVerDecoder
          : firebaseData.InternalFWVer;
      if (
        fbInternalFWVer !== undefined &&
        fbInternalFWVer !== null &&
        InternalFWVerDecoder !== null &&
        fbInternalFWVer !== InternalFWVerDecoder
      ) {
        mismatches.push("InternalFWVer");
      }

      const fbInternalFWSubVer =
        firebaseData.InternalFWSubVerDecoder !== undefined
          ? firebaseData.InternalFWSubVerDecoder
          : firebaseData.InternalFWSubVer;
      if (
        fbInternalFWSubVer !== undefined &&
        fbInternalFWSubVer !== null &&
        InternalFWSubVerDecoder !== null &&
        fbInternalFWSubVer !== InternalFWSubVerDecoder
      ) {
        mismatches.push("InternalFWSubVer");
      }

      const fbHwVer =
        firebaseData.HwVerDecoder !== undefined
          ? firebaseData.HwVerDecoder
          : firebaseData.HwVer;
      if (
        fbHwVer !== undefined &&
        fbHwVer !== null &&
        HwVerDecoder !== null &&
        fbHwVer !== HwVerDecoder
      ) {
        mismatches.push("HwVer");
      }

      const fbFwVer =
        firebaseData.FwVerDecoder !== undefined
          ? firebaseData.FwVerDecoder
          : firebaseData.FwVer;
      if (
        fbFwVer !== undefined &&
        fbFwVer !== null &&
        FwVerDecoder !== null &&
        fbFwVer !== FwVerDecoder
      ) {
        mismatches.push("FwVer");
      }

      const fbFWSubVer =
        firebaseData.FWSubVerDecoder !== undefined
          ? firebaseData.FWSubVerDecoder
          : firebaseData.FWSubVer;
      if (
        fbFWSubVer !== undefined &&
        fbFWSubVer !== null &&
        FWSubVerDecoder !== null &&
        fbFWSubVer !== FWSubVerDecoder
      ) {
        mismatches.push("FWSubVer");
      }

      // Check Charger parameters (MAJ)
      const fbChargerHardware =
        firebaseData.Charger_Hardware_Version_MAJDecoder !== undefined
          ? firebaseData.Charger_Hardware_Version_MAJDecoder
          : firebaseData.Charger_Hardware_Version_MAJ;
      if (
        fbChargerHardware !== undefined &&
        fbChargerHardware !== null &&
        Charger_Hardware_Version_MAJDecoder !== null &&
        fbChargerHardware !== Charger_Hardware_Version_MAJDecoder
      ) {
        mismatches.push("Charger_Hardware_Version_MAJ");
      }

      const fbChargerSoftware =
        firebaseData.Charger_Software_Version_MAJDecoder !== undefined
          ? firebaseData.Charger_Software_Version_MAJDecoder
          : firebaseData.Charger_Software_Version_MAJ;
      if (
        fbChargerSoftware !== undefined &&
        fbChargerSoftware !== null &&
        Charger_Software_Version_MAJDecoder !== null &&
        fbChargerSoftware !== Charger_Software_Version_MAJDecoder
      ) {
        mismatches.push("Charger_Software_Version_MAJ");
      }

      const fbChargerHardwareMIN =
      firebaseData.Charger_Hardware_Version_MINDecoder !== undefined
        ? firebaseData.Charger_Hardware_Version_MINDecoder
        : firebaseData.Charger_Hardware_Version_MIN;
    if (
      fbChargerHardwareMIN !== undefined &&
      fbChargerHardwareMIN !== null &&
      Charger_Hardware_Version_MINDecoder !== null &&
      Number(fbChargerHardwareMIN) !== Charger_Hardware_Version_MINDecoder
    ) {
      mismatches.push("Charger_Hardware_Version_MIN");
    }
    
    const fbChargerSoftwareMIN =
      firebaseData.Charger_Software_Version_MINDecoder !== undefined
        ? firebaseData.Charger_Software_Version_MINDecoder
        : firebaseData.Charger_Software_Version_MIN;
    if (
      fbChargerSoftwareMIN !== undefined &&
      fbChargerSoftwareMIN !== null &&
      Charger_Software_Version_MINDecoder !== null &&
      Number(fbChargerSoftwareMIN) !== Charger_Software_Version_MINDecoder
    ) {
      mismatches.push("Charger_Software_Version_MIN");
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
    MCU_Firmware_IdDecoder,
    ConfigVerDecoder,
    InternalFWVerDecoder,
    InternalFWSubVerDecoder,
    HwVerDecoder,
    FwVerDecoder,
    FWSubVerDecoder,
    Charger_Hardware_Version_MAJDecoder,
    Charger_Software_Version_MAJDecoder,
    Charger_Hardware_Version_MINDecoder,
    Charger_Software_Version_MINDecoder,
  ]);

  const decodeData = (data: string) => {
    // Decode numeric values
    const SW_MAJ = eight_bytes_decode("05", 1.0, 9)(data);
    const SW_MIN = eight_bytes_decode("05", 1.0, 10)(data);
    const HW_MAJ = eight_bytes_decode("05", 1.0, 11)(data);
    const HW_MIN = eight_bytes_decode("05", 1.0, 12)(data);
    const MCU_Firmware_Id = eight_bytes_ascii_decode("04", 15, 14, 13, 12, 11, 10, 9, 8)(data);

    // Decode additional parameters
    const configVer = eight_bytes_ascii_decode("14", 2, 3, 4)(data);
    const internalFWVer = eight_bytes_ascii_decode("14", 5, 6, 7)(data);
    const internalFWSubVer = eight_bytes_ascii_decode("14", 8, 9)(data);
    const hwVer = eight_bytes_ascii_decode("06", 10, 11, 12)(data);
    const fwVer = eight_bytes_ascii_decode("06", 13, 14, 15)(data);
    const fwSubVer = eight_bytes_ascii_decode("06", 16, 17)(data);

    // Decode Charger parameters (MAJ and MIN)
    const chargerHardwareVersionMAJ = eight_bytes_ascii_decode("20", 1)(data);
    const chargerSoftwareVersionMAJ = eight_bytes_ascii_decode("20", 3)(data);
    const chargerHardwareVersionMIN = eight_bytes_decode("20", 1.0, 2)(data);
    const chargerSoftwareVersionMIN = eight_bytes_decode("20", 1.0, 4)(data);

    if (MCU_Firmware_Id !== null) setMCU_Firmware_IdDecoder(MCU_Firmware_Id);
    if (SW_MAJ !== null) setSW_Version_MAJDecoder(SW_MAJ);
    if (SW_MIN !== null) setSW_Version_MINDecoder(SW_MIN);
    if (HW_MAJ !== null) setHW_Version_MAJDecoder(HW_MAJ);
    if (HW_MIN !== null) setHW_Version_MINDecoder(HW_MIN);

    if (configVer !== null) setConfigVerDecoder(configVer);
    if (internalFWVer !== null) setInternalFWVerDecoder(internalFWVer);
    if (internalFWSubVer !== null) setInternalFWSubVerDecoder(internalFWSubVer);
    if (hwVer !== null) setHwVerDecoder(hwVer);
    if (fwVer !== null) setFwVerDecoder(fwVer);
    if (fwSubVer !== null) setFWSubVerDecoder(fwSubVer);

    if (chargerHardwareVersionMAJ !== null) setCharger_Hardware_Version_MAJDecoder(chargerHardwareVersionMAJ);
    if (chargerSoftwareVersionMAJ !== null) setCharger_Software_Version_MAJDecoder(chargerSoftwareVersionMAJ);
    if (chargerHardwareVersionMIN !== null) setCharger_Hardware_Version_MINDecoder(chargerHardwareVersionMIN);
    if (chargerSoftwareVersionMIN !== null) setCharger_Software_Version_MINDecoder(chargerSoftwareVersionMIN);
  };

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

    // When pushing data, store the BLE-decoded values under keys that include "Decoder"
    const docRef = doc(db, "Matched Vehicle", vehicleNumber);
    try {
      await setDoc(docRef, {
        vehicleNumber,
        testerName,
        SW_Version_MAJDecoder,
        SW_Version_MINDecoder,
        HW_Version_MAJDecoder,
        HW_Version_MINDecoder,
        MCU_Firmware_Id: MCU_Firmware_IdDecoder,
        ConfigVerDecoder,
        InternalFWVerDecoder,
        InternalFWSubVerDecoder,
        HwVerDecoder,
        FwVerDecoder,
        FWSubVerDecoder,
        Charger_Hardware_Version_MAJDecoder,
        Charger_Software_Version_MAJDecoder,
        Charger_Hardware_Version_MINDecoder,
        Charger_Software_Version_MINDecoder,
        Admin_timestamp: adminTimestamp,
        Tester_timestamp: testerTimestamp,
      });
      Alert.alert("Success", "Vehicle data pushed successfully!");
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

        {/* BLE Data Section */}
        <Text style={styles.header}>BLE Data</Text>
        <Text style={styles.parameterText}>
          SW_Version_MAJ:{" "}
          {SW_Version_MAJDecoder !== null ? SW_Version_MAJDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          SW_Version_MIN:{" "}
          {SW_Version_MINDecoder !== null ? SW_Version_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          HW_Version_MAJ:{" "}
          {HW_Version_MAJDecoder !== null ? HW_Version_MAJDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          HW_Version_MIN:{" "}
          {HW_Version_MINDecoder !== null ? HW_Version_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          MCU Firmware Id:{" "}
          {MCU_Firmware_IdDecoder !== null ? MCU_Firmware_IdDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Config Version: {ConfigVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Internal FW Version: {InternalFWVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Internal FW Sub Version: {InternalFWSubVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          HW Version: {HwVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          FW Version: {FwVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          FW Sub Version: {FWSubVerDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger Hardware Version MAJ:{" "}
          {Charger_Hardware_Version_MAJDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger Software Version MAJ:{" "}
          {Charger_Software_Version_MAJDecoder || "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger Hardware Version MIN:{" "}
          {Charger_Hardware_Version_MINDecoder !== null ? Charger_Hardware_Version_MINDecoder : "N/A"}
        </Text>
        <Text style={styles.parameterText}>
          Charger Software Version MIN:{" "}
          {Charger_Software_Version_MINDecoder !== null ? Charger_Software_Version_MINDecoder : "N/A"}
        </Text>

        {/* Firebase Data Section */}
        {firebaseData && (
          <View style={styles.firebaseContainer}>
            <Text style={styles.header}>Firebase Data</Text>
            <Text style={styles.parameterText}>
              SW_Version_MAJDecoder:{" "}
              {firebaseData.SW_Version_MAJDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              SW_Version_MINDecoder:{" "}
              {firebaseData.SW_Version_MINDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              HW_Version_MAJDecoder:{" "}
              {firebaseData.HW_Version_MAJDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              HW_Version_MINDecoder:{" "}
              {firebaseData.HW_Version_MINDecoder || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              MCU Firmware Id:{" "}
              {firebaseData.MCU_Firmware_Id || "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Config Version:{" "}
              {firebaseData.ConfigVerDecoder ||
                firebaseData.ConfigVer ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Internal FW Version:{" "}
              {firebaseData.InternalFWVerDecoder ||
                firebaseData.InternalFWVer ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Internal FW Sub Version:{" "}
              {firebaseData.InternalFWSubVerDecoder ||
                firebaseData.InternalFWSubVer ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              HW Version:{" "}
              {firebaseData.HwVerDecoder ||
                firebaseData.HwVer ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              FW Version:{" "}
              {firebaseData.FwVerDecoder ||
                firebaseData.FwVer ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              FW Sub Version:{" "}
              {firebaseData.FWSubVerDecoder ||
                firebaseData.FWSubVer ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Charger Hardware Version MAJ:{" "}
              {firebaseData.Charger_Hardware_Version_MAJDecoder ||
                firebaseData.Charger_Hardware_Version_MAJ ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Charger Software Version MAJ:{" "}
              {firebaseData.Charger_Software_Version_MAJDecoder ||
                firebaseData.Charger_Software_Version_MAJ ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Charger Hardware Version MIN:{" "}
              {firebaseData.Charger_Hardware_Version_MINDecoder ||
                firebaseData.Charger_Hardware_Version_MIN ||
                "N/A"}
            </Text>
            <Text style={styles.parameterText}>
              Charger Software Version MIN:{" "}
              {firebaseData.Charger_Software_Version_MINDecoder ||
                firebaseData.Charger_Software_Version_MIN ||
                "N/A"}
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
