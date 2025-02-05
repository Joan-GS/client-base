import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { Pressable } from "@/src/components/ui/pressable";
import { Avatar } from "@/src/components/ui/avatar";

// Contenedor principal del header
export const WebHeaderContainer = styled(HStack, {
  paddingTop: 16,
  paddingRight: 40,
  paddingBottom: 12,
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomWidth: 1,
});

// Botón del menú para abrir el sidebar
export const MenuButton = styled(Pressable, {
  marginLeft: 20,
});

// Título del header
export const HeaderTitle = styled(Text, {
  fontSize: 24,
  paddingLeft: 20,
});

// Avatar del usuario
export const AvatarContainer = styled(Avatar, {
  height: 36,
  width: 36,
});
