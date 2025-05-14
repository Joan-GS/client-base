// styles.ts
import { styled } from "@gluestack-style/react";
import { VStack } from "@/src/components/ui/vstack";
import { View } from "@/src/components/ui/view";
import { Text as UIText } from "@/src/components/ui/text";

// Main vertical container
export const VStackContainer = styled(VStack, {
  flex: 1,
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
});

// Container for heading and subtitle
export const LoginTextsContainer = styled(View, {
  marginBottom: 20,
  width: "100%",
  alignItems: "center",
  gap: 8,
});

// Form field and button container
export const FormsContainer = styled(VStack, {
  width: "100%",
  gap: 16,
});
