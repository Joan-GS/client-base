import { useState, useEffect, useCallback } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as DeviceExpo from "expo-device";
import { Buffer } from 'buffer';

/**
 * BLE UUIDs specific to Aurora Boards
 * 
 * AURORA_ADVERTISING_UUID - Used to filter Aurora Boards during scanning
 * AURORA_SERVICE_UUID - Main service UUID for communication
 * AURORA_WRITE_CHARACTERISTIC_UUID - Characteristic for sending data to the board
 */
const AURORA_ADVERTISING_UUID = "4488B571-7806-4DF6-BCFF-A2897E4953FF";
const AURORA_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const AURORA_WRITE_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

/**
 * Minimal device interface for TypeScript typing
 */
interface SimpleDevice {
  id: string;
  name?: string;
  serviceUUIDs?: string[];
}

/**
 * Mock implementation for web and when BLE is not available
 */
class BleManagerMock {
  isMock = true;
  startDeviceScan() { console.log("BLE not available"); }
  stopDeviceScan() {}
  connectToDevice(): Promise<SimpleDevice> { 
    return Promise.resolve({ 
      id: 'mock-device', 
      name: 'Mock Aurora Board' 
    }); 
  }
  cancelDeviceConnection() { return Promise.resolve(); }
  discoverAllServicesAndCharacteristics() { return Promise.resolve(); }
  writeCharacteristicWithResponseForDevice() { return Promise.resolve(); }
  destroy() {}
}

/**
 * Custom hook for BLE communication with Aurora Boards
 */
const useBLE = () => {
  const isWeb = Platform.OS === "web";
  
  /**
   * Initialize BleManager (real implementation) or mock for web
   */
  const [bleManager] = useState(() => {
    if (isWeb) return new BleManagerMock();
    
    try {
      const { BleManager } = require('react-native-ble-plx');
      return new BleManager();
    } catch (error) {
      console.warn("react-native-ble-plx not available, using mock");
      return new BleManagerMock();
    }
  });

  // State management for BLE operations
  const [devices, setDevices] = useState<SimpleDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<SimpleDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!isWeb && bleManager.destroy) {
        bleManager.destroy();
      }
    };
  }, [bleManager, isWeb]);

  /**
   * Request Android 31+ permissions (BLUETOOTH_SCAN, BLUETOOTH_CONNECT, ACCESS_FINE_LOCATION)
   */
  const requestAndroid31Permissions = async () => {
    if (isWeb) return true;

    try {
      const bluetoothScanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Bluetooth Permission",
          message: "App needs Bluetooth permissions to connect to Aurora Board",
          buttonPositive: "OK",
        }
      );
      
      const bluetoothConnectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: "Bluetooth Permission",
          message: "App needs Bluetooth permissions to connect to Aurora Board",
          buttonPositive: "OK",
        }
      );
      
      const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth requires location permission on Android",
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

  /**
   * Request appropriate permissions based on platform and API level
   */
  const requestPermissions = async () => {
    if (isWeb) return true;
    
    if (Platform.OS === "android") {
      if ((DeviceExpo.platformApiLevel ?? -1) < 31) {
        // For Android versions below 31, only location permission is needed
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "Required to scan for Aurora Board",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.error("Permission request error:", error);
          return false;
        }
      } else {
        // For Android 31+ we need the new Bluetooth permissions
        return await requestAndroid31Permissions();
      }
    }
    
    // iOS doesn't require runtime permissions for Bluetooth
    return true;
  };

  /**
   * Scan for nearby Aurora Boards
   * Filters devices by Aurora advertising UUID
   */
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

      // Start scanning with Aurora advertising UUID filter
      bleManager.startDeviceScan([AURORA_ADVERTISING_UUID], null, (error: any, device: SimpleDevice) => {
        if (error) {
          console.error("Scan error:", error);
          setIsScanning(false);
          return;
        }

        // Only show devices with names
        if (device?.name) {
          setDevices(prevDevices => {
            // Avoid duplicates
            const deviceExists = prevDevices.some(d => d.id === device.id);
            return deviceExists ? prevDevices : [...prevDevices, {
              id: device.id,
              name: device.name,
              serviceUUIDs: device.serviceUUIDs
            }];
          });
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);

    } catch (error) {
      console.error("Failed to scan devices:", error);
      setIsScanning(false);
    }
  }, [isWeb, bleManager]);

  /**
   * Connect to a specific Aurora Board
   * @param device The device to connect to
   */
  const connectToDevice = useCallback(async (device: SimpleDevice) => {
    if (isWeb || bleManager.isMock) {
      console.log("BLE connection not available");
      return null;
    }

    try {
      setIsConnecting(true);
      
      // 1. Connect to the device with timeout
      const deviceConnection = await bleManager.connectToDevice(device.id, {
        timeout: 15000 // 15 seconds timeout
      });
      
      // 2. Discover services and characteristics
      await deviceConnection.discoverAllServicesAndCharacteristics();
      
      // 3. Set as connected device
      setConnectedDevice(deviceConnection);
      
      return deviceConnection;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isWeb, bleManager]);

  /**
   * Disconnect from the current device
   */
  const disconnectFromDevice = useCallback(async () => {
    if (isWeb || bleManager.isMock || !connectedDevice) return;

    try {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  }, [connectedDevice, isWeb, bleManager]);

  /**
   * Send data to the connected Aurora Board
   * @param data The data to send (hex string)
   * Data will be split into 20-byte chunks as required by Aurora Board
   */
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
      
      // 1. Validate and clean the hex code
      const cleanedCode = data.replace(/[^0-9A-Fa-f]/g, '');
      if (cleanedCode.length === 0) {
        throw new Error("Invalid hex data");
      }

      // 2. Split into 20-byte chunks (40 hex characters)
      const chunkSize = 40;
      const chunks = [];
      for (let i = 0; i < cleanedCode.length; i += chunkSize) {
        chunks.push(cleanedCode.substr(i, chunkSize));
      }

      // 3. Send each chunk sequentially
      for (const chunk of chunks) {
        const buffer = Buffer.from(chunk, 'hex');
        const base64Value = buffer.toString('base64');

        await bleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          AURORA_SERVICE_UUID,
          AURORA_WRITE_CHARACTERISTIC_UUID,
          base64Value
        );
        
        // Small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      return true;
    } catch (error) {
      console.error("Failed to send data to Aurora Board:", {
        error,
        data,
        connectedDevice: connectedDevice?.name
      });
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