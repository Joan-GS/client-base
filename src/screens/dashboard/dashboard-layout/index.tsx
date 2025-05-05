import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@gluestack-style/react";
import { Href, useRouter } from "expo-router";
import {
  HomeIcon,
  MessageCircle,
  Plus,
  Search,
  ThumbsUp,
  UserIcon,
} from "lucide-react-native";
import { fetchClimbs, toggleLikeClimb, Climb } from "./api/climbs";
import GenericCard from "@/src/shared/ui/organism/Card/Card";
import { MobileFooter } from "@/src/widgets/MobileFooter";
import { MobileHeader } from "@/src/widgets/MobileHeader";
import { Sidebar } from "@/src/widgets/Sidebar";
import { WebHeader } from "@/src/widgets/WebHeader/WebHeader";
import { Box, ScrollView, Spinner } from "@gluestack-ui/themed";

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
      iconText: t("Search"),
      iconName: () => <Search size={24} color="black" />,
      route: "/search/search" as Href,
    },
    {
      iconText: t("Create"),
      iconName: () => <Plus size={24} color="black" />,
      route: "/create-climbs/create-climbs" as Href,
    },
    {
      iconText: t("Profile"),
      iconName: () => <UserIcon size={24} color="black" />,
      route: "/profile/profile" as Href,
    },
  ];

  return (
    <VStack className="h-full w-full bg-background-0">
      {/* Show Mobile Header only on small screens */}
      {isMediumScreen && isHeaderVisible && (
        <Box className="md:hidden">
          <MobileHeader title={title} />
        </Box>
      )}

      {/* Show Web Header only on large screens */}
      {!isMediumScreen && (
        <Box>
          <WebHeader toggleSidebar={toggleSidebar} title={title} />
        </Box>
      )}

      <VStack className="h-full w-full">
        <HStack className="h-full w-full">
          {/* Show Sidebar only on large screens */}
          {!isMediumScreen && isSidebarVisibleState && (
            <Box className="hidden md:flex h-full">
              <Sidebar tabs={tabsList} />
            </Box>
          )}

          <VStack className="w-full">{children}</VStack>
        </HStack>
      </VStack>

      {/* Show Mobile Footer only on small screens */}
      {isMediumScreen && <MobileFooter tabs={tabsList} />}
    </VStack>
  );
};

const ITEMS_PER_PAGE = 3;

const MainContent = () => {
  const { t } = useTranslation();
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadClimbs();
  }, []);

  const loadClimbs = async () => {
    if (!hasMore) return;

    try {
      const response = await fetchClimbs(page, ITEMS_PER_PAGE);
      const newClimbs = response.data || [];

      setClimbs((prev) => [...prev, ...newClimbs]);
      setHasMore(newClimbs.length === ITEMS_PER_PAGE);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading climbs:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    loadClimbs();
  };

  const handleToggleLike = async (climbId: string, isLiked: boolean) => {
    setClimbs((prevClimbs) =>
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
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        gap: 20,
        paddingVertical: 20,
      }}
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - 50
        ) {
          handleLoadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      {climbs.length === 0 ? (
        <Text>{t("No climbs available")}</Text>
      ) : (
        climbs.map((climb) => (
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
            imageUrl={climb.imageUrl || "https://placehold.co/600x400"}
            maxWidth={425}
            onPress={() =>
              router.navigate({
                pathname: `/view-climb/view-climb`,
                params: { climbId: climb.id },
              })
            }
          />
        ))
      )}

      {isFetchingMore && <Spinner size="large" color="black" />}
    </ScrollView>
  );
};

export const Dashboard = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title="Dashboard">
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};
