import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';

type BluetoothContextType = {
  manager: BleManager;
  connectedDevice: Device | null;
  connectDevice: (device: Device) => Promise<void>;
  disconnectDevice: () => void;
};

type BluetoothProviderProps = {
  children: ReactNode;
};

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<BluetoothProviderProps> = ({ children }) => {
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // Handle device disconnection
  useEffect(() => {
    const handleDisconnected = (device: Device) => {
      console.log(`Device ${device.id} disconnected`);
      setConnectedDevice(null); // Reset connected device state
    };

    if (connectedDevice) {
      connectedDevice.onDisconnected(handleDisconnected);
    }

    // Cleanup listener when component unmounts or device changes
    return () => {
      if (connectedDevice) {
        connectedDevice.removeListener('disconnected', handleDisconnected);
      }
    };
  }, [connectedDevice]);

  // Connect to a device
  const connectDevice = async (device: Device) => {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device); // Set the device as connected
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  // Disconnect from a device
  const disconnectDevice = () => {
    if (connectedDevice) {
      connectedDevice.disconnect();
      setConnectedDevice(null); // Reset connected device state
    }
  };

  return (
    <BluetoothContext.Provider value={{ manager, connectedDevice, connectDevice, disconnectDevice }}>
      {children}
    </BluetoothContext.Provider>
  );
};

// Custom hook to use Bluetooth context
export const useBluetooth = (): BluetoothContextType => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};
