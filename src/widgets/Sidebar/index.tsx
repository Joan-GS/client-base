import { SidebarButton, SidebarContainer, SidebarIcon } from "./styles";
import { useState } from "react";
import { Href, router, usePathname } from "expo-router";

interface SidebarProps {
  tabs: { iconText: string; iconName: any; route: Href }[];
}

export const Sidebar = ({ tabs }: SidebarProps) => {
  const currentPath = usePathname();

  // Encuentra el índice del tab activo basándose en la ruta actual
  const selectedIndex = tabs.findIndex((tab) => tab.route === currentPath);

  const handlePress = (index: number, route: Href) => {
    if (currentPath !== route) {
      router.replace(route);
    }
  };

  return (
    <SidebarContainer>
      {tabs.map((item, index) => (
        <SidebarButton
          key={index}
          className="hover:bg-background-50"
          onPress={() => handlePress(index, item.route)}
          style={{
            backgroundColor:
              selectedIndex === index ? "#f0f0f0" : "transparent",
            borderRadius: selectedIndex === index ? 8 : 0,
          }}
        >
          <SidebarIcon
            as={item.iconName}
            style={{
              color: selectedIndex === index ? "#000" : "#888",
            }}
          />
        </SidebarButton>
      ))}
    </SidebarContainer>
  );
};
