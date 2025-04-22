import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/src/components/ui/icon";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import {
  MainContainer,
  SearchHeader,
  SearchInputContainer,
  TabsContainer,
  TabButton,
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
} from "./styles";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/src/components/ui/input";
import { ButtonText } from "@/src/components/ui/button";
import { fetchClimbs, Climb, toggleLikeClimb, fetchUsers } from "./api/search";
import { Heart, Star } from "lucide-react-native";
import { HStack, Pressable, VStack } from "@gluestack-ui/themed";
import { User } from "@joan16/shared-base";

type SearchTab = "climbs" | "users";

const MainContent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SearchTab>("climbs");
  const [searchQuery, setSearchQuery] = useState("");
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const triggerSearch = useCallback(
    (reset = true) => {
      if (activeTab === "climbs") {
        if (reset) {
          setClimbs([]);
          setPage(1);
          setHasMore(true);
        }
        loadClimbs(reset);
      } else if (activeTab === "users") {
        if (reset) {
          setUsers([]);
          setPage(1);
          setHasMore(true);
        }
        loadUsers(reset);
      }
    },
    [activeTab, searchQuery]
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

        if (reset) {
          setClimbs(response.data || []);
          setPage(2);
        } else {
          setClimbs((prev) => [...prev, ...(response.data || [])]);
          setPage((prev) => prev + 1);
        }

        setHasMore((response.data?.length || 0) >= pageSize);
      } catch (error) {
        console.error("Error loading climbs:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page, hasMore, pageSize]
  );

  const loadUsers = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;
  
      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const response = await fetchUsers(currentPage, pageSize, searchQuery || undefined);
  
        if (reset) {
          setUsers(response.data || []);
          setPage(2);
        } else {
          setUsers((prev) => [...prev, ...(response.data || [])]);
          setPage((prev) => prev + 1);
        }
  
        setHasMore((response.data?.length || 0) >= pageSize);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page, hasMore, pageSize]
  );
  

  // Initial load and tab change
  useEffect(() => {
    triggerSearch(true);
  }, [activeTab]);

  const handleEndReached = () => {
    if (!loading && hasMore) {
      loadClimbs();
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
    <MainContainer>
      <SearchHeader>
        <SearchInputContainer>
          <Input style={{ width: "100%" }}>
            <InputField
              placeholder={t("Search climbs...")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearchPress}
              onKeyPress={handleKeyPress}
            />
            <InputSlot style={{ paddingRight: 6 }}>
              <Pressable onPress={handleSearchPress}>
                <InputIcon as={SearchIcon} />
              </Pressable>
            </InputSlot>
          </Input>
        </SearchInputContainer>

        <TabsContainer>
          <TabButton
            active={activeTab === "climbs"}
            onPress={() => setActiveTab("climbs")}
          >
            <ButtonText>{t("Climbs")}</ButtonText>
          </TabButton>
          <TabButton
            active={activeTab === "users"}
            onPress={() => setActiveTab("users")}
          >
            <ButtonText>{t("Users")}</ButtonText>
          </TabButton>
        </TabsContainer>
      </SearchHeader>

      <ContentScrollView
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 50
          ) {
            handleEndReached();
          }
        }}
        scrollEventThrottle={400}
      >
        {activeTab === "climbs" ? (
          climbs.length === 0 ? (
            <EmptyState>
              <EmptyStateText>
                {searchQuery
                  ? t("No climbs match your search")
                  : t("No climbs available")}
              </EmptyStateText>
            </EmptyState>
          ) : (
            <>
              {climbs.map((climb) => (
                <ClimbItem key={climb.id}>
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
                          onPress={() =>
                            handleToggleLike(climb.id, climb.isLiked)
                          }
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
          )
        ) : (
          users.length === 0 ? (
            <EmptyState>
              <EmptyStateText>
                {searchQuery ? t("No users found") : t("Search for users")}
              </EmptyStateText>
            </EmptyState>
          ) : (
            <>
              {users.map((user) => (
                <ClimbItem key={user.id}>
                  <ClimbRow>
                    <ClimbTitle>{user.username}</ClimbTitle>
                  </ClimbRow>
                </ClimbItem>
              ))}
              {loading && page > 1 && (
                <EmptyState>
                  <EmptyStateText>{t("Loading more users...")}</EmptyStateText>
                </EmptyState>
              )}
            </>
          )
        )}
      </ContentScrollView>
    </MainContainer>
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
