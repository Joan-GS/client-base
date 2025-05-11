import { useState, useEffect, useCallback } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as DeviceExpo from "expo-device";

const SERVICE_UUID = "0000FFE0-0000-1000-8000-00805F9B34FB";
const CHARACTERISTIC_UUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

// Interface para el tipo Device mínimo necesario
interface SimpleDevice {
  id: string;
  name?: string;
}

// Implementación mock para web y cuando BLE no esté disponible
class BleManagerMock {
  isMock = true;
  startDeviceScan() { console.log("BLE not available"); }
  stopDeviceScan() {}
  connectToDevice(): Promise<SimpleDevice> { return Promise.resolve({ id: 'mock-device', name: 'Mock Device' }); }
  cancelDeviceConnection() { return Promise.resolve(); }
  discoverAllServicesAndCharacteristics() { return Promise.resolve(); }
  writeCharacteristicWithResponseForDevice() { return Promise.resolve(); }
  destroy() {}
}

const useBLE = () => {
  const isWeb = Platform.OS === "web";
  
  // Cargamos dinámicamente el BleManager solo si no estamos en web
  const [bleManager] = useState(() => {
    if (isWeb) {
      return new BleManagerMock();
    }
    
    try {
      const { BleManager } = require('react-native-ble-plx');
      return new BleManager();
    } catch (error) {
      console.warn("react-native-ble-plx not available, using mock");
      return new BleManagerMock();
    }
  });

  const [devices, setDevices] = useState<SimpleDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<SimpleDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    return () => {
      if (!isWeb && bleManager.destroy) {
        bleManager.destroy();
      }
    };
  }, [bleManager, isWeb]);

  const requestAndroid31Permissions = async () => {
    if (isWeb) return true;

    try {
      const bluetoothScanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
        }
      );
      
      const bluetoothConnectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
        }
      );
      
      const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
        }
      );

      return (
        bluetoothScanPermission === "granted" &&
        bluetoothConnectPermission === "granted" &&
        fineLocationPermission === "granted"
      );
    } catch (error) {
      console.error("Permission request error:", error);
      return false;
    }
  };

  const requestPermissions = async () => {
    if (isWeb) return true;
    
    if (Platform.OS === "android") {
      if ((DeviceExpo.platformApiLevel ?? -1) < 31) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "Bluetooth Low Energy requires Location",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.error("Permission request error:", error);
          return false;
        }
      } else {
        return await requestAndroid31Permissions();
      }
    }
    return true;
  };

  const scanDevices = useCallback(async () => {
    if (isWeb || bleManager.isMock) {
      console.log("BLE scanning not available");
      return;
    }

    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) throw new Error("Permissions not granted");

      setIsScanning(true);
      setDevices([]);

      bleManager.startDeviceScan(null, null, (error: any, device: SimpleDevice) => {
        if (error) {
          console.error("Scan error:", error);
          setIsScanning(false);
          return;
        }

        if (device?.name) {
          setDevices(prevDevices => {
            const deviceExists = prevDevices.some(d => d.id === device.id);
            return deviceExists ? prevDevices : [...prevDevices, device];
          });
        }
      });

      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to scan devices:", error);
      setIsScanning(false);
    }
  }, [isWeb, bleManager]);

  const connectToDevice = useCallback(async (device: SimpleDevice) => {
    if (isWeb || bleManager.isMock) {
      console.log("BLE connection not available");
      return null;
    }

    try {
      setIsConnecting(true);
      const deviceConnection = await bleManager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      setConnectedDevice(deviceConnection);
      return deviceConnection;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isWeb, bleManager]);

  const disconnectFromDevice = useCallback(async () => {
    if (isWeb || bleManager.isMock || !connectedDevice) return;

    try {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  }, [connectedDevice, isWeb, bleManager]);

  const sendData = useCallback(async (data: string) => {
    if (isWeb || bleManager.isMock) {
      console.log("BLE data sending not available");
      return false;
    }

    if (!connectedDevice) {
      throw new Error("No device connected");
    }

    try {
      setIsSending(true);
      const buffer = Buffer.from(data, "utf-8");
      const base64Value = buffer.toString("base64");

      await bleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Value
      );
      return true;
    } catch (error) {
      console.error("Failed to send data:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [connectedDevice, isWeb, bleManager]);

  return {
    scanDevices,
    connectToDevice,
    disconnectFromDevice,
    sendData,
    devices,
    connectedDevice,
    isScanning,
    isConnecting,
    isSending,
    isWeb: isWeb || bleManager.isMock,
  };
};

export default useBLE;