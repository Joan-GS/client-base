import {
  Button,
  Text,
  HStack,
  Image,
  Card,
  styled,
} from "@gluestack-ui/themed";

export const StyledCard = styled(Card, {
  width: "100%",
  flexDirection: "column",
  padding: 16,
  borderWidth: 1,
  borderColor: "#E5E5E5",
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
  backgroundColor: "#fff",
});

export const StyledImage = styled(Image, {
  width: "100%",
  height: 420,
  borderRadius: 8,
  resizeMode: "cover",
});

export const StyledTitle = styled(Text, {
  fontWeight: "bold",
  fontSize: 18,
  marginTop: 8,
});

export const StyledText = styled(Text, {
  fontSize: 14,
  color: "#666",
  marginTop: 4,
});

export const StyledFooter = styled(HStack, {
  flexDirection: "row",
  marginTop: 12,
  justifyContent: "space-around",
  alignItems: "center",
});

export const StyledIconButton = styled(Button, {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "transparent",
  padding: 8,
  borderRadius: 8,
});

