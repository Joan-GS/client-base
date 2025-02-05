import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Hook for translation
import { Avatar } from "@/src/components/ui/avatar";
import { Text } from "@/src/components/ui/text";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { DashboardLayout } from "../../dashboard/dashboard-layout";
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
} from "./styles";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { EditIcon, Icon } from "@/src/components/ui/icon";
import { ModalHeader, ModalFooter } from "@/src/components/ui/modal";
import { Input, InputField } from "@/src/components/ui/input";
import { EditPhotoIcon } from "./assets/icons/edit-photo";
import { Divider } from "@/src/components/ui/divider";

// Mock data for the profile
const initialProfileData = {
  username: "John Doe",
  followers: 1200,
  createdRoutes: 15,
  completedRoutes: 30,
  avatar: "https://example.com/avatar.jpg", // Default avatar URL
};

const ProfileScreen = () => {
  const { t } = useTranslation(); // Translation hook

  // State management for settings and modal visibility
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);

  // Open the Edit Profile modal
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Close the Edit Profile modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Save the changes made in the profile
  const saveProfileChanges = () => {
    setProfileData({
      ...profileData,
      username: profileData.username, // Save the modified username
      avatar: profileData.avatar, // Save the modified avatar URL
    });
    closeEditModal();
  };

  return (
    <SafeAreaView className="h-full w-full">
      {/* Profile container */}
      <ProfileContainer>
        {/* Profile header with avatar and username */}
        <ProfileHeader>
          <Avatar size="2xl" /> {/* Avatar of the user */}
          <ProfileText>
            <Text className="text-xl font-semibold">
              {profileData.username}
            </Text>
          </ProfileText>
        </ProfileHeader>

        {/* Followers and Stats Section */}
        <StatsSection>
          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.createdRoutes}{" "}
              {/* Display number of created routes */}
            </Text>
            <Text className="text-sm text-gray-500">{t("Followers")}</Text>
          </StatsItem>

          {/* Divider between stats */}
          <Divider className="my-0.4" orientation="vertical" />

          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.createdRoutes}{" "}
              {/* Display number of created routes */}
            </Text>
            <Text className="text-sm text-gray-500">{t("Following")}</Text>
          </StatsItem>

          <Divider className="my-0.4" orientation="vertical" />

          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.completedRoutes}{" "}
              {/* Display number of completed routes */}
            </Text>
            <Text className="text-sm text-gray-500">{t("My Climbs")}</Text>
          </StatsItem>

          <Divider className="my-0.4" orientation="vertical" />

          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.completedRoutes} {/* Display number of climbs */}
            </Text>
            <Text className="text-sm text-gray-500">{t("Climbs")}</Text>
          </StatsItem>
        </StatsSection>

        {/* Edit Profile Button */}
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <ModalStyled isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalContentStyled>
            {/* Modal Header */}
            <ModalHeader>
              <Text>{t("Edit Profile")}</Text>
            </ModalHeader>
            <ModalBodyStyled>
              {/* Avatar upload section */}
              <ModalAvatarStyled>
                <Avatar size="2xl" /> {/* Avatar preview */}
                <ModalAvatarPressableStyled className=" bg-background-500 rounded-full items-center justify-center h-8 w-8 right-6 top-44">
                  <Icon as={EditPhotoIcon} /> {/* Icon to edit photo */}
                </ModalAvatarPressableStyled>
              </ModalAvatarStyled>

              {/* Username input */}
              <Text className="text-sm font-semibold">{t("Username")}</Text>
              <Input>
                <InputField
                  value={initialProfileData.username} // Display current username
                />
              </Input>

              {/* Avatar URL input */}
              <Text className="text-sm font-semibold mt-2">
                {t("AvatarURL")}
              </Text>
              <Input>
                <InputField
                  value={initialProfileData.avatar} // Display current avatar URL
                />
              </Input>
            </ModalBodyStyled>

            {/* Modal Footer with action buttons */}
            <ModalFooter>
              <Button variant="outline" onPress={closeEditModal}>
                <ButtonText>{t("Cancel")}</ButtonText>
              </Button>
              <Button
                variant="solid"
                onPress={saveProfileChanges}
                className="ml-2"
              >
                <ButtonText>{t("Save")}</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContentStyled>
        </ModalStyled>
      )}
    </SafeAreaView>
  );
};

export const Profile = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <DashboardLayout
        title="Profile" // Dashboard layout with the profile title
        isSidebarVisible={true}
        isHeaderVisible={false}
      >
        <ProfileScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
