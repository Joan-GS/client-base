import React, { useState } from "react";
import Svg, { G, Circle } from "react-native-svg";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { BigHoldsSvg } from "./components/BigHoldsSvg";
import { SmallHoldsSvg } from "./components/SmallHoldsSvg";
import { holdsData } from "./holds/holds";

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

const encodeColor = (hex: string): number => {
  const r = parseInt(hex.substring(0, 2), 16) / 32;
  const g = parseInt(hex.substring(2, 4), 16) / 32;
  const b = parseInt(hex.substring(4, 6), 16) / 64;
  return (r << 5) | (g << 2) | b;
};

const checksum = (data: number[]): number => {
  let sum = data.reduce((acc: number, val: number) => (acc + val) & 255, 0);
  return ~sum & 255;
};

const wrapBytes = (data: number[]): number[] => {
  if (data.length > MESSAGE_BODY_MAX_LENGTH) return [];
  return [1, data.length, checksum(data), 2, ...data, 3];
};

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
  const [selectedHolds, setSelectedHolds] = useState<Record<string, string>>(
    {}
  );

  const toggleHold = (id: string, position: number) => {
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

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <Svg
          width={"100%"}
          height={720}
          viewBox="0 0 1080 1170"
          pointerEvents="box-none"
        >
          <G>
            <BigHoldsSvg width="100%" height="100%" />
          </G>
          <G>
            <SmallHoldsSvg width="100%" height="100%" />
          </G>
          {holdsData.map(({ id, position, x, y }) => {
            const selectedColor = selectedHolds[id];
            const hexColor = colors[selectedColor] || "FFFFFF"; // Color en formato hex

            const r = parseInt(hexColor.substring(0, 2), 16);
            const g = parseInt(hexColor.substring(2, 4), 16);
            const b = parseInt(hexColor.substring(4, 6), 16);

            return (
              <Circle
                key={id}
                cx={x * COORDINATE_MULTIPLIER + DELTA_X}
                cy={-y * COORDINATE_MULTIPLIER + DELTA_Y}
                r={35}
                fill={
                  selectedColor && selectedColor !== "transparent"
                    ? `rgba(${r}, ${g}, ${b}, 0.2)`
                    : "transparent"
                }
                stroke={
                  selectedColor && selectedColor !== "transparent"
                    ? `rgb(${r}, ${g}, ${b})`
                    : "transparent"
                }
                strokeWidth={
                  selectedColor && selectedColor !== "transparent" ? 3 : 0
                }
                onPress={() => toggleHold(id, position)}
              />
            );
          })}
        </Svg>
      </View>
    </ScrollView>
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
