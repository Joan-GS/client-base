import { StyledButton, StyledButtonText } from "./styles";
import { ButtonIcon } from "@/src/components/ui/button";
import { ElementType } from "react";

type Props = {
  label: string;
  onPress: () => void;
  icon?: ElementType;
  variant?: any;
  [key: string]: any;
};

export const GenericButton = ({
  label,
  onPress,
  icon,
  variant = "primary",
  ...props
}: Props) => (
  <StyledButton
    onPress={onPress}
    variant={variant}
    {...props}
  >
    <StyledButtonText variant={variant}>{label}</StyledButtonText>
    {icon && <ButtonIcon as={icon} />}
  </StyledButton>
);
