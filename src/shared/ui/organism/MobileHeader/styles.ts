import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";

export const StyledHeaderContainer = styled(HStack, {
  paddingVertical: 24,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderColor: "#E5E7EB",
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  flexDirection: "row",
  gap: 12,
  top: 0,
  width: "100%",
  position: "absolute",
});
