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
import { ThumbsUp, MessageCircle } from "lucide-react-native"; // Importando iconos de lucide-react-native
import {
  StyledCard,
  StyledImageContainer,
  StyledTextContainer,
  StyledName,
  StyledGrade,
  StyledAvgRating,
  StyledFooterContainer,
  StyledIconContainer,
  StyledButton,
} from "./styles";

interface ClimbingCardProps {
  imageUrl?: string;
  name: string;
  grade: string;
  avgRating: number;
  likes: number;
  comments: number;
}

const ClimbingCard: React.FC<ClimbingCardProps> = ({
  imageUrl,
  name,
  grade,
  avgRating,
  likes,
  comments,
}) => {
  const imageSrc = imageUrl || "https://via.placeholder.com/400"; // Usa una URL predeterminada si imageUrl es undefined

  return (
    <StyledCard>
      <StyledImageContainer>
        <Image
          source={{ uri: imageSrc }} // Usamos la propiedad `uri` correctamente
          alt="Imagen de la vía de escalada"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </StyledImageContainer>

      <StyledTextContainer>
        <StyledName>{name}</StyledName>
        <StyledGrade>Grado: {grade}</StyledGrade>
        <StyledAvgRating>
          Promedio de calificación: {avgRating} / 5
        </StyledAvgRating>
      </StyledTextContainer>

      <StyledFooterContainer>
        <StyledIconContainer>
          <StyledButton aria-label="Like">
            <Icon as={ThumbsUp} style={{ marginRight: 8, color: "#4B8CFC" }} />
            <Text>{likes}</Text>
          </StyledButton>
        </StyledIconContainer>

        <StyledIconContainer>
          <StyledButton aria-label="Comentario">
            <Icon
              as={MessageCircle}
              style={{ marginRight: 8, color: "#4B8CFC" }}
            />
            <Text>{comments}</Text>
          </StyledButton>
        </StyledIconContainer>
      </StyledFooterContainer>
    </StyledCard>
  );
};

export default ClimbingCard;
