import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { Modal, ModalContent, ModalBody } from "@/src/components/ui/modal";
import { Pressable } from "@/src/components/ui/pressable";
import { ScrollView, View } from "@gluestack-ui/themed";

// Main container for the profile screen
export const MainContainer = styled(View, {
  flex: 1,
  backgroundColor: "white",
});

// Content container that holds all profile elements
export const ContentContainer = styled(View, {
  flex: 1,
  paddingBottom: 20, // Add some padding at the bottom
});

// Profile text container
export const ProfileContainer = styled(VStack, {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 16,
  alignItems: "center",
  borderRadius: 8,
  paddingTop: 30,
  paddingBottom: 20,
  zIndex: 1,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
  backgroundColor: "white",
  marginBottom: 16,
});

export const ProfileHeader = styled(HStack, {
  alignItems: "center",
  flexDirection: "column",
  width: "100%",
  paddingLeft: 8,
});

export const ProfileText = styled(VStack, {
  alignItems: "flex-start",
});

export const StatsSection = styled(HStack, {
  justifyContent: "space-evenly",
  width: "100%",
});

export const StatsItem = styled(Pressable, {
  alignItems: "center",
});

export const LogoutButton = styled(Button, {
  position: "absolute",
  top: 20,
  right: 20,
  backgroundColor: "transparent",
  padding: 10,
  borderRadius: 50,
  zIndex: 2,
});

export const EditProfileButton = styled(Button, {
  width: "100%",
});

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

export const ClimbGridContainer = styled(View, {
  width: "100%",
  paddingHorizontal: 16,
});

export const ClimbGridContent = styled(View, {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  gap: 12,
  marginBottom: 54,

});

export const ClimbCardWrapper = styled(View, {
  width: "100%",
  minWidth: 405,
  alignItems: "center",

  "@base": {
    flex: 1,
    alignItems: "center",
  },
  "@sm": {
    flex: 1,
    alignItems: "center",

  },
  "@md": {
    flex: 1,
    alignItems: "center",
  },
  "@lg": {
    flex: 1 / 3,
    alignItems: "center",

  },
  "@xl": {
    flex: 1 / 3,
    alignItems: "center",

  },
});

export const ClimbScrollContainer = styled(ScrollView, {
  paddingVertical: 12,
  paddingLeft: 16,
});
