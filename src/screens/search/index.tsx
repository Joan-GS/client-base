import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/src/components/ui/icon";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import {
  MainContainer,
  SearchHeader,
  SearchInputContainer,
  TabsContainer,
  ContentScrollView,
  EmptyState,
  EmptyStateText,
  ClimbItem,
  ClimbTitle,
  ClimbGrade,
  TagContainer,
  TagBadge,
  StatsContainer,
  StatItem,
  StatText,
  ClimbRow,
  FilterButtonContainer,
} from "./styles";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/src/components/ui/input";
import {
  fetchClimbs,
  Climb,
  toggleLikeClimb,
  fetchUsers,
  followUser,
  unfollowUser,
} from "./api/search";
import { FilterIcon, Heart, Star } from "lucide-react-native";
import { Button, HStack, Pressable, VStack } from "@gluestack-ui/themed";
import { CLIMBING_GRADE, User } from "@joan16/shared-base";
import { useRouter } from "expo-router";
import { useRecoilValue } from "recoil";
import { userState } from "@/src/recoil/users.recoil";
import { Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/src/components/ui/slider";
import { Box } from "@/src/components/ui/box";


type SearchTab = "climbs" | "users";
type UserWithFollowStatus = User & { isFollowing?: boolean };

const TabsBar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: SearchTab;
  setActiveTab: (tab: SearchTab) => void;
}) => {
  const { t } = useTranslation();
  const tabs = [
    { key: "climbs" as const, title: t("Climbs") },
    { key: "users" as const, title: t("Users") },
  ];

  return (
    <HStack style={{ flexDirection: "row", width: "100%" }}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          style={{
            borderBottomWidth: 3,
            borderColor: activeTab === tab.key ? "#0f172a" : "transparent",
            flex: 1,
          }}
        >
          <Text
            style={{
              color: activeTab === tab.key ? "#0f172a" : "#6b7280",
              fontWeight: "600",
              fontSize: 14,
              textTransform: "capitalize",
              alignSelf: "center",
            }}
          >
            {tab.title}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};

const MainContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentUser = useRecoilValue(userState);

  // State management
  const [activeTab, setActiveTab] = useState<SearchTab>("climbs");
  const [searchQuery, setSearchQuery] = useState("");
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [users, setUsers] = useState<UserWithFollowStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Bottom sheet ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Constants
  const GRADES = Object.values(CLIMBING_GRADE);
  const pageSize = 10;

  // Filter state
  const [minGradeIndex, setMinGradeIndex] = useState(0);
  const [maxGradeIndex, setMaxGradeIndex] = useState(GRADES.length - 1);

  // Bottom sheet handlers
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  // Navigation handlers
  const handleUserPress = (userId: string) => {
    router.push({ pathname: `/profile/profile`, params: { userId } });
  };

  const handleClimbPress = (climbId: string) => {
    router.push({ pathname: `/view-climb/view-climb`, params: { climbId } });
  };

  // Data fetching
  const triggerSearch = useCallback(
    (reset = true) => {
      if (reset) {
        setPage(1);
        setHasMore(true);
        activeTab === "climbs" ? setClimbs([]) : setUsers([]);
      }

      if (activeTab === "climbs") {
        loadClimbs(reset);
      } else {
        loadUsers(reset);
      }
    },
    [activeTab, searchQuery, minGradeIndex, maxGradeIndex]
  );

  const loadClimbs = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const response = await fetchClimbs(
          currentPage,
          pageSize,
          searchQuery || undefined
        );

        setClimbs((prev) =>
          reset ? response.data || [] : [...prev, ...(response.data || [])]
        );
        setPage((prev) => (reset ? 2 : prev + 1));
        setHasMore((response.data?.length || 0) >= pageSize);
      } catch (error) {
        console.error("Error loading climbs:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page, hasMore, minGradeIndex, maxGradeIndex]
  );

  const loadUsers = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const response = await fetchUsers(
          currentPage,
          pageSize,
          searchQuery || undefined
        );

        setUsers((prev) =>
          reset ? response.data || [] : [...prev, ...(response.data || [])]
        );
        setPage((prev) => (reset ? 2 : prev + 1));
        setHasMore((response.data?.length || 0) >= pageSize);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page, hasMore]
  );

  // Event handlers
  const handleEndReached = () => {
    if (!loading && hasMore) {
      activeTab === "climbs" ? loadClimbs() : loadUsers();
    }
  };

  const handleSearchPress = () => {
    triggerSearch(true);
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Enter") {
      handleSearchPress();
    }
  };

  const handleToggleLike = async (climbId: string, isLiked: boolean) => {
    try {
      await toggleLikeClimb(climbId, isLiked);
      setClimbs((prev) =>
        prev.map((climb) =>
          climb.id === climbId
            ? {
                ...climb,
                isLiked: !isLiked,
                likesCount: isLiked
                  ? climb.likesCount - 1
                  : climb.likesCount + 1,
              }
            : climb
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: true } : user
        )
      );
      await followUser(targetUserId);
    } catch (error) {
      console.error("Error following user:", error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: false } : user
        )
      );
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: false } : user
        )
      );
      await unfollowUser(targetUserId);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === targetUserId ? { ...user, isFollowing: true } : user
        )
      );
    }
  };

  const applyFilters = () => {
    handleCloseModalPress();
    triggerSearch(true);
  };

  // Effects
  useEffect(() => {
    triggerSearch(true);
  }, [activeTab]);

  // Render functions
  const renderClimbs = () => {
    if (climbs.length === 0) {
      return (
        <EmptyState>
          <EmptyStateText>
            {searchQuery
              ? t("No climbs match your search")
              : t("No climbs available")}
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <>
        {climbs.map((climb) => (
          <ClimbItem key={climb.id} onPress={() =>handleClimbPress(climb.id)}>
            <ClimbRow>
              <ClimbTitle>{climb.title}</ClimbTitle>
              <ClimbGrade>{climb.grade}</ClimbGrade>
            </ClimbRow>

            <StatsContainer>
              {climb.tags?.length > 0 && (
                <TagContainer>
                  {climb.tags.map((tag, i) => (
                    <TagBadge key={i}>{tag}</TagBadge>
                  ))}
                </TagContainer>
              )}

              <HStack style={{ flexDirection: "row" }}>
                <StatItem>
                  <VStack style={{ alignItems: "center" }}>
                    <Star size={20} color="#f59e0b" />
                    <StatText>
                      {climb.ratingAverage?.toFixed(1) || "0.0"}
                    </StatText>
                  </VStack>
                </StatItem>
                <StatItem>
                  <Pressable
                    onPress={() => handleToggleLike(climb.id, climb.isLiked)}
                  >
                    <VStack style={{ alignItems: "center" }}>
                      <Heart
                        size={20}
                        fill={climb.isLiked ? "#ef4444" : "transparent"}
                        color={climb.isLiked ? "#ef4444" : "#9ca3af"}
                      />
                      <StatText>{climb.likesCount}</StatText>
                    </VStack>
                  </Pressable>
                </StatItem>
              </HStack>
            </StatsContainer>
          </ClimbItem>
        ))}
        {loading && page > 1 && (
          <EmptyState>
            <EmptyStateText>{t("Loading more climbs...")}</EmptyStateText>
          </EmptyState>
        )}
      </>
    );
  };

  const renderUsers = () => {
    if (users.length === 0) {
      return (
        <EmptyState>
          <EmptyStateText>
            {searchQuery ? t("No users found") : t("Search for users")}
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <>
        {users.map((user) => (
            <ClimbItem key={user.id} onPress={() => handleUserPress(user.id)}>
              <ClimbRow>
                <VStack flex={1}>
                  <ClimbTitle>{user.username}</ClimbTitle>
                </VStack>
                {user.id !== currentUser?.id && (
                  <Button
                    onPress={(e) => {
                      e.stopPropagation();
                      user.isFollowing
                        ? handleUnfollow(user.id)
                        : handleFollow(user.id);
                    }}
                  >
                    <Text>
                      {user.isFollowing ? t("Unfollow") : t("Follow")}
                    </Text>
                  </Button>
                )}
              </ClimbRow>
            </ClimbItem>
        ))}
        {loading && page > 1 && (
          <EmptyState>
            <EmptyStateText>{t("Loading more users...")}</EmptyStateText>
          </EmptyState>
        )}
      </>
    );
  };

  const renderFiltersModal = () => (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={["40%", "60%"]}
      backdropComponent={BottomSheetBackdrop}
    >
      <BottomSheetScrollView>
        <VStack gap="lg" p="$4">
          <Box>
            <Text>
              {t("Minimum Grade")}: {GRADES[minGradeIndex]}
            </Text>
            <Slider
              minValue={0}
              maxValue={GRADES.length - 1}
              value={minGradeIndex}
              onChange={(val) => setMinGradeIndex(val)}
              step={1}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box>
            <Text>
              {t("Maximum Grade")}: {GRADES[maxGradeIndex]}
            </Text>
            <Slider
              minValue={0}
              maxValue={GRADES.length - 1}
              value={maxGradeIndex}
              onChange={(val) => setMaxGradeIndex(val)}
              step={1}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </VStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );

  if (loading && page === 1) {
    return (
      <MainContainer>
        <EmptyState>
          <EmptyStateText>{t("Loading...")}</EmptyStateText>
        </EmptyState>
      </MainContainer>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <MainContainer>
          <SearchHeader>
            <SearchInputContainer>
              <Input style={{ width: "100%" }}>
                <InputField
                  placeholder={
                    activeTab === "climbs"
                      ? t("Search climbs...")
                      : t("Search users...")
                  }
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  onSubmitEditing={handleSearchPress}
                  onKeyPress={handleKeyPress}
                />
                <InputSlot style={{paddingRight: 10}}>
                  <Pressable onPress={handleSearchPress}>
                    <InputIcon as={SearchIcon} />
                  </Pressable>
                </InputSlot>
              </Input>
            </SearchInputContainer>
            {activeTab === "climbs" && (
              <Pressable onPress={handlePresentModalPress}>
                <FilterButtonContainer>
                  <FilterIcon size={20} color="#64748b" />
                </FilterButtonContainer>
              </Pressable>
            )}
          </SearchHeader>

          <TabsContainer>
            <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
          </TabsContainer>

          <ContentScrollView
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } =
                nativeEvent;
              if (
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - 50
              ) {
                handleEndReached();
              }
            }}
            scrollEventThrottle={400}
          >
            {activeTab === "climbs" ? renderClimbs() : renderUsers()}
          </ContentScrollView>

          {renderFiltersModal()}
        </MainContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export const SearchPage = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DashboardLayout title="Search" isSidebarVisible isHeaderVisible={false}>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};
