// Importaciones de componentes y módulos
import { styled } from "@gluestack-style/react";
import { Button as UIButton } from "@/src/components/ui/button";
import { LinkText as UILinkText } from "@/src/components/ui/link";
import { View } from "@/src/components/ui/view";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import { Image } from "@/src/components/ui/image";

// ------------ CONTAINERS ------------

// Contenedor principal con fondo izquierdo
export const LoginWithLeftBackgroundContainer = styled(View, {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  justifyContent: "center",
  flex: 1,
});

// Contenedor de textos (centrado)
export const LoginTextsContainer = styled(View, {
  marginBottom: 32,
  alignItems: "center",
});

// Contenedor del formulario
export const FormsContainer = styled(View, {
  gap: 20,
  width: "100%",
});

// ------------ HORIZONTAL STACKS (HStack) ------------

// Contenedor de opciones con alineación entre checkbox y links
export const HStackContainer = styled(HStack, {
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

// Contenedor secundario para enlaces y otras opciones centradas
export const SignUpContainer = styled(HStack, {
  alignItems: "center",
  alignSelf: "center",
  gap: 8,
  paddingTop: 16,
});

// ------------ VERTICAL STACKS (VStack) ------------

// Contenedor de botones y opciones adicionales
export const VStackContainer = styled(VStack, {
  marginTop: 24,
  gap: 16,
});

// ------------ BUTTONS ------------

// Estilo para el botón
export const Button = styled(UIButton, {
  width: "100%",
  height: 50,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
});

// ------------ TEXT STYLES ------------

// Estilos para el texto del link
export const LinkText = styled(UILinkText, {
  fontSize: 14, // Corresponde a text-sm
  fontWeight: "600", // Corresponde a font-medium
  textDecorationLine: "underline", // Para subrayado
});


// ------------ LOGO IMAGE ------------

// Estilo para la imagen del logo
// export const LogoImage = styled(Image, {
//   width: 100, // Tamaño del logo
//   height: 100, // Mantener la proporción de la imagen
//   display: "flex", // Mostrar la imagen
//   alignSelf: "center", // Centrar la imagen
//   paddingBottom: 10, // Posición superior
// });