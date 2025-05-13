// styles.ts

import { styled } from "@gluestack-style/react";
import { VStack } from "@/src/components/ui/vstack";
import { View } from "@/src/components/ui/view";
import { Text as UIText } from "@/src/components/ui/text";

// Contenedor principal centrado
export const VStackContainer = styled(VStack, {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
  width: "100%",
});

// Contenedor del mensaje y botón
export const MessageContainer = styled(View, {
  gap: 20,
  width: "100%",
  alignItems: "center",
});

// Título principal (ej. "Account Verified")
export const HeadingText = styled(UIText, {
  fontSize: 22,
  fontWeight: "bold",
  textAlign: "center",
});

// Texto de cuerpo (descripciones, mensajes)
export const BodyText = styled(UIText, {
  fontSize: 16,
  color: "#666",
  textAlign: "center",
});

// Texto para mensajes positivos (como éxito)
export const SuccessText = styled(UIText, {
  fontSize: 16,
  color: "green",
  fontWeight: "bold",
  textAlign: "center",
});
