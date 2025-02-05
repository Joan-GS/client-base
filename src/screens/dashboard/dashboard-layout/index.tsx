import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { VStack } from "@/src/components/ui/vstack";
import ClimbingCard from "@/src/shared/ui/organism/Card/Card";
import { MobileFooter } from "@/src/widgets/MobileFooter";
import { MobileHeader } from "@/src/widgets/MobileHeader";
import { Sidebar } from "@/src/widgets/Sidebar";
import { WebHeader } from "@/src/widgets/WebHeader/WebHeader";
import { useMediaQuery } from "@gluestack-style/react";
import { Href } from "expo-router";
import { HomeIcon, UserIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface DashboardLayoutProps {
  title: string;
  isHeaderVisible: boolean;
  isSidebarVisible: boolean;
  children: React.ReactNode;
}

// Example component for main content
const MainContent = () => {
  return (
    <VStack
      style={{
        padding: 16,
        gap: 13,
        maxHeight: "100%", // Limita la altura máxima
        overflowY: "auto", // Scroll solo en vertical
      }}
    >
      <ClimbingCard
        imageUrl="aaa"
        name="Vía de Escalada A"
        grade="5.10a"
        avgRating={4.5}
        likes={120}
        comments={8}
      />
      <ClimbingCard
        imageUrl="aaa"
        name="Vía de Escalada B"
        grade="5.11b"
        avgRating={4.8}
        likes={180}
        comments={12}
      />
      <ClimbingCard
        imageUrl="aaa"
        name="Vía de Escalada B"
        grade="5.11b"
        avgRating={4.8}
        likes={180}
        comments={12}
      />
    </VStack>
  );
};

export const DashboardLayout = ({
  title,
  isSidebarVisible,
  isHeaderVisible,
  children,
}: DashboardLayoutProps) => {
  // State to manage sidebar visibility
  const [isSidebarVisibleState, setIsSidebarVisible] =
    useState(isSidebarVisible);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisibleState);

  // Check screen size to determine if it’s a mobile layout
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });

  const { t } = useTranslation(); // Translation hook

  // List of bottom navigation tabs
  const tabsList = [
    {
      iconText: t("Home"),
      iconName: () => <HomeIcon size={24} color="black" />,
      route: "/dashboard/dashboard-layout" as Href,
    },
    {
      iconText: t("Profile"),
      iconName: () => <UserIcon size={24} color="black" />,
      route: "/profile/profile" as Href,
    },
  ];

  return (
    <VStack className="h-full w-full bg-background-0">
      {/* Show mobile header on small screens */}
      {isMediumScreen && isHeaderVisible && (
        <Box className="md:hidden">
          <MobileHeader title={title} />
        </Box>
      )}

      {/* Show web header on larger screens */}
      <Box className="hidden md:flex">
        <WebHeader toggleSidebar={toggleSidebar} title={title} />
      </Box>

      {/* Main layout container */}
      <VStack className="h-full w-full">
        <HStack className="h-full w-full">
          {/* Sidebar for larger screens */}
          <Box className="hidden md:flex h-full">
            {isSidebarVisibleState && <Sidebar tabs={tabsList} />}
          </Box>

          {/* Main content area */}
          <VStack className="w-full">{children}</VStack>
        </HStack>
      </VStack>

      {/* Show mobile footer on small screens */}
      {isMediumScreen && <MobileFooter tabs={tabsList} />}
    </VStack>
  );
};

// Main Dashboard component that wraps DashboardLayout with SafeAreaView
export const Dashboard = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout
        title="Dashboard"
        isSidebarVisible={true}
        isHeaderVisible={true}
      >
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};
