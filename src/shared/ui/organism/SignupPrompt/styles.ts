import { styled } from "@gluestack-style/react";
import { HStack } from "@/src/components/ui/hstack";
import { LinkText } from "@/src/components/ui/link";

export const PromptContainer = styled(HStack, {
  alignItems: "center",
  alignSelf: "center",
  gap: 8,
  paddingTop: 16,
});

export const PromptLinkText = styled(LinkText, {
  fontSize: 14,
  fontWeight: "600",
  color: "$primary700",
  textDecorationLine: "underline",
});
