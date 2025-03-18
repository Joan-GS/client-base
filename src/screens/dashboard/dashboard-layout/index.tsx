import { useEffect, useState } from "react";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@gluestack-style/react";
import { Href } from "expo-router";
import {
  HomeIcon,
  MessageCircle,
  ThumbsUp,
  UserIcon,
} from "lucide-react-native";
import { fetchClimbs, toggleLikeClimb, Climb } from "./api/climbs";
import GenericCard from "@/src/shared/ui/organism/Card/Card";
import { MobileFooter } from "@/src/widgets/MobileFooter";
import { MobileHeader } from "@/src/widgets/MobileHeader";
import { Sidebar } from "@/src/widgets/Sidebar";
import { WebHeader } from "@/src/widgets/WebHeader/WebHeader";
import { Box, ScrollView } from "@gluestack-ui/themed";

interface DashboardLayoutProps {
  title: string;
  isSidebarVisible?: boolean;
  isHeaderVisible?: boolean;
  children: React.ReactNode;
}

export const DashboardLayout = ({
  title,
  isSidebarVisible,
  isHeaderVisible,
  children,
}: DashboardLayoutProps) => {
  const [isSidebarVisibleState, setIsSidebarVisible] =
    useState(isSidebarVisible);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisibleState);
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });
  const { t } = useTranslation();

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
      {isMediumScreen && isHeaderVisible && (
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
            {isSidebarVisibleState && <Sidebar tabs={tabsList} />}
          </Box>
          <VStack className="w-full">{children}</VStack>
        </HStack>
      </VStack>
      {isMediumScreen && <MobileFooter tabs={tabsList} />}
    </VStack>
  );
};

const MainContent = ({ climbs }: { climbs: Climb[] }) => {
  const { t } = useTranslation();
  const [climbsState, setClimbsState] = useState<Climb[]>(climbs);

  const handleToggleLike = async (climbId: string, isLiked: boolean) => {
    setClimbsState((prevClimbs) =>
      prevClimbs.map((climb) =>
        climb.id === climbId
          ? {
              ...climb,
              isLiked: !isLiked,
              likesCount: isLiked ? climb.likesCount - 1 : climb.likesCount + 1,
            }
          : climb
      )
    );

    try {
      await toggleLikeClimb(climbId, isLiked);
    } catch (error) {
      console.error("Error updating like:", error);

      setClimbsState((prevClimbs) =>
        prevClimbs.map((climb) =>
          climb.id === climbId
            ? {
                ...climb,
                isLiked: isLiked,
                likesCount: isLiked
                  ? climb.likesCount + 1
                  : climb.likesCount - 1,
              }
            : climb
        )
      );
    }
  };

  if (climbsState.length === 0) return <Text>{t("No climbs available")}</Text>;

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, alignItems: "center", gap: 20 }}
    >
      {climbsState.map((climb) => (
        <GenericCard
          key={climb.id}
          title={climb.title}
          subtitle={`Grade: ${climb.grade}`}
          description={climb.description || ""}
          primaryActionCount={climb.likesCount}
          secondaryActionCount={climb.commentsCount}
          primaryIcon={ThumbsUp}
          secondaryIcon={MessageCircle}
          onPrimaryAction={() => handleToggleLike(climb.id, climb.isLiked)}
          onSecondaryAction={() => console.log("💬 Open comment!")}
          isLiked={climb.isLiked}
        />
      ))}
    </ScrollView>
  );
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClimbs = async () => {
      try {
        const response = await fetchClimbs();
        setClimbs(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading climbs");
      } finally {
        setLoading(false);
      }
    };
    loadClimbs();
  }, []);

  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title="Dashboard">
        {loading ? (
          <Text>{t("Loading climbs...")}</Text>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <MainContent climbs={climbs} />
        )}
      </DashboardLayout>
    </SafeAreaView>
  );
};
