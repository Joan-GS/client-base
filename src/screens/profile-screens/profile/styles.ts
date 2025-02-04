import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { Modal, ModalContent, ModalBody } from "@/src/components/ui/modal";
import { Pressable } from "@/src/components/ui/pressable";

// Profile text container
export const ProfileContainer = styled(VStack, {
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
  paddingTop: 30,
  paddingBottom: 20,
  zIndex: 0,
});

// Profile Header container
export const ProfileHeader = styled(HStack, {
  paddingBottom: 16,
  paddingHorizontal: 20,
  alignItems: "center",
  flexDirection: "column",
});

// Profile text container
export const ProfileText = styled(VStack, {
  alignItems: "flex-start",
});

// Stats Section container
export const StatsSection = styled(HStack, {
  paddingHorizontal: 20,
  paddingBottom: 8,
  justifyContent: "space-between",
  width: "100%",
});

// Stats item container
export const StatsItem = styled(VStack, {
  alignItems: "center",
});

// Button container for settings
export const SettingsButtonContainer = styled(Box, {
  paddingHorizontal: 20,
  paddingVertical: 16,
});

// Button style for settings
export const SettingsButton = styled(Button, {
  marginBottom: 8,
});

// Modal Styles
export const ModalStyled = styled(Modal, {
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

export const ModalAvatarStyled = styled(Box, {
  flex: 1,
  position: "relative",
  alignSelf: "center",
});

export const ModalAvatarPressableStyled = styled(Pressable, {
  position: "absolute",
  right: 0,
  bottom: 0,
});

export const ModalContentStyled = styled(ModalContent, {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "white",
  borderRadius: 10,
  padding: 20,
  gap: 20,
});

export const ModalBodyStyled = styled(ModalBody, {
  paddingBottom: 16,
  gap: 16,
});
