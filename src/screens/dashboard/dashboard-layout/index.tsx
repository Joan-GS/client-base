import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { VStack } from "@/src/components/ui/vstack";
import { MobileFooter } from "@/src/shared/ui/organism/MobileFooter";
import { MobileHeader } from "@/src/shared/ui/organism/MobileHeader";
import { Sidebar } from "@/src/shared/ui/organism/Sidebar/Sidebar";
import { WebHeader } from "@/src/shared/ui/organism/WebHeader/WebHeader";
import { useMediaQuery } from "@gluestack-style/react";
import { Href } from "expo-router";
import {
  Camera,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  InboxIcon,
} from "lucide-react-native";
import { useState } from "react";

interface DashboardLayoutProps {
  title: string;
  isSidebarVisible: boolean;
  children: React.ReactNode;
}

// Ejemplo de definición de MainContent
const MainContent = () => {
  return (
    <VStack className="p-4">
      {/* El contenido de tu dashboard va aquí */}
    </VStack>
  );
};

// Ejemplo de definición de bottomTabsList
const bottomTabsList = [
  {
    iconText: "Home",
    iconName: () => <HomeIcon size={24} color="black" />,
    route: "/dashboard/dashboard-layout" as Href,
  },
  {
    iconText: "Community",
    iconName: () => <GlobeIcon size={24} color="black" />,
    route: "" as Href,
  },
  {
    iconText: "Inbox",
    iconName: () => <InboxIcon size={24} color="black" />,
    route: "/dashboard/dashboard-layout" as Href,
  },
  {
    iconText: "Favourite",
    iconName: () => <HeartIcon size={24} color="black" />,
    route: "/dashboard/dashboard-layout" as Href,
  },

  // { iconText: 'Profile', iconName: ProfileIcon },
];

export const DashboardLayout = ({
  title,
  isSidebarVisible,
  children,
}: DashboardLayoutProps) => {
  const [isSidebarVisibleState, setIsSidebarVisible] =
    useState(isSidebarVisible);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisibleState);

  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 }); // Moverlo dentro del componente

  return (
    <VStack className="h-full w-full bg-background-0">
      {isMediumScreen && (
        <Box className="md:hidden">
          <MobileHeader title={title} />
        </Box>
      )}

      <Box className="hidden md:flex">
        <WebHeader toggleSidebar={toggleSidebar} title={title} />
      </Box>
      <VStack className="h-full w-full">
        <HStack className="h-full w-full">
          <Box className="hidden md:flex h-full">
            {isSidebarVisibleState && <Sidebar />}
          </Box>
          <VStack className="w-full">{children}</VStack>
        </HStack>
      </VStack>
      {isMediumScreen && <MobileFooter footerIcons={bottomTabsList} />}
    </VStack>
  );
};

export const Dashboard = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title="Dashboard" isSidebarVisible={false}>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};
