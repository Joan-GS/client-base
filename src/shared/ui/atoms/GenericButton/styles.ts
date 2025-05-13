import { styled } from "@gluestack-style/react";
import { Button as UIButton } from "@/src/components/ui/button";
import { Text as UIButtonText } from "@/src/components/ui/text";

export const StyledButton = styled(UIButton, {
  width: "$full",
  height: 50,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,

  variants: {
    variant: {
      primary: {
        bg: "$neutral10",
      },
      secondary: {
        bg: "$secondary500",
      },
      outline: {
        borderWidth: 1,
        borderColor: "$primary500",
        bg: "transparent",
      },
    },
  },

  defaultProps: {
    variant: "primary",
  },
} as const);

export const StyledButtonText = styled(UIButtonText, {
  fontWeight: "$medium",
  textAlign: "center",

  variants: {
    variant: {
      primary: {
        color: "$white",
      },
      secondary: {
        color: "$white",
      },
      outline: {
        color: "$primary500",
      },
    },
  },

  defaultProps: {
    variant: "primary",
  },
} as const);
