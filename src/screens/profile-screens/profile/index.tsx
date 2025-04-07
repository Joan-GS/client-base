import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LogOutIcon, MessageCircle, ThumbsUp } from "lucide-react-native";
import { useRecoilValue } from "recoil";
import { Avatar } from "@/src/components/ui/avatar";
import { Text } from "@/src/components/ui/text";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { DashboardLayout } from "../../dashboard/dashboard-layout";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { EditIcon, Icon } from "@/src/components/ui/icon";
import { ModalHeader, ModalFooter } from "@/src/components/ui/modal";
import { Input, InputField } from "@/src/components/ui/input";
import GenericCard from "@/src/shared/ui/organism/Card/Card";
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
} from "./styles";
import { EditPhotoIcon } from "./assets/icons/edit-photo";
import { userState } from "@/src/recoil/users.recoil";
import { useProfile } from "./api/profile";

interface ProfileData {
  username: string;
  followers: number;
  createdRoutes: number;
  completedRoutes: number;
}

const initialProfileData: ProfileData = {
  username: "",
  followers: 0,
  createdRoutes: 0,
  completedRoutes: 0,
};

/**
 * Main ProfileScreen component that displays user information and stats
 */
const ProfileScreen = () => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Recoil state and custom hooks
  const user = useRecoilValue(userState);
  const { loadUserProfile, updateUserProfile } = useProfile();

  // Derived state for display
  const username = user?.username || profileData.username;
  const followersCount = user?.followers?.length || profileData.followers;
  const followingCount = user?.following?.length || 0;
  const createdRoutesCount = user?.myClimbs?.data?.length || profileData.createdRoutes;
  const completedRoutesCount = user?.ascensions?.length || profileData.completedRoutes;

  /**
   * Load user profile data when component mounts
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
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  /**
   * Handle profile updates
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
      }
      
      closeEditModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      // TODO: Add error toast/alert here
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

  if (isLoading) {
    return (
      <SafeAreaView className="h-full w-full flex items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full w-full">
      {/* Header with logout button */}
      <LogoutButton onPress={openLogoutModal}>
        <ButtonIcon color="black" as={LogOutIcon} size="lg" />
      </LogoutButton>

      {/* Profile section */}
      <ProfileContainer>
        <ProfileHeader>
          <Avatar size="2xl" />
          <ProfileText>
            <Text className="text-xl font-semibold">{username}</Text>
          </ProfileText>
        </ProfileHeader>

        {/* Stats section */}
        <StatsSection>
          <StatsItem>
            <Text className="font-semibold text-lg">{followersCount}</Text>
            <Text className="text-sm text-gray-500">{t("Followers")}</Text>
          </StatsItem>

          <StatsItem>
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

        {/* Edit profile button */}
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

      {/* User climbs grid */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          paddingHorizontal: 16,
          paddingTop: 16,
          gap: 12,
          zIndex: 0,
        }}
      >
        {user?.myClimbs?.data?.map((climb: any) => (
          <View key={climb.id} style={{ width: "30%", marginBottom: 16 }}>
            <GenericCard
              title={climb.title}
              subtitle={`Grade: ${climb.grade}`}
              description={climb.description || ""}
              primaryActionCount={climb.likesCount}
              secondaryActionCount={climb.commentsCount}
              primaryIcon={ThumbsUp}
              secondaryIcon={MessageCircle}
              onPrimaryAction={() => console.log("Like")}
              onSecondaryAction={() => console.log("Comment")}
              isLiked={climb.isLiked}
              imageUrl={climb.imageUrl || "https://placehold.co/600x400"}
            />
          </View>
        ))}
      </ScrollView>

      {/* Logout confirmation modal */}
      <ModalStyled
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        closeOnOverlayClick={true}
      >
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
            <Button variant="outline" onPress={closeLogoutModal}>
              <ButtonText>{t("Cancel")}</ButtonText>
            </Button>
            <Button variant="solid" onPress={logout} className="ml-2">
              <ButtonText>{t("Log Out")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContentStyled>
      </ModalStyled>

      {/* Edit profile modal */}
      <ModalStyled
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        closeOnOverlayClick={true}
      >
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
    </SafeAreaView>
  );
};

/**
 * Profile component wrapper with DashboardLayout
 */
export const Profile = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout
        title="Profile"
        isSidebarVisible={true}
        isHeaderVisible={false}
      >
        <ProfileScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};