import React from "react";
import {
  SafeAreaContainer,
  ScrollViewContainer,
  LayoutContainer,
  ImageContainer,
  BackgroundImage,
  ContentContainer,
} from "./styles";
import { useMediaQuery } from "@gluestack-style/react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [isMediumScreen] = useMediaQuery({ minWidth: 768 }); // Check if screen width is medium or larger

  return (
    <SafeAreaContainer>
      <ScrollViewContainer contentContainerStyle={{ flexGrow: 1 }}>
        <LayoutContainer>
          {isMediumScreen && (
            <ImageContainer>
              <BackgroundImage
                source={require("@/src/assets/auth/radialGradient.png")}
                alt="Radial Gradient" 
              />
            </ImageContainer>
          )}

          <ContentContainer>{children}</ContentContainer>
        </LayoutContainer>
      </ScrollViewContainer>
    </SafeAreaContainer>
  );
};
