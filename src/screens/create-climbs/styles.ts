import { styled } from "@gluestack-style/react";
import { Button, HStack, Pressable } from "@gluestack-ui/themed";
import { View } from "react-native";
import { Animated } from "react-native";

/**
 * BUTTON COMPONENTS
 */

// Horizontal button group container
export const StyledButtonGroup = styled(HStack, {
  display: "flex",
  flexDirection: "row",
  gap: 8,
});

// Action button with transparent background
export const StyledActionButton = styled(Pressable, {
  
  padding: 6,
  borderRadius: 20,
  backgroundColor: "transparent",
  ":active": {
    backgroundColor: "$backgroundLight100",
  },
  zIndex: 5,
  // Efecto al presionar (para todas las plataformas)
  _pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
    backgroundColor: "$backgroundLight100",
  },
  
  // Estado disabled
  _disabled: {
    opacity: 0.5,
  },

  // Versión para web (hover)
  _web: {
    cursor: "pointer",
    ':hover': {
      backgroundColor: "$backgroundLight50",
    }
  }

});

// Quick action button in top-right corner
export const StyledQuickActionButton = styled(Pressable, {
  position: "absolute",
  top: 20,
  right: 20,
  backgroundColor: "white",
  padding: 10,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  zIndex: 5,

});

/**
 * WALL COMPONENTS
 */

// Animated container for the climbing wall
export const AnimatedWallContainer = styled(Animated.View, {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

/**
 * FLOATING PANEL COMPONENTS
 */

// Divider for the draggable panel
export const PanelDivider = styled(View, {
  height: "100%",
  backgroundColor: "#ddd",
  width: 1,
  marginHorizontal: 8,
});

// Drag handle indicator
export const DragHandle = styled(View, {
  padding: 4,
});