import { Href, router, usePathname } from "expo-router";
import {
  FooterContainer,
  FooterButton,
  FooterIcon,
  FooterText,
} from "./styles";
import React, { useState } from "react";

interface MobileFooterProps {
  footerIcons: { iconText: string; iconName: any; route: Href }[];
}

export const MobileFooter = ({ footerIcons }: MobileFooterProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const currentPath = usePathname();

  const handlePress = (index: number, route: Href) => {
    if (currentPath !== route) {
      setSelectedIndex(index);
      router.push(route);
    }
  };

  return (
    <FooterContainer>
      {footerIcons.map((item, index) => (
        <FooterButton
          key={index}
          onPress={() => handlePress(index, item.route)}
          style={{
            backgroundColor: selectedIndex === index ? "#f0f0f0" : "transparent",
            borderRadius: selectedIndex === index ? 8 : 0,
          }}
        >
          <FooterIcon
            as={item.iconName}
            style={{
              color: selectedIndex === index ? "#000" : "none",
            }}
          />
          <FooterText>{item.iconText}</FooterText>
        </FooterButton>
      ))}
    </FooterContainer>
  );
};
