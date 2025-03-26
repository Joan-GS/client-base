import React, { useState, useCallback, useMemo } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { holdsData } from "./holds/holds";
import Svg, { Circle } from "react-native-svg";

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

// Función para codificar el color en un número
const encodeColor = (hex: string): number => {
  const r = parseInt(hex.slice(0, 2), 16) / 32;
  const g = parseInt(hex.slice(2, 4), 16) / 32;
  const b = parseInt(hex.slice(4, 6), 16) / 64;
  return (r << 5) | (g << 2) | b;
};

// Función para calcular la suma de verificación (checksum)
const checksum = (data: number[]): number => {
  return ~data.reduce((acc, val) => (acc + val) & 255, 0) & 255;
};

// Función para envolver los bytes de la data
const wrapBytes = (data: number[]): number[] => {
  if (data.length > MESSAGE_BODY_MAX_LENGTH) return [];
  return [1, data.length, checksum(data), 2, ...data, 3];
};

// Función para preparar los bytes que serán enviados al Bluetooth
const prepBytesV3 = (holds: { position: number; color: string }[]): number[] => {
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

export const CreateClimbScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedHolds, setSelectedHolds] = useState<Record<string, string>>({});
  const [hoveredHold, setHoveredHold] = useState<string | null>(null);

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
          .filter((h): h is { position: number; color: string } => h !== null)
      );

      console.log(
        "Bluetooth Code:",
        bluetoothCode.map((byte) => byte.toString(16).padStart(2, "0")).join(" ")
      );

      return updatedHolds;
    });
  }, []);

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredHold(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredHold(null);
  }, []);


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", position: "relative" }}>
      {/* Imagen de fondo */}
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

      {/* Componentes SVG */}
      <Svg width={"100%"} height={"100%"} viewBox="0 0 1080 1170" pointerEvents="auto" style={{ zIndex: 1 }}>
        {holdsData.map(({ id, position, x, y }) => {
          const selectedColor = selectedHolds[id];
          const hexColor = colors[selectedColor] || "FFFFFF";
          const [r, g, b] = [0, 2, 4].map((i) => parseInt(hexColor.slice(i, i + 2), 16));

          const isHovered = hoveredHold === id;
          const fillColor = isHovered
            ? `rgba(${r}, ${g}, ${b}, 0.4)`
            : selectedColor && selectedColor !== "transparent"
            ? `rgba(${r}, ${g}, ${b}, 0.2)`
            : "transparent";

          const strokeColor =
            selectedColor && selectedColor !== "transparent" ? `rgb(${r}, ${g}, ${b})` : "transparent";
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
              r={35}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              onPress={() => handleHoldToggle(id)}
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={handleMouseLeave}
              pointerEvents="auto"
            />
          );
        })}
      </Svg>
    </View>
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
