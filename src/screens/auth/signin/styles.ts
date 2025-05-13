// styles.ts
import { styled } from "@gluestack-style/react";
import { Button as UIButton } from "@/src/components/ui/button";
import { LinkText as UILinkText } from "@/src/components/ui/link";
import { View } from "@/src/components/ui/view";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";

// --- Layout Containers ---
export const LoginWithLeftBackgroundContainer = styled(View, {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  flex: 1,
});

export const LoginTextsContainer = styled(View, {
  paddingBottom: 32,
  alignItems: "center",
});

export const FormsContainer = styled(View, {
  gap: 20,
  width: "100%",
});

export const VStackContainer = styled(VStack, {
  marginTop: 24,
  gap: 16,
});

// --- Layout Stacks ---
export const HStackContainer = styled(HStack, {
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});