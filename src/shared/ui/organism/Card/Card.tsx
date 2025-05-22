import { Icon, Pressable, Text } from "@gluestack-ui/themed";
import React from "react";
import {
  StyledCard,
  StyledFooter,
  StyledIconButton,
  StyledImage,
  StyledText,
  StyledTitle,
} from "./styles";
import { Heart } from "lucide-react-native";

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
  isLiked?: boolean;
  onPress?: () => void;
  [key: string]: any;
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
  isLiked,
  onPress,
  ...props
}) => {
  const imageSrc = imageUrl || "https://placehold.co/600x400";

  return (
    <StyledCard {...props}>
      <Pressable onPress={onPress}>
        <StyledImage source={{ uri: imageSrc }} alt="Imagen" />
        <StyledTitle>{title}</StyledTitle>
        {subtitle && <StyledText>{subtitle}</StyledText>}
        {description && <StyledText>{description}</StyledText>}
        <StyledFooter>
          <StyledIconButton onPress={onPrimaryAction}>
            <Heart
              fill={isLiked ? "#ef4444" : "transparent"}
              color={isLiked ? "#ef4444" : "#9ca3af"}
                style={{
                marginRight: 8,
              }}
            />
            <Text>{primaryActionCount}</Text>
          </StyledIconButton>
          <StyledIconButton onPress={onSecondaryAction}>
            <Icon
              as={secondaryIcon}
              style={{ marginRight: 8, color: "black" }}
            />
            <Text>{secondaryActionCount}</Text>
          </StyledIconButton>
        </StyledFooter>
      </Pressable>
    </StyledCard>
  );
};

export default GenericCard;
