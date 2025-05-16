// screens/ProfileScreen.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Heart,
  LogOutIcon,
  MessageCircle,
  EditIcon,
} from "lucide-react-native";
import { useRecoilValue } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components
import { Avatar } from "@/src/components/ui/avatar";
import { Text } from "@/src/components/ui/text";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { DashboardLayout } from "../../dashboard/dashboard-layout";
import { Input, InputField } from "@/src/components/ui/input";
import GenericCard from "@/src/shared/ui/organism/Card/Card";
import { Pressable } from "@/src/components/ui/pressable";
import {
  GenericButton,
  ProfileHeader,
  ProfileStats,
  UserListItem,
} from "@/src/shared";
import { ConfirmationModal, GenericModal } from "@/src/shared/modals";

// API and state
import { userState } from "@/src/recoil/users.recoil";
import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
  useProfile,
  fetchUserProfile,
  fetchAscended,
} from "./api/profile";
import { toggleLikeClimb } from "../../dashboard/dashboard-layout/api/climbs";
import { handleRequest } from "@/src/utils/api/https.utils";

// Types
import { User } from "@joan16/shared-base";
import {
  ClimbGridContainer,
  ContentContainer,
  LogoutButton,
  MainContainer,
  ProfileContainer,
} from "./styles";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";

export interface ProfileData {
  username: string;
  followers: any[];
  following: any[];
  createdRoutes: number;
  completedRoutes: number;
  isFollowing?: boolean;
}

export interface Climb {
  id: string;
  title: string;
  grade: string;
  description?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  imageUrl?: string;
}

export interface ClimbWithAscension extends Climb {
  isAscended: boolean;
}

export interface FollowerFollowingItem {
  id: string;
  followerUser?: User;
  followingUser?: User;
  isFollowing: boolean;
}

const initialProfileData: ProfileData = {
  username: "",
  followers: [],
  following: [],
  createdRoutes: 0,
  completedRoutes: 0,
};

const ProfileScreen = () => {
  const { t } = useTranslation();
  const currentUser = useRecoilValue(userState);
  const params = useLocalSearchParams();
  const userId = params.userId as string | undefined;
  const { loadUserProfile, updateUserProfile } = useProfile();

  // State management
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [ascendedClimbs, setAscendedClimbs] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<FollowerFollowingItem[]>(
    []
  );
  const [followingList, setFollowingList] = useState<FollowerFollowingItem[]>(
    []
  );
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [isLoadingAscendedClimbs, setIsLoadingAscendedClimbs] = useState(false);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isMyClimbsModalOpen, setIsMyClimbsModalOpen] = useState(false);
  const [isAscendedClimbsModalOpen, setIsAscendedClimbsModalOpen] =
    useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState<string | null>(null);

  // Memoized values
  const targetUserId = useMemo(
    () => userId || currentUser?.id,
    [userId, currentUser?.id]
  );
  const username = profileData.username;
  const followersCount = profileData.followers.length;
  const followingCount = profileData.following.length;
  const createdRoutesCount = climbs.length;
  const completedRoutesCount = ascendedClimbs.length;

  /**
   * Initialize user profile data
   */
  const initializeProfile = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if we're viewing our own profile or another user's profile
      const viewingOwnProfile = !userId || userId === currentUser?.id;
      setIsCurrentUser(viewingOwnProfile);

      let userData;

      if (viewingOwnProfile) {
        // Load current user's profile
        userData = await loadUserProfile();
      } else {
        // Load another user's profile
        userData = await fetchUserProfile(userId);
      }
      fetchAscendedClimbs();

      setProfileData({
        username: userData.username || "",
        followers: userData.followers?.data || [],
        following: userData.following?.data || [],
        createdRoutes: userData.myClimbs?.data?.length || 0,
        completedRoutes: ascendedClimbs.length || 0,
        isFollowing: userData.isFollowing || false,
      });

      setClimbs(userData.myClimbs?.data || []);

      // Load follow data if we have a target user ID
      if (targetUserId) {
        const [followers, following] = await Promise.all([
          fetchFollowers(targetUserId),
          fetchFollowing(targetUserId),
        ]);
        setFollowersList(followers);
        setFollowingList(following);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentUser?.id, targetUserId, loadUserProfile]);

  useEffect(() => {
    initializeProfile();
  }, []);

  /**
   * Fetch ascended climbs
   */
  const fetchAscendedClimbs = useCallback(async () => {
    try {
      setIsLoadingAscendedClimbs(true);
      if (!targetUserId) return;

      const climbs = await fetchAscended(targetUserId);
      setAscendedClimbs(climbs);
    } catch (error) {
      console.error("Error fetching ascended climbs:", error);
    } finally {
      setIsLoadingAscendedClimbs(false);
    }
  }, [targetUserId]);

  /**
   * Toggle like status for a climb
   */
  const handleToggleLike = useCallback(
    async (climbId: string, isLiked: boolean) => {
      // Optimistic update
      setClimbs((prevClimbs) =>
        prevClimbs.map((climb) =>
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

      try {
        await toggleLikeClimb(climbId, isLiked);
      } catch (error) {
        console.error("Error updating like:", error);
        // Revert on error
        setClimbs((prevClimbs) =>
          prevClimbs.map((climb) =>
            climb.id === climbId
              ? {
                  ...climb,
                  isLiked,
                  likesCount: isLiked
                    ? climb.likesCount + 1
                    : climb.likesCount - 1,
                }
              : climb
          )
        );
      }
    },
    []
  );

  /**
   * Render a climb item
   */
  const renderClimbItem = useCallback(
    ({ item }: { item: Climb }) => (
      <View style={{ width: "48%", marginBottom: 16 }}>
        <GenericCard
          title={item.title}
          subtitle={`Grade: ${item.grade}`}
          description={item.description || ""}
          primaryActionCount={item.likesCount}
          secondaryActionCount={item.commentsCount}
          primaryIcon={Heart}
          secondaryIcon={MessageCircle}
          onPrimaryAction={() => handleToggleLike(item.id, item.isLiked)}
          onSecondaryAction={() => console.log("Comment")}
          isLiked={item.isLiked}
          imageUrl={item.imageUrl || "https://placehold.co/600x400"}
          onPress={() =>
            router.navigate({
              pathname: `/view-climb/view-climb`,
              params: { climbId: item.id },
            })
          }
        />
      </View>
    ),
    [handleToggleLike]
  );

  /**
   * Save profile changes to the server
   */
  const saveProfileChanges = useCallback(async () => {
    try {
      setIsUpdating(true);
      if (!currentUser?.id || !currentUser?.email) {
        throw new Error("User data not available");
      }

      const updates: { username?: string } = {};
      if (profileData.username !== currentUser.username) {
        updates.username = profileData.username;
      }

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(currentUser.email, updates);
        await initializeProfile(); // Refresh all data
      }

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [currentUser, profileData.username, updateUserProfile, initializeProfile]);

  /**
   * Handle user logout
   */
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("loggedUser");
      setIsLogoutModalOpen(false);
      router.replace("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  /**
   * Fetch and display followers list
   */
  const openFollowersModal = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setIsLoadingFollowers(true);
      setIsFollowersModalOpen(true);
      const followers = await fetchFollowers(targetUserId);
      setFollowersList(followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setIsLoadingFollowers(false);
    }
  }, [targetUserId]);

  /**
   * Fetch and display following list
   */
  const openFollowingModal = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setIsLoadingFollowing(true);
      setIsFollowingModalOpen(true);
      const following = await fetchFollowing(targetUserId);
      setFollowingList(following);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setIsLoadingFollowing(false);
    }
  }, [targetUserId]);

  /**
   * Open my climbs modal
   */
  const openMyClimbsModal = useCallback(() => {
    setIsMyClimbsModalOpen(true);
  }, []);

  /**
   * Open ascended climbs modal
   */
  const openAscendedClimbsModal = useCallback(async () => {
    try {
      setIsLoadingAscendedClimbs(true);
      setIsAscendedClimbsModalOpen(true);
      await fetchAscendedClimbs();
    } catch (error) {
      console.error("Error opening ascended climbs modal:", error);
    } finally {
      setIsLoadingAscendedClimbs(false);
    }
  }, [fetchAscendedClimbs]);

  /**
   * Follow a user
   */
  const handleFollow = useCallback(
    async (userTarget: string) => {
      try {
        await followUser(userTarget);

        // Update the specific user's follow status in followers/following lists
        setFollowersList((prev) =>
          prev.map((user) =>
            user.followerUser?.id === userTarget
              ? { ...user, isFollowing: true }
              : user
          )
        );

        setFollowingList((prev) =>
          prev.map((user) =>
            user.followingUser?.id === userTarget
              ? { ...user, isFollowing: true }
              : user
          )
        );

        // If we're on another user's profile, update their follow status
        if (!isCurrentUser && targetUserId === userTarget) {
          setProfileData((prev) => ({
            ...prev,
            isFollowing: true,
          }));
        }
      } catch (error) {
        console.error("Error following user:", error);
      }
    },
    [isCurrentUser, targetUserId]
  );

  /**
   * Unfollow a user after confirmation
   */
  const confirmUnfollow = useCallback(async () => {
    if (!userToUnfollow) return;

    try {
      await unfollowUser(userToUnfollow);

      // Update the specific user's follow status in followers/following lists
      setFollowersList((prev) =>
        prev.map((user) =>
          user.followerUser?.id === userToUnfollow
            ? { ...user, isFollowing: false }
            : user
        )
      );

      setFollowingList((prev) =>
        prev.map((user) =>
          user.followingUser?.id === userToUnfollow
            ? { ...user, isFollowing: false }
            : user
        )
      );

      // If we're on another user's profile, update their follow status
      if (!isCurrentUser && targetUserId === userToUnfollow) {
        setProfileData((prev) => ({
          ...prev,
          isFollowing: false,
        }));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setUserToUnfollow(null);
    }
  }, [userToUnfollow, isCurrentUser, targetUserId]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <MainContainer style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer>
          {!isCurrentUser && (
            <Pressable
              onPress={() => router.back()}
              style={{ position: "absolute", left: 16, top: 16, zIndex: 10 }}
            >
              <ArrowLeft size={24} color="black" />
            </Pressable>
          )}

          {isCurrentUser && (
            <LogoutButton onPress={() => setIsLogoutModalOpen(true)}>
              <ButtonIcon color="black" as={LogOutIcon} size="lg" />
            </LogoutButton>
          )}

          <ProfileContainer>
            <ProfileHeader
              username={username}
              isCurrentUser={isCurrentUser}
              onEditPress={() => setIsEditModalOpen(true)}
              isFollowing={profileData.isFollowing}
              onFollowPress={() =>
                profileData.isFollowing
                  ? setUserToUnfollow(userId || "")
                  : handleFollow(userId || "")
              }
            />

            <ProfileStats
              followersCount={followersCount}
              followingCount={followingCount}
              createdRoutesCount={createdRoutesCount}
              completedRoutesCount={completedRoutesCount}
              onFollowersPress={openFollowersModal}
              onFollowingPress={openFollowingModal}
              onCreatedRoutesPress={openMyClimbsModal}
              onCompletedRoutesPress={openAscendedClimbsModal}
            />
          </ProfileContainer>

          <ClimbGridContainer>
            <FlatList
              data={climbs}
              renderItem={renderClimbItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </ClimbGridContainer>
        </ContentContainer>
      </ScrollView>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title={t("Confirm Logout")}
        message={t("Are you sure you want to log out?")}
        confirmText={t("Log Out")}
      />

      <ConfirmationModal
        isOpen={!!userToUnfollow}
        onClose={() => setUserToUnfollow(null)}
        onConfirm={confirmUnfollow}
        title={t("Confirm Unfollow")}
        message={t("Are you sure you want to unfollow this user?")}
        confirmText={t("Unfollow")}
      />

      {/* Followers Modal */}
      <GenericModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        title={`${t("Followers")} (${followersList.length})`}
      >
        {isLoadingFollowers ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={followersList}
            renderItem={({ item }) => (
              <UserListItem
                user={item.followerUser || { id: "", username: "" }}
                isFollowing={item.isFollowing}
                currentUserId={currentUser?.id || undefined}
                onPressUser={() => {
                  router.push(
                    `/profile/profile?userId=${item.followerUser?.id}`
                  );
                  setIsFollowersModalOpen(false);
                }}
                onFollowPress={() => handleFollow(item.followerUser?.id || "")}
                onUnfollowPress={() =>
                  setUserToUnfollow(item.followerUser?.id || null)
                }
              />
            )}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 400 }}
          />
        )}
      </GenericModal>

      {/* Following Modal */}
      <GenericModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        title={`${t("Following")} (${followingList.length})`}
      >
        {isLoadingFollowing ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={followingList}
            renderItem={({ item }) => (
              <UserListItem
                user={item.followingUser || { id: "", username: "" }}
                isFollowing={item.isFollowing}
                currentUserId={currentUser?.id || undefined}
                onPressUser={() => {
                  router.push(
                    `/profile/profile?userId=${item.followingUser?.id}`
                  );
                  setIsFollowingModalOpen(false);
                }}
                onFollowPress={() => handleFollow(item.followingUser?.id || "")}
                onUnfollowPress={() =>
                  setUserToUnfollow(item.followingUser?.id || null)
                }
              />
            )}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 400 }}
          />
        )}
      </GenericModal>

      {/* My Climbs Modal */}
      <GenericModal
        isOpen={isMyClimbsModalOpen}
        onClose={() => setIsMyClimbsModalOpen(false)}
        title={`${t("My Climbs")} (${climbs.length})`}
      >
        <FlatList
          data={climbs}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <Text>Grade: {item.grade}</Text>
              <Button
                onPress={() => {
                  router.navigate({
                    pathname: `/view-climb/view-climb`,
                    params: { climbId: item.id },
                  });
                  setIsMyClimbsModalOpen(false);
                }}
              >
                <ButtonText>{t("View Details")}</ButtonText>
              </Button>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 400 }}
        />
      </GenericModal>

      {/* Ascended Climbs Modal */}
      <GenericModal
        isOpen={isAscendedClimbsModalOpen}
        onClose={() => setIsAscendedClimbsModalOpen(false)}
        title={`${t("Ascended Climbs")} (${ascendedClimbs.length})`}
      >
        {isLoadingAscendedClimbs ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={ascendedClimbs}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.climb.title}</Text>
                <Text>Grade: {item.climb.grade}</Text>
                {item.ascendedAt && (
                  <Text>
                    Ascended on:{" "}
                    {new Date(item.ascendedAt).toLocaleDateString()}
                  </Text>
                )}
                {item.ascentNotes && <Text>Notes: {item.ascentNotes}</Text>}
                <Button
                  onPress={() => {
                    router.navigate({
                      pathname: `/view-climb/view-climb`,
                      params: { climbId: item.climb.id },
                    });
                    setIsAscendedClimbsModalOpen(false);
                  }}
                >
                  <ButtonText>{t("View Details")}</ButtonText>
                </Button>
              </View>
            )}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 400 }}
          />
        )}
      </GenericModal>

      {/* Edit Profile Modal */}
      <GenericModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("Edit Profile")}
        footerContent={
          <>
            <Button
              variant="solid"
              onPress={saveProfileChanges}
              disabled={isUpdating}
            >
              <ButtonText>{t("Save")}</ButtonText>
            </Button>
          </>
        }
      >
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Avatar size="2xl" />
          <Pressable
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <EditIcon size={20} color="black" />
          </Pressable>
        </View>

        <Text style={{ fontWeight: "600", marginBottom: 8 }}>
          {t("Username")}
        </Text>
        <Input>
          <InputField
            value={profileData.username}
            onChangeText={(text) =>
              setProfileData({ ...profileData, username: text })
            }
            placeholder={t("Enter your username")}
          />
        </Input>
      </GenericModal>
    </MainContainer>
  );
};

export const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DashboardLayout title="Profile" isSidebarVisible isHeaderVisible={false}>
        <ProfileScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
