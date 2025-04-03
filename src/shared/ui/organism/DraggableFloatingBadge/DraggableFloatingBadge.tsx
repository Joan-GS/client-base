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
  const [windowSize, setWindowSize] = useState(() => Dimensions.get("window"));
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [badgeSize, setBadgeSize] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const touchOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const positionRef = useRef(position);
  const badgeSizeRef = useRef(badgeSize);

  const [isMediumOrSmaller] = useMediaQuery({ maxWidth: 768 });
  const margin = 16;

  // Actualizar las refs cuando cambian los estados
  useEffect(() => {
    positionRef.current = position;
    badgeSizeRef.current = badgeSize;
  }, [position, badgeSize]);

  // Inicializar posición solo una vez cuando se conoce el tamaño
  useEffect(() => {
    if (badgeSize.width > 0 && badgeSize.height > 0 && !isInitialized) {
      const windowWidth = windowSize.width;
      const initialX = isMediumOrSmaller
        ? windowWidth / 2 - badgeSize.width / 2
        : margin;
      
      setPosition({
        x: Math.max(margin, Math.min(initialX, windowWidth - badgeSize.width - margin)),
        y: margin,
      });
      setIsInitialized(true);
    }
  }, [badgeSize, isMediumOrSmaller, windowSize, isInitialized]);

  // Manejar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = ({ window }: { window: typeof windowSize }) => {
      setWindowSize(window);
      
      // Solo ajustar posición si el componente está inicializado
      if (isInitialized) {
        setPosition(prev => ({
          x: isMediumOrSmaller 
            ? window.width / 2 - badgeSizeRef.current.width / 2 
            : Math.min(prev.x, window.width - badgeSizeRef.current.width - margin),
          y: Math.min(prev.y, window.height - badgeSizeRef.current.height - margin),
        }));
      }
    };

    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription.remove();
  }, [isInitialized, isMediumOrSmaller]);

  // PanResponder mejorado
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDragging.current = true;
        touchOffset.current = {
          x: evt.nativeEvent.pageX - positionRef.current.x,
          y: evt.nativeEvent.pageY - positionRef.current.y,
        };
      },
      onPanResponderMove: (evt) => {
        if (!isDragging.current) return;

        const newX = evt.nativeEvent.pageX - touchOffset.current.x;
        const newY = evt.nativeEvent.pageY - touchOffset.current.y;

        setPosition({
          x: Math.max(
            margin,
            Math.min(newX, windowSize.width - badgeSizeRef.current.width - margin)
          ),
          y: Math.max(
            margin,
            Math.min(newY, windowSize.height - badgeSizeRef.current.height - margin)
          ),
        });
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
        if (!isMediumOrSmaller && positionRef.current.x < margin * 2) {
          setPosition(prev => ({ ...prev, x: margin }));
        }
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
      },
    })
  ).current;

  // Medir el tamaño del badge
  const measureBadge = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0 && (width !== badgeSize.width || height !== badgeSize.height)) {
      setBadgeSize({ width, height });
    }
  };

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