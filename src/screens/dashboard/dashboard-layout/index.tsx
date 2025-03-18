import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { VStack } from "@/src/components/ui/vstack";
import GenericCard from "@/src/shared/ui/organism/Card/Card";
import { MobileFooter } from "@/src/widgets/MobileFooter";
import { MobileHeader } from "@/src/widgets/MobileHeader";
import { Sidebar } from "@/src/widgets/Sidebar";
import { WebHeader } from "@/src/widgets/WebHeader/WebHeader";
import { useMediaQuery } from "@gluestack-style/react";
import { Href } from "expo-router";
import {
  HomeIcon,
  MessageCircle,
  ThumbsUp,
  UserIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Climb, fetchClimbs, likeClimb, deleteLikeClimb } from "./api/climbs";

interface DashboardLayoutProps {
  title: string;
  isHeaderVisible: boolean;
  isSidebarVisible: boolean;
  children: React.ReactNode;
}

const MainContent = ({ climbs }: { climbs: Climb[] }) => {
  const [climbsState, setClimbsState] = useState<Climb[]>(climbs);

  const toggleLike = async (climbId: string, currentIsLiked: boolean) => {
    try {
      if (currentIsLiked) {
        await deleteLikeClimb(climbId);
      } else {
        await likeClimb(climbId);
      }

      setClimbsState((prevClimbs) =>
        prevClimbs.map((climb) =>
          climb.id === climbId
            ? {
                ...climb,
                isLiked: !currentIsLiked,
                likesCount: currentIsLiked
                  ? climb.likesCount - 1
                  : climb.likesCount + 1,
              }
            : climb
        )
      );
    } catch (error) {
      console.error("Error al actualizar like:", error);
    }
  };

  return (
    <VStack style={{ padding: 16, gap: 13, alignItems: "center",  overflowY: "auto",}}>
      {climbsState.length === 0 ? (
        <p>Cargando climbs...</p>
      ) : (
        climbsState.map((climb) => {
          return (
            <GenericCard
              key={climb.id}
              title={climb.title}
              subtitle={`Grado: ${climb.grade}`}
              description={`Descripción: ${climb.description}`}
              primaryActionCount={climb.likesCount}
              secondaryActionCount={climb.commentsCount}
              primaryIcon={ThumbsUp}
              secondaryIcon={MessageCircle}
              onPrimaryAction={() => toggleLike(climb.id, climb.isLiked)}
              onSecondaryAction={() => console.log("💬 Comentario abierto!")}
              isLiked={!!climb.isLiked}
            />
          );
        })
      )}
    </VStack>
  );
};

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

export const Dashboard = () => {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClimbs = async () => {
      try {
        const response = await fetchClimbs();
        if (response.climbs) setClimbs(response.climbs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando climbs");
      } finally {
        setLoading(false);
      }
    };

    loadClimbs();
  }, []);

  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout
        title="Dashboard"
        isSidebarVisible={true}
        isHeaderVisible={true}
      >
        {loading ? (
          <p>Cargando climbs...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <MainContent climbs={climbs} />
        )}
      </DashboardLayout>
    </SafeAreaView>
  );
};
