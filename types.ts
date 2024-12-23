import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
  Home: undefined;
  TransmitReceivePage: { device: Device };
  SOCTransmit: { device: Device };
  HIL_Receive_from_vehicle: { device: Device };
};

