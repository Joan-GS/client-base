import React, { useState, useCallback, useRef } from "react";
import { Image, View, Animated } from "react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { holdsData } from "./holds/holds";
import Svg, { Circle } from "react-native-svg";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  GestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";

const COORDINATE_MULTIPLIER = 7.5;
const DELTA_X = 0;
const DELTA_Y = 1170;
const MESSAGE_BODY_MAX_LENGTH = 255;

const colors: Record<string, string> = {
  transparent: "FFFFFF",
  blue: "4CF0FD",
  green: "00FF00",
  yellow: "FBE400",
  magenta: "FF00FF",
};

const colorKeys = Object.keys(colors);

// Encode color to a number
const encodeColor = (hex: string): number => {
  const r = parseInt(hex.slice(0, 2), 16) / 32;
  const g = parseInt(hex.slice(2, 4), 16) / 32;
  const b = parseInt(hex.slice(4, 6), 16) / 64;
  return (r << 5) | (g << 2) | b;
};

// Calculate checksum
const checksum = (data: number[]): number => {
  return ~data.reduce((acc: number, val: number) => (acc + val) & 255, 0) & 255;
};

// Wrap bytes with start/end markers
const wrapBytes = (data: number[]): number[] => {
  if (data.length > MESSAGE_BODY_MAX_LENGTH) return [];
  return [1, data.length, checksum(data), 2, ...data, 3];
};

// Prepare Bluetooth packet
const prepBytesV3 = (
  holds: { position: number; color: string }[] 
): number[] => {
  const packets: number[][] = [];
  let currentPacket: number[] = [82]; // PACKET_FIRST

  holds.forEach(({ position, color }) => {
    if (currentPacket.length + 3 > MESSAGE_BODY_MAX_LENGTH) {
      packets.push(currentPacket);
      currentPacket = [81]; // PACKET_MIDDLE
    }
    currentPacket.push(
      position & 255,
      (position >> 8) & 255,
      encodeColor(colors[color])
    );
  });

  packets.push(currentPacket);

  if (packets.length === 1) packets[0][0] = 84; // PACKET_ONLY
  else {
    packets[0][0] = 82; // PACKET_FIRST
    packets[packets.length - 1][0] = 83; // PACKET_LAST
  }

  return packets.flatMap(wrapBytes);
};

const CreateClimbScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedHolds, setSelectedHolds] = useState<Record<string, string>>({});
  const [hoveredHold, setHoveredHold] = useState<string | null>(null);

  // Create scale and set min scale value
  const [scale, setScale] = useState(new Animated.Value(1)); // Track scale for pinch zoom
  const scaleValue = useRef(1); // Store scale value to keep track

  const MIN_ZOOM = 1; // Minimum zoom level

  const handlePinch = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    {
      useNativeDriver: false,  // Use false since we are handling scale with the Animated API
      listener: (event) => {
        const currentScale = event.nativeEvent.scale;
        const newScale = Math.max(MIN_ZOOM, currentScale); // Prevent going below the min zoom
        scale.setValue(newScale); // Update scale value
        scaleValue.current = newScale; // Update ref value
      },
    }
  );

  const handlePinchStateChange = (event: GestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === 5) {
      // state === 5 means the pinch gesture has ended
      setScale(new Animated.Value(scaleValue.current)); // Keep the scale after the pinch gesture
    }
  };

  const handleHoldToggle = useCallback((id: string) => {
    setSelectedHolds((prev) => {
      const currentColorIndex = colorKeys.indexOf(prev[id] || "transparent");
      const newColor = colorKeys[(currentColorIndex + 1) % colorKeys.length];
      const updatedHolds = { ...prev, [id]: newColor };

      const bluetoothCode = prepBytesV3(
        Object.entries(updatedHolds)
          .filter(([_, color]) => color !== "transparent")
          .map(([holdId, color]) => {
            const hold = holdsData.find((h) => h.id === holdId);
            return hold ? { position: hold.position, color } : null;
          })
          .filter(Boolean) as { position: number; color: string }[]
      );

      console.log(
        "Bluetooth Code:",
        bluetoothCode
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")
      );

      return updatedHolds;
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        onGestureEvent={handlePinch}
        onHandlerStateChange={handlePinchStateChange}
      >
        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transform: [{ scale: scale }], // Apply zoom here
          }}
        >
          <Image
            source={require("./layout_big_holds.png")}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              resizeMode: "contain",
              zIndex: 0,
            }}
          />
          <Image
            source={require("./layout_small_holds.png")}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              resizeMode: "contain",
              zIndex: 0,
            }}
          />
          <Svg
            width={"100%"}
            height={"100%"}
            viewBox="0 0 1080 1170"
            pointerEvents="auto"
            style={{ zIndex: 1 }}
          >
            {holdsData.map(({ id, position, x, y }) => {
              const selectedColor = selectedHolds[id];
              const hexColor =
                colors[selectedColor as keyof typeof colors] || "FFFFFF";
              const [r, g, b] = [0, 2, 4].map((i) =>
                parseInt(hexColor.slice(i, i + 2), 16)
              );

              const isHovered = hoveredHold === id;

              const fillColor = isHovered
                ? `rgba(${r}, ${g}, ${b}, 0.4)`
                : selectedColor && selectedColor !== "transparent"
                ? `rgba(${r}, ${g}, ${b}, 0.2)`
                : "transparent";

              const strokeColor =
                selectedColor && selectedColor !== "transparent"
                  ? `rgb(${r}, ${g}, ${b})`
                  : "transparent";

              const strokeWidth = isHovered
                ? 4
                : selectedColor && selectedColor !== "transparent"
                ? 3
                : 0;

              return (
                <Circle
                  key={id}
                  cx={x * COORDINATE_MULTIPLIER + DELTA_X}
                  cy={-y * COORDINATE_MULTIPLIER + DELTA_Y}
                  r={33}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  onPress={() => handleHoldToggle(id)}
                  onPressIn={() => setHoveredHold(id)}
                  onPressOut={() => setHoveredHold(null)}
                  pointerEvents="auto"
                  onResponderRelease={() => handleHoldToggle(id)}
                  />
              );
            })}
          </Svg>
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

export const CreateClimb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title={t("Set Boulder")} isSidebarVisible>
        <CreateClimbScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
