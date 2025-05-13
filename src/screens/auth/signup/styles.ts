import { styled } from "@gluestack-style/react";
import { VStack } from "@/src/components/ui/vstack";
import { View } from "@/src/components/ui/view";
import { HStack } from "@/src/components/ui/hstack";
import { Button as UIButton } from "@/src/components/ui/button";
import { LinkText as UILinkText } from "@/src/components/ui/link";

// --- Layout Containers ---
export const VStackContainer = styled(VStack, {
  flex: 1,
  width: "100%",
  justifyContent: "center",
});

export const FormsContainer = styled(View, {
  gap: 20,
  width: "100%",
});

export const LoginTextsContainer = styled(View, {
  paddingBottom: 32,
  alignItems: "center",
});

export const SignUpContainer = styled(HStack, {
  alignItems: "center",
  alignSelf: "center",
  gap: 8,
  paddingTop: 16,
});

// BUTTONS
export const ButtonsContainer = styled(VStack, {
  flexDirection: "column",
  gap: 16,
});

// TEXT STYLES
export const LinkText = styled(UILinkText, {
  fontSize: 14,
  fontWeight: "600",
  textDecorationLine: "underline",
});
