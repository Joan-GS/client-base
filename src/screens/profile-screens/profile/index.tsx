import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  LogOutIcon,
  MessageCircle,
  ThumbsUp,
} from "lucide-react-native";
import { useRecoilValue } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@joan16/shared-base";
import { Pressable } from "@gluestack-ui/themed";

// Components
import { Avatar } from "@/src/components/ui/avatar";
import { Text } from "@/src/components/ui/text";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { DashboardLayout } from "../../dashboard/dashboard-layout";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { EditIcon, Icon } from "@/src/components/ui/icon";
import { ModalHeader, ModalFooter } from "@/src/components/ui/modal";
import { Input, InputField } from "@/src/components/ui/input";
import GenericCard from "@/src/shared/ui/organism/Card/Card";

// Styles
import {
  ProfileContainer,
  ProfileHeader,
  ProfileText,
  StatsItem,
  StatsSection,
  ModalStyled,
  ModalContentStyled,
  ModalBodyStyled,
  ModalAvatarStyled,
  ModalAvatarPressableStyled,
  LogoutButton,
  MainContainer,
  ContentContainer,
  ClimbGridContainer,
  ClimbGridContent,
  ClimbCardWrapper,
} from "./styles";

// Assets & API
import { EditPhotoIcon } from "./assets/icons/edit-photo";
import { userState } from "@/src/recoil/users.recoil";
import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
  useProfile,
  fetchUserProfile,
} from "./api/profile";
import { toggleLikeClimb } from "../../dashboard/dashboard-layout/api/climbs";

// Types
interface ProfileData {
  username: string;
  following: any;
  followers: any;
  createdRoutes: number;
  completedRoutes: number;
  isFollowing?: boolean;
}

interface Climb {
  id: string;
  title: string;
  grade: string;
  description?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  imageUrl?: string;
}

interface FollowerFollowingItem {
  id: string;
  followerUser?: User;
  followingUser?: User;
  isFollowing: boolean;
}

const initialProfileData: ProfileData = {
  username: "",
  followers: 0,
  following: 0,
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

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState<string | null>(null);

  // Memoized values
  const targetUserId = useMemo(
    () => userId || currentUser?.id,
    [userId, currentUser?.id]
  );
  const username = profileData.username;
  const followersCount = profileData.followers;
  const followingCount = followingList?.length || 0;
  const createdRoutesCount = climbs.length || 0;
  const completedRoutesCount = profileData.completedRoutes;

  console.log("currentUser", currentUser);
  console.log("targetUserId", targetUserId);

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

      setProfileData({
        username: userData.username || "",
        followers: userData.followers?.data?.length || 0,
        following: userData.following?.data?.length || 0,
        createdRoutes: userData.myClimbs?.data?.length || 0,
        completedRoutes: userData.ascensions?.length || 0,
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

      closeEditModal();
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

  // Modal handlers
  const openEditModal = useCallback(() => setIsEditModalOpen(true), []);
  const closeEditModal = useCallback(() => setIsEditModalOpen(false), []);
  const openLogoutModal = useCallback(() => setIsLogoutModalOpen(true), []);
  const closeLogoutModal = useCallback(() => setIsLogoutModalOpen(false), []);
  const closeFollowersModal = useCallback(
    () => setIsFollowersModalOpen(false),
    []
  );
  const closeFollowingModal = useCallback(
    () => setIsFollowingModalOpen(false),
    []
  );
  const closeUnfollowModal = useCallback(
    () => setIsUnfollowModalOpen(false),
    []
  );

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
   * Open unfollow confirmation modal
   */
  const openUnfollowModal = useCallback((userId: string) => {
    setUserToUnfollow(userId);
    setIsUnfollowModalOpen(true);
  }, []);

  /**
   * Follow a user
   */
  const handleFollow = useCallback(async (targetUserId: string) => {
    // Optimistic updates
    updateFollowStatus(targetUserId, true);

    try {
      await followUser(targetUserId);
      // Refresh data
      const [updatedFollowers, updatedFollowing] = await Promise.all([
        fetchFollowers(targetUserId),
        fetchFollowing(targetUserId),
      ]);
      setFollowersList(updatedFollowers);
      setFollowingList(updatedFollowing);
      setProfileData((prev) => ({
        ...prev,
        followers: updatedFollowers?.length,
      }));
    } catch (error) {
      console.error("Error following user:", error);
      // Revert on error
      updateFollowStatus(targetUserId, false);
    }
  }, []);

  /**
   * Unfollow a user after confirmation
   */
  const confirmUnfollow = useCallback(async () => {
    if (!userToUnfollow) return;

    try {
      // Optimistic update
      updateFollowStatus(userToUnfollow, false);

      await unfollowUser(userToUnfollow);

      // Refresh data
      const [updatedFollowers, updatedFollowing] = await Promise.all([
        fetchFollowers(userToUnfollow),
        fetchFollowing(userToUnfollow),
      ]);
      setFollowersList(updatedFollowers);
      setFollowingList(updatedFollowing);
      setProfileData((prev) => ({
        ...prev,
        followers: updatedFollowers?.length,
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      // Revert on error
      updateFollowStatus(userToUnfollow, true);
    } finally {
      closeUnfollowModal();
    }
  }, [userToUnfollow, closeUnfollowModal]);

  /**
   * Helper function to update follow status in state
   */
  const updateFollowStatus = useCallback(
    (targetUserId: string, isFollowing: boolean) => {
      // Update followers list - only if the current user is the one being followed/unfollowed
      setFollowersList((prev) =>
        prev.map((item) => {
          // Only update if the current user is the one being followed/unfollowed
          if (
            item.followerUser?.id === currentUser?.id &&
            item.followingUser?.id === targetUserId
          ) {
            return {
              ...item,
              isFollowing,
            };
          }
          return item;
        })
      );

      // Update following list - only if the current user is doing the following/unfollowing
      setFollowingList((prev) =>
        prev.map((item) => {
          if (
            item.followerUser?.id === currentUser?.id &&
            item.followingUser?.id === targetUserId
          ) {
            return {
              ...item,
              isFollowing,
            };
          }
          return item;
        })
      );

      // Update main profile data if this is the viewed profile
      if (userId === targetUserId) {
        setProfileData((prev) => ({
          ...prev,
          isFollowing,
          followers: isFollowing ? prev.followers + 1 : prev.followers - 1,
        }));
      }
    },
    [userId, currentUser?.id]
  );

  /**
   * Render a user item in followers/following list
   */
  const renderUserItem = useCallback(
    ({ item }: { item: FollowerFollowingItem }) => {
      const user = item.followerUser || item.followingUser;
      if (!user) return null;

      const handlePressUser = () => {
        router.push({
          pathname: "/profile/profile",
          params: { userId: user.id },
        });
        // Cierra el modal después de navegar
        if (isFollowersModalOpen) setIsFollowersModalOpen(false);
        if (isFollowingModalOpen) setIsFollowingModalOpen(false);
      };

      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
          }}
        >
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            onPress={handlePressUser}
          >
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontWeight: "600", fontSize: 16 }}>
                {user.username}
              </Text>
            </View>
          </Pressable>

          {user.id !== currentUser?.id &&
            (item.isFollowing ? (
              <Button
                size="sm"
                variant="outline"
                onPress={() => {
                  setUserToUnfollow(user.id);
                  setIsUnfollowModalOpen(true);
                }}
              >
                <ButtonText>Following</ButtonText>
              </Button>
            ) : (
              <Button size="sm" onPress={() => handleFollow(user.id)}>
                <ButtonText>Follow</ButtonText>
              </Button>
            ))}
        </View>
      );
    },
    [currentUser?.id, isFollowersModalOpen, isFollowingModalOpen]
  );

  /**
   * Render a climb item
   */
  const renderClimbItem = useCallback(
    ({ item }: { item: Climb }) => (
      <ClimbCardWrapper key={item.id}>
        <GenericCard
          title={item.title}
          subtitle={`Grade: ${item.grade}`}
          description={item.description || ""}
          primaryActionCount={item.likesCount}
          secondaryActionCount={item.commentsCount}
          primaryIcon={ThumbsUp}
          secondaryIcon={MessageCircle}
          onPrimaryAction={() => handleToggleLike(item.id, item.isLiked)}
          onSecondaryAction={() => console.log("Comment")}
          isLiked={item.isLiked}
          imageUrl={item.imageUrl || "https://placehold.co/600x400"}
          flex={1}
          borderRadius={4}
          maxWidth={540}
        />
      </ClimbCardWrapper>
    ),
    [handleToggleLike]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <MainContainer>
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
            <LogoutButton onPress={openLogoutModal}>
              <ButtonIcon color="black" as={LogOutIcon} size="lg" />
            </LogoutButton>
          )}

          <ProfileContainer>
            <ProfileHeader>
              <Avatar size="2xl" />
              <ProfileText>
                <Text className="text-xl font-semibold">{username}</Text>
              </ProfileText>
            </ProfileHeader>

            <StatsSection>
              <StatsItem onPress={openFollowersModal}>
                <Text className="font-semibold text-lg">{followersCount}</Text>
                <Text className="text-sm text-gray-500">{t("Followers")}</Text>
              </StatsItem>
              <StatsItem onPress={openFollowingModal}>
                <Text className="font-semibold text-lg">{followingCount}</Text>
                <Text className="text-sm text-gray-500">{t("Following")}</Text>
              </StatsItem>
              <StatsItem>
                <Text className="font-semibold text-lg">
                  {createdRoutesCount}
                </Text>
                <Text className="text-sm text-gray-500">{t("My Climbs")}</Text>
              </StatsItem>
              <StatsItem>
                <Text className="font-semibold text-lg">
                  {completedRoutesCount}
                </Text>
                <Text className="text-sm text-gray-500">{t("Climbs")}</Text>
              </StatsItem>
            </StatsSection>

            {isCurrentUser ? (
              <Button
                variant="outline"
                action="secondary"
                onPress={openEditModal}
                className="gap-3 relative"
              >
                <ButtonText className="text-dark">
                  {t("Edit Profile")}
                </ButtonText>
                <ButtonIcon as={EditIcon} />
              </Button>
            ) : (
              <Button
                variant={profileData.isFollowing ? "outline" : "solid"}
                onPress={() =>
                  profileData.isFollowing
                    ? openUnfollowModal(userId || "")
                    : handleFollow(userId || "")
                }
              >
                <Text
                  className={
                    profileData.isFollowing ? "text-black" : "text-white"
                  }
                >
                  {profileData.isFollowing ? t("Following") : t("Follow")}
                </Text>
              </Button>
            )}
          </ProfileContainer>

          <ClimbGridContainer>
            <ClimbGridContent>
              {climbs.map((climb) => (
                <ClimbCardWrapper key={climb.id}>
                  <GenericCard
                    title={climb.title}
                    subtitle={`Grade: ${climb.grade}`}
                    description={climb.description || ""}
                    primaryActionCount={climb.likesCount}
                    secondaryActionCount={climb.commentsCount}
                    primaryIcon={ThumbsUp}
                    secondaryIcon={MessageCircle}
                    onPrimaryAction={() =>
                      handleToggleLike(climb.id, climb.isLiked)
                    }
                    onSecondaryAction={() => console.log("Comment")}
                    isLiked={climb.isLiked}
                    imageUrl={climb.imageUrl || "https://placehold.co/600x400"}
                    flex={1}
                    borderRadius={4}
                    maxWidth={540}
                    onPress={() =>
                      router.navigate({
                        pathname: `/view-climb/view-climb`,
                        params: { climbId: climb.id },
                      })
                    }
                  />
                </ClimbCardWrapper>
              ))}
            </ClimbGridContent>
          </ClimbGridContainer>
        </ContentContainer>
      </ScrollView>

      {/* Modals */}
      {isCurrentUser && (
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={closeLogoutModal}
          onConfirm={logout}
          t={t}
        />
      )}

      {isCurrentUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          profileData={profileData}
          setProfileData={setProfileData}
          saveProfileChanges={saveProfileChanges}
          isUpdating={isUpdating}
          t={t}
        />
      )}

      <FollowersFollowingModal
        isOpen={isFollowersModalOpen}
        onClose={closeFollowersModal}
        title={t("Followers")}
        data={followersList || []}
        isLoading={isLoadingFollowers}
        renderItem={renderUserItem}
        t={t}
      />

      <FollowersFollowingModal
        isOpen={isFollowingModalOpen}
        onClose={closeFollowingModal}
        title={t("Following")}
        data={followingList || []}
        isLoading={isLoadingFollowing}
        renderItem={renderUserItem}
        t={t}
      />

      <UnfollowModal
        isOpen={isUnfollowModalOpen}
        onClose={closeUnfollowModal}
        onConfirm={confirmUnfollow}
        t={t}
      />
    </MainContainer>
  );
};

// Extracted Modal Components for better readability and reusability

const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}) => (
  <ModalStyled isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
    <ModalContentStyled>
      <ModalHeader>
        <Text className="text-lg font-semibold">{t("Confirm Logout")}</Text>
      </ModalHeader>
      <ModalBodyStyled>
        <Text className="text-sm">
          {t("Are you sure you want to log out?")}
        </Text>
      </ModalBodyStyled>
      <ModalFooter>
        <Button variant="outline" onPress={onClose}>
          <ButtonText>{t("Cancel")}</ButtonText>
        </Button>
        <Button variant="solid" onPress={onConfirm} className="ml-2">
          <ButtonText>{t("Log Out")}</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContentStyled>
  </ModalStyled>
);

const EditProfileModal = ({
  isOpen,
  onClose,
  profileData,
  setProfileData,
  saveProfileChanges,
  isUpdating,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  saveProfileChanges: () => void;
  isUpdating: boolean;
  t: (key: string) => string;
}) => (
  <ModalStyled isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
    <ModalContentStyled>
      <ModalHeader>
        <Text>{t("Edit Profile")}</Text>
      </ModalHeader>
      <ModalBodyStyled>
        <ModalAvatarStyled>
          <Avatar size="2xl" />
          <ModalAvatarPressableStyled className="bg-background-500 rounded-full items-center justify-center h-8 w-8 right-6 top-44">
            <Icon as={EditPhotoIcon} />
          </ModalAvatarPressableStyled>
        </ModalAvatarStyled>

        <Text className="text-sm font-semibold mt-2">{t("Username")}</Text>
        <Input>
          <InputField
            value={profileData.username}
            onChangeText={(text) =>
              setProfileData({ ...profileData, username: text })
            }
            placeholder="Enter your username"
          />
        </Input>
      </ModalBodyStyled>

      <ModalFooter>
        <Button variant="outline" onPress={onClose}>
          <ButtonText>{t("Cancel")}</ButtonText>
        </Button>
        <Button
          variant="solid"
          onPress={saveProfileChanges}
          className="ml-2"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <ButtonText>{t("Save")}</ButtonText>
          )}
        </Button>
      </ModalFooter>
    </ModalContentStyled>
  </ModalStyled>
);

const FollowersFollowingModal = ({
  isOpen,
  onClose,
  title,
  data,
  isLoading,
  renderItem,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: FollowerFollowingItem[] | null;
  isLoading: boolean;
  renderItem: ({ item }: { item: FollowerFollowingItem }) => JSX.Element | null;
  t: (key: string) => string;
}) => (
  <ModalStyled isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
    <ModalContentStyled>
      <ModalHeader>
        <Text className="text-lg font-semibold">
          {title} ({data ? data.length : 0})
        </Text>
      </ModalHeader>
      <ModalBodyStyled>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            {!data || data.length === 0 ? (
              <View className="flex-1 items-center justify-center p-4">
                <Text className="text-sm text-gray-500">
                  {title === t("Followers")
                    ? t("No followers yet")
                    : t("Not following anyone yet")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 400 }}
              />
            )}
          </>
        )}
      </ModalBodyStyled>
      <ModalFooter>
        <Button variant="outline" onPress={onClose}>
          <ButtonText>{t("Close")}</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContentStyled>
  </ModalStyled>
);

const UnfollowModal = ({
  isOpen,
  onClose,
  onConfirm,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}) => (
  <ModalStyled isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
    <ModalContentStyled>
      <ModalHeader>
        <Text className="text-lg font-semibold">{t("Confirm Unfollow")}</Text>
      </ModalHeader>
      <ModalBodyStyled>
        <Text className="text-sm">
          {t("Are you sure you want to unfollow this user?")}
        </Text>
      </ModalBodyStyled>
      <ModalFooter>
        <Button variant="outline" onPress={onClose}>
          <ButtonText>{t("Cancel")}</ButtonText>
        </Button>
        <Button variant="solid" onPress={onConfirm} className="ml-2">
          <ButtonText>{t("Unfollow")}</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContentStyled>
  </ModalStyled>
);

export const Profile = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title="Profile" isSidebarVisible isHeaderVisible={false}>
        <ProfileScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
