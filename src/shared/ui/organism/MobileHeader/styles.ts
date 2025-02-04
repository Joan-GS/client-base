import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar } from "@/src/components/ui/avatar";
import { Text } from "@/src/components/ui/text";

export const StyledHeaderContainer = styled(HStack, {
  padding: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
  borderBottomWidth: 1,
  borderColor: "#E5E7EB",
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
});

// Título del header
export const HeaderTitle = styled(Text, {
  fontSize: 18,
  paddingLeft: 20,
});

// Avatar del usuario
export const AvatarContainer = styled(Avatar, {
  height: 36,
  width: 36,
  left: 0,
});
