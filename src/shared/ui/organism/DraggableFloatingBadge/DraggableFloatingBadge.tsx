import React, { useState, useRef, useEffect } from "react";
import { PanResponder, Dimensions, Platform, ViewStyle } from "react-native";
import { DragHandle, FloatingBadge } from "./styles";
import { GripVertical } from "lucide-react-native";
import { useMediaQuery } from "@gluestack-ui/themed";

export const DraggableFloatingBadge = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // State for window dimensions and badge position/size
  const [windowSize, setWindowSize] = useState(() => Dimensions.get("window"));
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [badgeSize, setBadgeSize] = useState({ width: 100, height: 50 });

  // Refs for drag tracking
  const touchOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // Responsive breakpoint and layout constants
  const [isMediumOrSmaller] = useMediaQuery({ maxWidth: 768 });
  const margin = 16;

  // Initialize position and handle screen size changes
  useEffect(() => {
    const updatePosition = () => {
      const windowWidth = Dimensions.get("window").width;
      const initialX = isMediumOrSmaller
        ? windowWidth / 2 - badgeSize.width / 2 // Center on small screens
        : margin; // Left-aligned on large screens

      setPosition((prev) => ({
        x: Math.max(
          margin,
          Math.min(initialX, windowWidth - badgeSize.width - margin)
        ),
        y: Math.max(
          margin,
          Math.min(prev.y, windowSize.height - badgeSize.height - margin)
        ),
      }));
    };

    updatePosition();
  }, [isMediumOrSmaller, badgeSize, windowSize]);

  // Handle window resize events
  useEffect(() => {
    const updateSize = ({ window }: { window: typeof windowSize }) => {
      setWindowSize(window);
      setPosition((prev) => ({
        x: isMediumOrSmaller ? window.width / 2 - badgeSize.width / 2 : margin,
        y: Math.min(prev.y, window.height - badgeSize.height - margin),
      }));
    };

    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, [badgeSize, isMediumOrSmaller]);

  // Pan responder for drag interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      isDragging.current = true;
      touchOffset.current = {
        x: evt.nativeEvent.pageX - position.x,
        y: evt.nativeEvent.pageY - position.y,
      };
    },
    onPanResponderMove: (evt) => {
      if (!isDragging.current) return;

      const newX = evt.nativeEvent.pageX - touchOffset.current.x;
      const newY = evt.nativeEvent.pageY - touchOffset.current.y;

      setPosition({
        x: Math.max(
          margin,
          Math.min(newX, windowSize.width - badgeSize.width - margin)
        ),
        y: Math.max(
          margin,
          Math.min(newY, windowSize.height - badgeSize.height - margin)
        ),
      });
    },
    onPanResponderRelease: () => {
      isDragging.current = false;
      // Snap to left edge on large screens when near margin
      if (!isMediumOrSmaller && position.x < margin * 2) {
        setPosition((prev) => ({ ...prev, x: margin }));
      }
    },
  });

  // Measure badge dimensions and adjust position
  const measureBadge = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setBadgeSize({ width, height });

    const windowWidth = Dimensions.get("window").width;
    const initialX = isMediumOrSmaller ? windowWidth / 2 - width / 2 : margin;

    setPosition((prev) => ({
      x: initialX,
      y: prev.y,
    }));
  };

  // Web-specific cursor style
  const webStyle = Platform.OS === "web" ? { cursor: "move" as const } : {};

  const badgeStyle: ViewStyle = {
    position: "absolute",
    top: position.y,
    left: position.x,
    zIndex: 1000,
    ...webStyle,
  };

  return (
    <FloatingBadge
      onLayout={measureBadge}
      style={badgeStyle}
      {...panResponder.panHandlers}
    >
      <DragHandle>
        <GripVertical size={16} color="#666" />
      </DragHandle>
      {children}
    </FloatingBadge>
  );
};
