import { Href, router, usePathname } from "expo-router";
import {
  FooterContainer,
  FooterButton,
  FooterIcon,
  FooterText,
} from "./styles";
import React from "react";

interface MobileFooterProps {
  tabs: { iconText: string; iconName: any; route: Href }[];
}

export const MobileFooter = ({ tabs }: MobileFooterProps) => {
  const currentPath = usePathname();

  // Encuentra el índice del tab activo basándose en la ruta actual
  const selectedIndex = tabs.findIndex((tab) => tab.route === currentPath);

  const handlePress = (index: number, route: Href) => {
    if (currentPath !== route) {
      router.replace(route);
    }
  };

  return (
    <FooterContainer>
      {tabs.map((item, index) => (
        <FooterButton
          key={index}
          onPress={() => handlePress(index, item.route)}
          style={{
            backgroundColor:
              selectedIndex === index ? "#f0f0f0" : "transparent",
            borderRadius: selectedIndex === index ? 8 : 0,
          }}
        >
          <FooterIcon
            as={item.iconName}
            style={{
              color: selectedIndex === index ? "#000" : "#888",
            }}
          />
          <FooterText>{item.iconText}</FooterText>
        </FooterButton>
      ))}
    </FooterContainer>
  );
};
