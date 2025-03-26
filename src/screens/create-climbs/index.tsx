import React, { useState } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { holdsData } from "./holds/holds";
import Svg, { Circle } from "react-native-svg";

const COORDINATE_MULTIPLIER = 7.5;
const DELTA_X = 0;
const DELTA_Y = 1170;

const PACKET_MIDDLE = 81;
const PACKET_FIRST = 82;
const PACKET_LAST = 83;
const PACKET_ONLY = 84;
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
  const r = parseInt(hex.substring(0, 2), 16) / 32;
  const g = parseInt(hex.substring(2, 4), 16) / 32;
  const b = parseInt(hex.substring(4, 6), 16) / 64;
  return (r << 5) | (g << 2) | b;
};

// Función para calcular la suma de verificación (checksum)
const checksum = (data: number[]): number => {
  let sum = data.reduce((acc: number, val: number) => (acc + val) & 255, 0);
  return ~sum & 255;
};

// Función para envolver los bytes de la data
const wrapBytes = (data: number[]): number[] => {
  if (data.length > MESSAGE_BODY_MAX_LENGTH) return [];
  return [1, data.length, checksum(data), 2, ...data, 3];
};

// Función para preparar los bytes que serán enviados al Bluetooth
interface HoldWithColor {
  position: number;
  color: string;
}

const prepBytesV3 = (holds: HoldWithColor[]): number[] => {
  let packets: number[][] = [];
  let currentPacket: number[] = [PACKET_MIDDLE];

  holds.forEach(({ position, color }) => {
    if (currentPacket.length + 3 > MESSAGE_BODY_MAX_LENGTH) {
      packets.push(currentPacket);
      currentPacket = [PACKET_MIDDLE];
    }
    currentPacket.push(
      position & 255,
      (position >> 8) & 255,
      encodeColor(colors[color])
    );
  });

  packets.push(currentPacket);

  if (packets.length === 1) packets[0][0] = PACKET_ONLY;
  else {
    packets[0][0] = PACKET_FIRST;
    packets[packets.length - 1][0] = PACKET_LAST;
  }

  return packets.flatMap(wrapBytes);
};

export const CreateClimbScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedHolds, setSelectedHolds] = useState<Record<string, string>>({});
  const [hoveredHold, setHoveredHold] = useState<string | null>(null);

  const toggleHold = (id: string) => {
    setSelectedHolds((prev) => {
      const currentColorIndex = colorKeys.indexOf(prev[id] || "transparent");
      const newColor = colorKeys[(currentColorIndex + 1) % colorKeys.length];
      const updatedHolds = { ...prev, [id]: newColor };

      // Preparando los datos para el Bluetooth
      const bluetoothCode = prepBytesV3(
        Object.entries(updatedHolds)
          .filter(([_, color]) => color !== "transparent")
          .map(([holdId, color]) => {
            const hold = holdsData.find((h) => h.id === holdId);
            return hold ? { position: hold.position, color } : null;
          })
          .filter((h): h is HoldWithColor => h !== null)
      );

      console.log(
        "Código Bluetooth:",
        bluetoothCode
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")
      );

      return updatedHolds;
    });
  };

  const handleMouseEnter = (id: string) => {
    setHoveredHold(id);
  };

  const handleMouseLeave = () => {
    setHoveredHold(null);
  };

  // Obtener el tamaño de la ventana
  const { width, height } = Dimensions.get("window");

  // Restar la altura del Tab Bar (ajusta esto según tu diseño)
  const TAB_BAR_HEIGHT = 60;
  const svgHeight = height - TAB_BAR_HEIGHT;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", position: "relative" }}>
      {/* Imagen de fondo grande */}
      <Image
        source={require("./layout_big_holds.png")}  // Aquí se importa la imagen
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          resizeMode: "contain",
          zIndex: 0, // Asegura que las imágenes estén detrás
        }}
      />
      {/* Imagen de fondo pequeña */}
      <Image
        source={require("./layout_small_holds.png")}  // Aquí se importa la imagen
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          resizeMode: "contain",
          zIndex: 0, // Asegura que las imágenes estén detrás
        }}
      />

      {/* Componentes SVG */}
      <Svg
        width={width}
        height={svgHeight} // Ajustamos el alto del SVG
        viewBox="0 0 1080 1170"
        pointerEvents="auto"
        style={{ zIndex: 1 }}
      >
        {holdsData.map(({ id, position, x, y }) => {
          const selectedColor = selectedHolds[id];
          const hexColor = colors[selectedColor] || "FFFFFF";

          const r = parseInt(hexColor.substring(0, 2), 16);
          const g = parseInt(hexColor.substring(2, 4), 16);
          const b = parseInt(hexColor.substring(4, 6), 16);

          const isHovered = hoveredHold === id;

          return (
            <Circle
              key={id}
              cx={x * COORDINATE_MULTIPLIER + DELTA_X}
              cy={-y * COORDINATE_MULTIPLIER + DELTA_Y}
              r={35}
              fill={
                isHovered
                  ? `rgba(${r}, ${g}, ${b}, 0.4)`
                  : selectedColor && selectedColor !== "transparent"
                  ? `rgba(${r}, ${g}, ${b}, 0.2)`
                  : "transparent"
              }
              stroke={
                selectedColor && selectedColor !== "transparent"
                  ? `rgb(${r}, ${g}, ${b})`
                  : "transparent"
              }
              strokeWidth={
                isHovered
                  ? 4
                  : selectedColor && selectedColor !== "transparent"
                  ? 3
                  : 0
              }
              onPress={() => toggleHold(id)} // Usamos solo onPress
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
