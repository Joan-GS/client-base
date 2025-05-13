import { styled } from "@gluestack-style/react";
import { SelectTrigger } from "@/src/components/ui/select";

// Custom styled trigger with variants
export const StyledSelectTrigger = styled(SelectTrigger, {
  justifyContent: "space-between",
  paddingRight: 6,
  borderColor: "$borderLight300",
  variants: {
    variant: {
      outline: {
        borderWidth: 1,
        borderColor: "$borderLight300",
        borderRadius: "$md",
        bg: "$backgroundLight0",
      },
      unstyled: {
        borderWidth: 0,
        bg: "transparent",
      },
    },
    size: {
      sm: { height: 36 },
      md: { height: 44 },
      lg: { height: 52 },
    },
  },

  defaultProps: {
    variant: "outline",
    size: "md",
  },
});
