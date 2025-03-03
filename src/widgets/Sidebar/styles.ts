import { styled } from "@gluestack-style/react";
import { VStack } from "@/src/components/ui/vstack";
import { Icon } from "@/src/components/ui/icon";
import { Pressable } from "@/src/components/ui/pressable";

export const SidebarContainer = styled(VStack, {
  paddingTop: 20,
  paddingInline: "$2",
  height: "100%",
  alignItems: "center",
  borderRightWidth: 1,
  borderColor: "#ccc",
  backgroundColor: "#FFFFFF",
  gap: 24,
});


export const SidebarButton = styled(Pressable, {
  flexDirection: "column",
  alignItems: "center",
  padding: 8,
  borderRadius: 8,
  backgroundColor: "#fff",
});

export const SidebarIcon = styled(Icon, {
  width: 44,
  height: 36,
  fill: "none",

  variants: {
    selected: {
      true: {
        fill: "#000", // Color de icono cuando está seleccionado
      },
    },
  },
});
