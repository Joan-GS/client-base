import {
  Button,
  Icon,
  Box,
  Text,
  HStack,
  Image,
  Card,
  styled,
} from "@gluestack-ui/themed";
import React from "react";
import { ThumbsUp, MessageCircle } from "lucide-react-native";
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
}) => {
  const imageSrc = imageUrl || "https://via.placeholder.com/400";

  return (
    <StyledCard>
      <StyledImage source={{ uri: imageSrc }} alt="Imagen" />
      <StyledTitle>{title}</StyledTitle>
      {subtitle && <StyledText>{subtitle}</StyledText>}
      {description && <StyledText>{description}</StyledText>}
      <StyledFooter>
        <StyledIconButton>
          <Icon as={primaryIcon} style={{ marginRight: 8, color: "#4B8CFC" }} />
          <Text>{primaryActionCount}</Text>
        </StyledIconButton>
        <StyledIconButton>
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
