import { Icon, Text } from "@gluestack-ui/themed";
import React from "react";
import {
  StyledCard,
  StyledFooter,
  StyledIconButton,
  StyledImage,
  StyledText,
  StyledTitle,
} from "./styles";

interface GenericCardProps {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryActionCount: number;
  secondaryActionCount: number;
  primaryIcon: React.ElementType;
  secondaryIcon: React.ElementType;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  isLiked?: boolean; // ✅ Nueva prop
}

const GenericCard: React.FC<GenericCardProps> = ({
  imageUrl,
  title,
  subtitle,
  description,
  primaryActionCount,
  secondaryActionCount,
  primaryIcon,
  secondaryIcon,
  onPrimaryAction,
  onSecondaryAction,
  isLiked, // ✅ Se usa para cambiar el color
}) => {
  const imageSrc = imageUrl || "https://placehold.co/600x400";

  return (
    <StyledCard>
      <StyledImage source={{ uri: imageSrc }} alt="Imagen" />
      <StyledTitle>{title}</StyledTitle>
      {subtitle && <StyledText>{subtitle}</StyledText>}
      {description && <StyledText>{description}</StyledText>}
      <StyledFooter>
        <StyledIconButton
          onPress={onPrimaryAction}
          style={{
            backgroundColor: isLiked ? "#4B8CFC" : "transparent",
            borderRadius: 8,
            padding: 6,
          }}
        >
          <Icon
            as={primaryIcon}
            style={{
              marginRight: 8,
              color: isLiked ? "#FFF" : "#4B8CFC",
            }}
          />
          <Text style={{ color: isLiked ? "#FFF" : "#000" }}>
            {primaryActionCount}
          </Text>
        </StyledIconButton>
        <StyledIconButton onPress={onSecondaryAction}>
          <Icon
            as={secondaryIcon}
            style={{ marginRight: 8, color: "#4B8CFC" }}
          />
          <Text>{secondaryActionCount}</Text>
        </StyledIconButton>
      </StyledFooter>
    </StyledCard>
  );
};

export default GenericCard;
