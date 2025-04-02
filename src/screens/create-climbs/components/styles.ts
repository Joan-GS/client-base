import { styled } from "@gluestack-style/react";
import { Badge } from "@/src/components/ui/badge";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { HStack } from "@/src/components/ui/hstack";
import { Button } from "@gluestack-ui/themed";

// Main container for the screen
export const Container = styled(VStack, {
  padding: 20,
  width: "100%",
  gap: "$5",
  marginBottom: "$24",
  alignSelf: "center",
  maxWidth: 760,
});

// Main title for the screen
export const Title = styled(Text, {
  fontSize: 26,
  fontWeight: "bold",
  marginBottom: 18,
  textAlign: "center",
});

// Error text with subtle animation
export const ErrorText = styled(Text, {
  color: "red",
  fontSize: 14,
  opacity: 0.9,
});

// Labels for form fields
export const Label = styled(Text, {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 10,
  marginBottom: 5,
});

// Container for tags
export const TagsContainer = styled(HStack, {
  flexWrap: "wrap",
  marginTop: 8,
  gap: 10,
  justifyContent: "center",
});

// Styled container for tags in a row layout
export const StyledTagsContainer = styled(HStack, {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 10,
  width: "100%",
});

// Style for tag badges (with interactive effects)
export const TagBadge = styled(Badge, {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 12,
  backgroundColor: "#E0E0E0",
  _hover: {
    backgroundColor: "#d5d5d5",
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "#3498db",
        transform: [{ scale: 1.05 }],
        shadowColor: "#3498db",
        shadowOpacity: 0.5,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      false: {
        backgroundColor: "#E0E0E0",
      },
    },
  },
});

// Style for climbing grade badges with dynamic effect
export const GradeBadge = styled(Badge, {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 20,
  minWidth: 80,
  backgroundColor: "#E0E0E0",
  _hover: {
    backgroundColor: "#d5d5d5",
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "#4CAF50",
        transform: [{ scale: 1.05 }],
        shadowColor: "#4CAF50",
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      false: {
        backgroundColor: "#E0E0E0",
      },
    },
  },
});

// Improved style for status badges (with animation)
export const StatusBadge = styled(Badge, {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: "#E0E0E0",
  _hover: {
    backgroundColor: "#d5d5d5",
  },
  variants: {
    status: {
      Public: {
        backgroundColor: "green",
        transform: [{ scale: 1.05 }],
        shadowColor: "green",
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      Private: {
        backgroundColor: "red",
        transform: [{ scale: 1.05 }],
        shadowColor: "red",
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      Draft: {
        backgroundColor: "gray",
        transform: [{ scale: 1.05 }],
        shadowColor: "gray",
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
    },
  },
});

export const BackButton = styled(Button, {
  position: "absolute",
  top: 20,
  left: 20,
  zIndex: 10,
  p: 10,
});
