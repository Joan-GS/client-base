import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";
import { Pressable } from "@/src/components/ui/pressable";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";

// Container for the footer, ensuring it spans the full width at the bottom
export const FooterContainer = styled(HStack, {
  justifyContent: "space-between",
  width: "100%",
  position: "absolute",
  left: 0,
  bottom: 0,
  right: 0,
  padding: 12,
  overflow: "hidden",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
  backgroundColor: "#fff",
  display: "flex",
});

// Style for each footer button
export const FooterButton = styled(Pressable, {
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
  paddingTop: 4,
});

// Style for icons inside the footer
export const FooterIcon = styled(Icon, {
  height: 32,
  width: 65,
});

// Style for footer text labels
export const FooterText = styled(Text, {
  fontSize: 12,
  textAlign: "center",
});
