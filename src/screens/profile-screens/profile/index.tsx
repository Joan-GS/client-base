import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { LogOutIcon, MessageCircle, ThumbsUp } from "lucide-react-native";
import { useRecoilValue } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@joan16/shared-base";

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
} from "./api/profile";
import { toggleLikeClimb } from "../../dashboard/dashboard-layout/api/climbs";

// Types
interface ProfileData {
  username: string;
  followers: number;
  createdRoutes: number;
  completedRoutes: number;
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
  createdRoutes: 0,
  completedRoutes: 0,
};

const ProfileScreen = () => {
  const { t } = useTranslation();
  const user = useRecoilValue(userState);
  const { loadUserProfile, updateUserProfile } = useProfile();

  // State management
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [followersList, setFollowersList] = useState<FollowerFollowingItem[]>([]);
  const [followingList, setFollowingList] = useState<FollowerFollowingItem[]>([]);
  
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

  // Derived values
  const username = user?.username || profileData.username;
  const followersCount = user?.followers?.length || profileData.followers;
  const followingCount = user?.following?.length || 0;
  const createdRoutesCount = climbs.length || profileData.createdRoutes;
  const completedRoutesCount = user?.ascensions?.length || profileData.completedRoutes;

  /**
   * Initialize user profile data
   */
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await loadUserProfile();
        
        setProfileData({
          username: userData.username || "",
          followers: userData.followers?.length || 0,
          createdRoutes: userData.myClimbs?.data?.length || 0,
          completedRoutes: userData.ascensions?.length || 0,
        });
        
        setClimbs(userData.myClimbs?.data || []);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  /**
   * Toggle like status for a climb
   */
  const handleToggleLike = async (climbId: string, isLiked: boolean) => {
    // Optimistic update
    setClimbs(prevClimbs =>
      prevClimbs.map(climb =>
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
      // Revert on error
      setClimbs(prevClimbs =>
        prevClimbs.map(climb =>
          climb.id === climbId
            ? {
                ...climb,
                isLiked,
                likesCount: isLiked ? climb.likesCount + 1 : climb.likesCount - 1,
              }
            : climb
        )
      );
    }
  };

  /**
   * Save profile changes to the server
   */
  const saveProfileChanges = async () => {
    try {
      setIsUpdating(true);
      if (!user?.id || !user?.email) throw new Error("User data not available");

      const updates: { username?: string } = {};
      if (profileData.username !== user.username) {
        updates.username = profileData.username;
      }

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(user.email, updates);
        const updatedData = await loadUserProfile();
        
        setProfileData({
          username: updatedData.username || "",
          followers: updatedData.followers?.length || 0,
          createdRoutes: updatedData.myClimbs?.data?.length || 0,
          completedRoutes: updatedData.ascensions?.length || 0,
        });
        
        setClimbs(updatedData.myClimbs?.data || []);
      }

      closeEditModal();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle user logout
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("loggedUser");
      setIsLogoutModalOpen(false);
      router.replace("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Modal handlers
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
  const closeFollowersModal = () => setIsFollowersModalOpen(false);
  const closeFollowingModal = () => setIsFollowingModalOpen(false);

  /**
   * Fetch and display followers list
   */
  const openFollowersModal = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingFollowers(true);
      setIsFollowersModalOpen(true);
      const followers = await fetchFollowers(user.id);
      setFollowersList(followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  /**
   * Fetch and display following list
   */
  const openFollowingModal = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingFollowing(true);
      setIsFollowingModalOpen(true);
      const following = await fetchFollowing(user.id);
      setFollowingList(following);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  /**
   * Follow a user
   */
  const handleFollow = async (userId: string) => {
    if (!user?.id) return;

    // Optimistic updates
    updateFollowStatus(userId, true);

    try {
      await followUser(userId, user.id);
      // Refresh data
      const [updatedFollowers, updatedFollowing] = await Promise.all([
        fetchFollowers(user.id),
        fetchFollowing(user.id),
      ]);
      setFollowersList(updatedFollowers);
      setFollowingList(updatedFollowing);
    } catch (error) {
      console.error("Error following user:", error);
      // Revert on error
      updateFollowStatus(userId, false);
    }
  };

  /**
   * Unfollow a user
   */
  const handleUnfollow = async (userId: string) => {
    if (!user?.id) return;

    // Optimistic updates
    updateFollowStatus(userId, false);

    try {
      await unfollowUser(user.id, userId);
      // Refresh data
      const [updatedFollowers, updatedFollowing] = await Promise.all([
        fetchFollowers(user.id),
        fetchFollowing(user.id),
      ]);
      setFollowersList(updatedFollowers);
      setFollowingList(updatedFollowing);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      // Revert on error
      updateFollowStatus(userId, true);
    }
  };

  /**
   * Helper function to update follow status in state
   */
  const updateFollowStatus = (userId: string, isFollowing: boolean) => {
    setFollowersList(prev =>
      prev.map(item => ({
        ...item,
        isFollowing: item.followerUser?.id === userId ? isFollowing : item.isFollowing,
      }))
    );

    setFollowingList(prev =>
      prev.map(item => ({
        ...item,
        isFollowing: item.followingUser?.id === userId ? isFollowing : item.isFollowing,
      }))
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  /**
   * Render a user item in followers/following list
   */
  const renderUserItem = (item: FollowerFollowingItem, isFollowerList: boolean) => {
    const userData = isFollowerList ? item.followerUser : item.followingUser;
    if (!userData) return null;

    return (
      <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
        <View className="flex-row items-center flex-1">
          <Avatar size="sm" className="mr-3" />
          <View className="flex-1">
            <Text className="font-medium text-base" style={{ color: "black" }}>
              {userData.username}
            </Text>
          </View>
        </View>
        {userData.id !== user?.id && (
          item.isFollowing ? (
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleUnfollow(userData.id)}
            >
              <ButtonText>{t("Following")}</ButtonText>
            </Button>
          ) : (
            <Button
              variant="solid"
              size="sm"
              onPress={() => handleFollow(userData.id)}
            >
              <ButtonText>{t("Follow")}</ButtonText>
            </Button>
          )
        )}
      </View>
    );
  };

  return (
    <MainContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer>
          <LogoutButton onPress={openLogoutModal}>
            <ButtonIcon color="black" as={LogOutIcon} size="lg" />
          </LogoutButton>

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
                <Text className="font-semibold text-lg">{createdRoutesCount}</Text>
                <Text className="text-sm text-gray-500">{t("My Climbs")}</Text>
              </StatsItem>
              <StatsItem>
                <Text className="font-semibold text-lg">{completedRoutesCount}</Text>
                <Text className="text-sm text-gray-500">{t("Climbs")}</Text>
              </StatsItem>
            </StatsSection>

            <Button
              variant="outline"
              action="secondary"
              onPress={openEditModal}
              className="gap-3 relative"
            >
              <ButtonText className="text-dark">{t("Edit Profile")}</ButtonText>
              <ButtonIcon as={EditIcon} />
            </Button>
          </ProfileContainer>

          <ClimbGridContainer>
            <ClimbGridContent>
              {climbs.map(climb => (
                <ClimbCardWrapper key={climb.id}>
                  <GenericCard
                    title={climb.title}
                    subtitle={`Grade: ${climb.grade}`}
                    description={climb.description || ""}
                    primaryActionCount={climb.likesCount}
                    secondaryActionCount={climb.commentsCount}
                    primaryIcon={ThumbsUp}
                    secondaryIcon={MessageCircle}
                    onPrimaryAction={() => handleToggleLike(climb.id, climb.isLiked)}
                    onSecondaryAction={() => console.log("Comment")}
                    isLiked={climb.isLiked}
                    imageUrl={climb.imageUrl || "https://placehold.co/600x400"}
                    flex={1}
                    borderRadius={4}
                    maxWidth={540}
                  />
                </ClimbCardWrapper>
              ))}
            </ClimbGridContent>
          </ClimbGridContainer>
        </ContentContainer>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ModalStyled isOpen={isLogoutModalOpen} onClose={closeLogoutModal} closeOnOverlayClick>
        <ModalContentStyled>
          <ModalHeader>
            <Text className="text-lg font-semibold">{t("Confirm Logout")}</Text>
          </ModalHeader>
          <ModalBodyStyled>
            <Text className="text-sm">{t("Are you sure you want to log out?")}</Text>
          </ModalBodyStyled>
          <ModalFooter>
            <Button variant="outline" onPress={closeLogoutModal}>
              <ButtonText>{t("Cancel")}</ButtonText>
            </Button>
            <Button variant="solid" onPress={logout} className="ml-2">
              <ButtonText>{t("Log Out")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContentStyled>
      </ModalStyled>

      {/* Edit Profile Modal */}
      <ModalStyled isOpen={isEditModalOpen} onClose={closeEditModal} closeOnOverlayClick>
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
                onChangeText={text => setProfileData({ ...profileData, username: text })}
                placeholder="Enter your username"
              />
            </Input>
          </ModalBodyStyled>

          <ModalFooter>
            <Button variant="outline" onPress={closeEditModal}>
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

      {/* Followers List Modal */}
      <ModalStyled isOpen={isFollowersModalOpen} onClose={closeFollowersModal} closeOnOverlayClick>
        <ModalContentStyled>
          <ModalHeader>
            <Text className="text-lg font-semibold">
              {t("Followers")} ({followersList.length})
            </Text>
          </ModalHeader>
          <ModalBodyStyled>
            {isLoadingFollowers ? (
              <ActivityIndicator size="large" />
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                {followersList.length === 0 ? (
                  <Text className="text-sm text-gray-500">{t("No followers yet")}</Text>
                ) : (
                  followersList.map(item => renderUserItem(item, true))
                )}
              </ScrollView>
            )}
          </ModalBodyStyled>
          <ModalFooter>
            <Button variant="outline" onPress={closeFollowersModal}>
              <ButtonText>{t("Close")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContentStyled>
      </ModalStyled>

      {/* Following List Modal */}
      <ModalStyled isOpen={isFollowingModalOpen} onClose={closeFollowingModal} closeOnOverlayClick>
        <ModalContentStyled>
          <ModalHeader>
            <Text className="text-lg font-semibold">
              {t("Following")} ({followingList.length})
            </Text>
          </ModalHeader>
          <ModalBodyStyled>
            {isLoadingFollowing ? (
              <ActivityIndicator size="large" />
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                {followingList.length === 0 ? (
                  <Text className="text-sm text-gray-500">{t("Not following anyone yet")}</Text>
                ) : (
                  followingList.map(item => renderUserItem(item, false))
                )}
              </ScrollView>
            )}
          </ModalBodyStyled>
          <ModalFooter>
            <Button variant="outline" onPress={closeFollowingModal}>
              <ButtonText>{t("Close")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContentStyled>
      </ModalStyled>
    </MainContainer>
  );
};

export const Profile = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout title="Profile" isSidebarVisible isHeaderVisible={false}>
        <ProfileScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};