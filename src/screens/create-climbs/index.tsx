import React, { useState, useCallback, useRef, useMemo } from "react";
import { Image, View, Animated, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { holdsData } from "./holds/holds";
import Svg, { Circle } from "react-native-svg";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { StepForward, Trash, Undo } from "lucide-react-native";
import { Divider, useMediaQuery } from "@gluestack-ui/themed";
import { DraggableFloatingBadge } from "@/src/shared/ui/organism/DraggableFloatingBadge/DraggableFloatingBadge";
import {
  AnimatedWallContainer,
  StyledActionButton,
  StyledButtonGroup,
  StyledQuickActionButton,
} from "./styles";
import { CreateClimbForm } from "./components/CreateClimbForm";

// ====================== CONSTANTS ======================
const COORDINATE_MULTIPLIER = 7.5;
const DELTA_X = 0;
const DELTA_Y = 1170;
const MESSAGE_BODY_MAX_LENGTH = 255;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLOR_DEFINITIONS = {
  transparent: "FFFFFF",
  blue: "4CF0FD",
  green: "00FF00",
  yellow: "FBE400",
  magenta: "FF00FF",
} as const;

const COLOR_KEYS = Object.keys(COLOR_DEFINITIONS) as Array<
  keyof typeof COLOR_DEFINITIONS
>;

type HoldSelection = Record<string, keyof typeof COLOR_DEFINITIONS>;
type Point = { x: number; y: number };

// ====================== UTILITY FUNCTIONS ======================
const encodeColor = (hex: string): number => {
  const r = parseInt(hex.slice(0, 2), 16) / 32;
  const g = parseInt(hex.slice(2, 4), 16) / 32;
  const b = parseInt(hex.slice(4, 6), 16) / 64;
  return (r << 5) | (g << 2) | b;
};

const calculateChecksum = (data: number[]): number => {
  return ~data.reduce((acc, val) => (acc + val) & 255, 0) & 255;
};

const wrapBytes = (data: number[]): number[] => {
  return [1, data.length, calculateChecksum(data), 2, ...data, 3];
};

const prepareBluetoothData = (
  holds: { position: number; color: keyof typeof COLOR_DEFINITIONS }[]
): string => {
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
      encodeColor(COLOR_DEFINITIONS[color])
    );
  });

  packets.push(currentPacket);

  if (packets.length === 1) packets[0][0] = 84; // PACKET_ONLY
  else {
    packets[0][0] = 82; // PACKET_FIRST
    packets[packets.length - 1][0] = 83; // PACKET_LAST
  }

  const byteArray = packets.flatMap(wrapBytes);
  return byteArray.map(b => b.toString(16).padStart(2, "0")).join(" ");
};

// ====================== MAIN COMPONENTS ======================
interface CreateClimbScreenProps {
  onNext: (data: string) => void;
  selectedHolds: HoldSelection;
  setSelectedHolds: React.Dispatch<React.SetStateAction<HoldSelection>>;
  selectionHistory: string[];
  setSelectionHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

const CreateClimbScreen: React.FC<CreateClimbScreenProps> = ({ 
  onNext, 
  selectedHolds, 
  setSelectedHolds,
  selectionHistory,
  setSelectionHistory
}) => {  
  const [hoveredHold, setHoveredHold] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [bluetoothData, setBluetoothData] = useState<string>("");

  // Animation refs
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslate = useRef<Point>({ x: 0, y: 0 });
  const panGestureRef = useRef(null);
  const pinchGestureRef = useRef(null);

  // Zoom constants
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_THRESHOLD = 0.1;

  // Gesture handlers
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: false }
  );

  const onPinchHandlerStateChange = useCallback((event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      lastScale.current = Math.max(
        MIN_ZOOM,
        Math.min(lastScale.current, MAX_ZOOM)
      );
      setIsZoomed(lastScale.current > MIN_ZOOM + ZOOM_THRESHOLD);

      if (lastScale.current <= MIN_ZOOM + ZOOM_THRESHOLD) {
        lastTranslate.current = { x: 0, y: 0 };
        translateX.setOffset(0);
        translateY.setOffset(0);
        translateX.setValue(0);
        translateY.setValue(0);
        setIsZoomed(false);
      }

      Animated.spring(scale, {
        toValue: lastScale.current,
        useNativeDriver: false,
        bounciness: 0,
      }).start();
    }
  }, []);

  const onPanGestureEvent = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              translationX: isZoomed ? translateX : new Animated.Value(0),
              translationY: isZoomed ? translateY : new Animated.Value(0),
            },
          },
        ],
        { useNativeDriver: false }
      ),
    [isZoomed]
  );

  const onPanHandlerStateChange = useCallback(
    (event: any) => {
      if (event.nativeEvent.oldState === State.ACTIVE && isZoomed) {
        const newX = lastTranslate.current.x + event.nativeEvent.translationX;
        const newY = lastTranslate.current.y + event.nativeEvent.translationY;
        const maxTranslate = (SCREEN_WIDTH * (lastScale.current - 1)) / 2;

        lastTranslate.current = {
          x: Math.max(-maxTranslate, Math.min(newX, maxTranslate)),
          y: Math.max(-maxTranslate, Math.min(newY, maxTranslate)),
        };

        translateX.setOffset(lastTranslate.current.x);
        translateY.setOffset(lastTranslate.current.y);
        translateX.setValue(0);
        translateY.setValue(0);
      }
    },
    [isZoomed]
  );

  // Hold management functions
  const updateBluetoothData = useCallback((holds: HoldSelection) => {
    const selectedHoldsData = Object.entries(holds)
      .filter(([_, color]) => color !== "transparent")
      .map(([holdId, color]) => {
        const hold = holdsData.find((h) => h.id === holdId);
        return hold ? { position: hold.position, color } : null;
      })
      .filter(Boolean) as {
      position: number;
      color: keyof typeof COLOR_DEFINITIONS;
    }[];

    const data = prepareBluetoothData(selectedHoldsData);
    setBluetoothData(data);
    
    console.log("Bluetooth Data:", data);
  }, []);

  const handleHoldToggle = useCallback(
    (id: string) => {
      setSelectedHolds((prev) => {
        const currentColor = prev[id] || "transparent";
        const currentIndex = COLOR_KEYS.indexOf(currentColor);
        const newColor = COLOR_KEYS[(currentIndex + 1) % COLOR_KEYS.length];
        const updatedHolds = { ...prev, [id]: newColor };

        setSelectionHistory((prevHistory) =>
          newColor !== "transparent"
            ? [...prevHistory, id]
            : prevHistory.filter((holdId) => holdId !== id)
        );

        updateBluetoothData(updatedHolds);
        return updatedHolds;
      });
    },
    [updateBluetoothData]
  );

  const resetHolds = useCallback(() => {
    setSelectedHolds({});
    setSelectionHistory([]);
    updateBluetoothData({});
  }, [updateBluetoothData]);

  const undoLastHold = useCallback(() => {
    if (selectionHistory.length === 0) return;

    const lastHoldId = selectionHistory[selectionHistory.length - 1];
    setSelectedHolds((prev) => {
      const newHolds = { ...prev };
      delete newHolds[lastHoldId];
      updateBluetoothData(newHolds);
      return newHolds;
    });
    setSelectionHistory((prev) => prev.slice(0, -1));
  }, [selectionHistory, updateBluetoothData]);

  // Render holds
  const renderedHolds = useMemo(
    () =>
      holdsData.map(({ id, x, y }) => {
        const selectedColor = selectedHolds[id];
        const hexColor = selectedColor
          ? COLOR_DEFINITIONS[selectedColor]
          : "FFFFFF";
        const [r, g, b] = [0, 2, 4].map((i) =>
          parseInt(hexColor.slice(i, i + 2), 16)
        );
        const isHovered = hoveredHold === id;
        const isSelected = selectedColor && selectedColor !== "transparent";

        return (
          <Circle
            key={id}
            cx={x * COORDINATE_MULTIPLIER + DELTA_X}
            cy={-y * COORDINATE_MULTIPLIER + DELTA_Y}
            r={33}
            fill={
              isHovered
                ? `rgba(${r},${g},${b},0.4)`
                : isSelected
                ? `rgba(${r},${g},${b},0.2)`
                : "transparent"
            }
            stroke={isSelected ? `rgb(${r},${g},${b})` : "transparent"}
            strokeWidth={isHovered ? 4 : isSelected ? 3 : 0}
            onPress={() => handleHoldToggle(id)}
            onPressIn={() => setHoveredHold(id)}
            onPressOut={() => setHoveredHold(null)}
            onResponderRelease={() => handleHoldToggle(id)}
            cursor="pointer"
          />
        );
      }),
    [selectedHolds, hoveredHold, handleHoldToggle]
  );

  const handleNextPress = () => {
    onNext(bluetoothData);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StyledQuickActionButton onPress={handleNextPress}>
        <StepForward size={24} color="green" />
      </StyledQuickActionButton>

      <DraggableFloatingBadge>
        <Divider
          style={{
            height: "100%",
            backgroundColor: "#ddd",
            width: 1,
            marginHorizontal: 8,
          }}
        />
        <StyledButtonGroup>
          <StyledActionButton
            onPress={undoLastHold}
            disabled={selectionHistory.length === 0}
          >
            <Undo size={20} color="black" />
          </StyledActionButton>
          <StyledActionButton
            onPress={resetHolds}
            disabled={selectionHistory.length === 0}
          >
            <Trash size={20} color="red" />
          </StyledActionButton>
        </StyledButtonGroup>
      </DraggableFloatingBadge>

      <PanGestureHandler
        ref={panGestureRef}
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}
        minDist={10}
        avgTouches
        enabled={isZoomed}
        simultaneousHandlers={pinchGestureRef}
      >
        <View style={{ flex: 1 }}>
          <PinchGestureHandler
            ref={pinchGestureRef}
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchHandlerStateChange}
            simultaneousHandlers={panGestureRef}
          >
            <AnimatedWallContainer
              style={{
                transform: [
                  { scale: scale },
                  { translateX: translateX },
                  { translateY: translateY },
                ],
              }}
            >
              <Image
                source={require("./layout_big_holds.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  resizeMode: "contain",
                }}
              />
              <Image
                source={require("./layout_small_holds.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  resizeMode: "contain",
                }}
              />
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 1080 1170"
                style={{ zIndex: 1 }}
              >
                {renderedHolds}
              </Svg>
            </AnimatedWallContainer>
          </PinchGestureHandler>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export const CreateClimb: React.FC = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [bluetoothData, setBluetoothData] = useState<string>("");
  const [selectedHolds, setSelectedHolds] = useState<HoldSelection>({});
  const [selectionHistory, setSelectionHistory] = useState<string[]>([]);

  const handleNext = (data: string) => {
    setBluetoothData(data);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title={t("Set Boulder")} isSidebarVisible>
        {!showForm ? (
          <CreateClimbScreen 
            onNext={handleNext}
            selectedHolds={selectedHolds}
            setSelectedHolds={setSelectedHolds}
            selectionHistory={selectionHistory}
            setSelectionHistory={setSelectionHistory}
          />
        ) : (
          <CreateClimbForm 
            onBack={handleBack} 
            bluetoothData={bluetoothData} 
          />
        )}
      </DashboardLayout>
    </SafeAreaView>
  );
};