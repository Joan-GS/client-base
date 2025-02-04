import { Pressable } from "@/src/components/ui/pressable";
import { Icon } from "@/src/components/ui/icon";
import { useState } from "react";
import { VStack } from "@/src/components/ui/vstack";
import { GlobeIcon, HeartIcon, HomeIcon, InboxIcon } from "lucide-react-native";

const list = [
  { iconName: HomeIcon },
  { iconName: InboxIcon },
  { iconName: GlobeIcon },
  { iconName: HeartIcon },
];

export const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePress = (index: number) => {
    setSelectedIndex(index);
    // router.push("/dashboard/dashboard-layout");
  };

  return (
    <VStack className="w-14 pt-5 h-full items-center border-r border-border-300" space="xl">
      {list.map((item, index) => (
        <Pressable key={index} className="hover:bg-background-50" onPress={() => handlePress(index)}>
          <Icon
            as={item.iconName}
            className={`w-[55px] h-9 stroke-background-800 ${index === selectedIndex ? "fill-background-800" : "fill-none"}`}
          />
        </Pressable>
      ))}
    </VStack>
  );
};
