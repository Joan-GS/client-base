import { SidebarButton, SidebarContainer, SidebarIcon } from "./styles";
import { useState } from "react";
import { Href, router } from "expo-router";

interface SidebarProps {
  tabs: { iconText: string; iconName: any; route: Href }[];
}

export const Sidebar = ({ tabs }: SidebarProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePress = (index: number) => {
    setSelectedIndex(index);
    router.push("/dashboard/dashboard-layout");
  };

  return (
    <SidebarContainer>
      {tabs.map((item, index) => (
        <SidebarButton
          key={index}
          className="hover:bg-background-50"
          onPress={() => handlePress(index)}
        >
          <SidebarIcon
            as={item.iconName}
            className={index === selectedIndex ? "selected" : ""}
          />
        </SidebarButton>
      ))}
    </SidebarContainer>
  );
};
