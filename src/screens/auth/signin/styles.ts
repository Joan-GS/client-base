import { styled } from "@gluestack-style/react";
import { Button as UIButton } from "@/src/components/ui/button";
import { LinkText as UILinkText } from "@/src/components/ui/link";
import { View } from "@/src/components/ui/view";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
// import { Image } from "@/src/components/ui/image";

// ------------ CONTAINERS ------------

// Main container with a left background
export const LoginWithLeftBackgroundContainer = styled(View, {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  flex: 1,
});

// Text container (centered)
export const LoginTextsContainer = styled(View, {
  paddingBottom: 32,
  alignItems: "center",
});

// Form container
export const FormsContainer = styled(View, {
  gap: 20,
  width: "100%",
});

// ------------ HORIZONTAL STACKS (HStack) ------------

// Container for options (aligning checkbox and links)
export const HStackContainer = styled(HStack, {
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

// Secondary container for centered links and other options
export const SignUpContainer = styled(HStack, {
  alignItems: "center",
  alignSelf: "center",
  gap: 8,
  paddingTop: 16,
});

// ------------ VERTICAL STACKS (VStack) ------------

// Container for buttons and additional options
export const VStackContainer = styled(VStack, {
  marginTop: 24,
  gap: 16,
});

// ------------ BUTTONS ------------

// Button style
export const Button = styled(UIButton, {
  width: "100%",
  height: 50,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
});

// ------------ TEXT STYLES ------------

// Link text styles
export const LinkText = styled(UILinkText, {
  fontSize: 14, // Equivalent to text-sm
  fontWeight: "600", // Equivalent to font-medium
  textDecorationLine: "underline", // Adds underline to text
});

// ------------ LOGO IMAGE ------------

// Style for the logo image
// export const LogoImage = styled(Image, {
//   width: 100, // Logo size
//   height: 100, // Maintain image proportions
//   display: "flex", // Ensure the image is displayed
//   alignSelf: "center", // Center the image
//   paddingBottom: 10, // Adjust top position
// });

