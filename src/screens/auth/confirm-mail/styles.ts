import { styled } from "@gluestack-style/react";
import { VStack } from "@/src/components/ui/vstack";
import { View } from "@/src/components/ui/view";
import { Text as UIText } from "@/src/components/ui/text";

// ------------ CONTAINERS ------------

// Main container to center content
export const VStackContainer = styled(VStack, {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  paddingHorizontal: 20,
  flexWrap: 'wrap'
});

// Container for the message and button
export const MessageContainer = styled(VStack, {
  gap: 20,
  width: "100%",
  alignItems: "center",
});

// ------------ BUTTONS ------------

// Styled button text (white color)
export const ButtonTextStyled = styled(UIText, {
  fontSize: 16,
  fontWeight: "bold",
  color: "white",
});

// ------------ TEXT STYLES ------------

// Header text style
export const Heading = styled(UIText, {
  fontSize: 22,
  fontWeight: "bold",
  textAlign: "center"
});

// Normal text style
export const Text = styled(UIText, {
  fontSize: 16,
  textAlign: "center",
  color: "#666",
});

// Success message text
export const SuccessText = styled(UIText, {
  fontSize: 16,
  textAlign: "center",
  color: "green",
  fontWeight: "bold",
});
