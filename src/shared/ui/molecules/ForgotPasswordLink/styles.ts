import { styled } from "@gluestack-style/react";
import { LinkText } from "@/src/components/ui/link";

export const ForgotPasswordText = styled(LinkText, {
  fontSize: 14,
  fontWeight: "600",
  color: "$primary700",
  textDecorationLine: "underline",
});
