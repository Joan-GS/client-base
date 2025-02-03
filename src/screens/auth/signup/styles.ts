import { styled } from "@gluestack-style/react";
import { VStack } from "@/src/components/ui/vstack";
import { View } from "@/src/components/ui/view";
import { HStack } from "@/src/components/ui/hstack";
import { Button as UIButton } from "@/src/components/ui/button";
import { LinkText as UILinkText } from "@/src/components/ui/link";
import { Pressable } from "@/src/components/ui/pressable";

// ------------ CONTAINERS ------------

// Main container with flex layout to center content
export const VStackContainer = styled(VStack, {
  display: "flex",
  flexDirection: "column",
  height: "100%",             
  width: "100%",
  justifyContent: "center",
  flex: 1,
});

// Container for the form, with space between elements
export const FormsContainer = styled(View, {
  gap: 20,
  width: "100%",
});

// Container for login/signup texts with centered alignment
export const LoginTextsContainer = styled(View, {
  paddingBottom: 32,
  alignItems: "center",
});

// Container for the "Sign Up" section with links like "Already have an account?"
export const SignUpContainer = styled(HStack, {
  alignItems: "center",
  alignSelf: "center",
  gap: 8,
  paddingTop: 16,
});

// ------------ BUTTONS ------------

// Main button style with full width, centered content, and rounded corners
export const Button = styled(UIButton, {
  width: "100%",
  height: 50,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
});

// ------------ TEXT STYLES ------------

// Link text style with underlined and medium weight text
export const LinkText = styled(UILinkText, {
  fontSize: 14,
  fontWeight: "600",
  textDecorationLine: "underline",
});

// Container for buttons like "Sign Up" and "Sign In" with space between them
export const ButtonsContainer = styled(VStack, {
  display: "flex",
  flexDirection: "column",
  gap: 16,
});