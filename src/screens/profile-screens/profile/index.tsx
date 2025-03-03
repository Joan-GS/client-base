import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { ModalBackdrop } from "@gluestack-ui/themed";

const initialProfileData = {
  username: "John Doe",
  followers: 1200,
  createdRoutes: 15,
  completedRoutes: 30,
  avatar: "https://example.com/avatar.jpg",
};

const ProfileScreen = () => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const saveProfileChanges = () => {
    setProfileData({
      ...profileData,
      username: profileData.username,
      avatar: profileData.avatar,
    });
    closeEditModal();
  };

  return (
    <SafeAreaView className="h-full w-full">
      <ProfileContainer>
        <ProfileHeader>
          <Avatar size="2xl" />
          <ProfileText>
            <Text className="text-xl font-semibold">
              {profileData.username}
            </Text>
          </ProfileText>
        </ProfileHeader>

        <StatsSection>
          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.createdRoutes}
            </Text>
            <Text className="text-sm text-gray-500">{t("Followers")}</Text>
          </StatsItem>

          <Divider className="my-0.4" orientation="vertical" />

          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.createdRoutes}
            </Text>
            <Text className="text-sm text-gray-500">{t("Following")}</Text>
          </StatsItem>

          <Divider className="my-0.4" orientation="vertical" />

          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.completedRoutes}
            </Text>
            <Text className="text-sm text-gray-500">{t("My Climbs")}</Text>
          </StatsItem>

          <Divider className="my-0.4" orientation="vertical" />

          <StatsItem>
            <Text className="font-semibold text-lg">
              {profileData.completedRoutes}
            </Text>
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

      {isEditModalOpen && (
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
                <ModalAvatarPressableStyled className=" bg-background-500 rounded-full items-center justify-center h-8 w-8 right-6 top-44">
                  <Icon as={EditPhotoIcon} />
                </ModalAvatarPressableStyled>
              </ModalAvatarStyled>

              <Text className="text-sm font-semibold">{t("Username")}</Text>
              <Input>
                <InputField value={profileData.username} />
              </Input>

              <Text className="text-sm font-semibold mt-2">
                {t("AvatarURL")}
              </Text>
              <Input>
                <InputField value={profileData.avatar} />
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
        title="Profile"
        isSidebarVisible={true}
        isHeaderVisible={false}
      >
        <ProfileScreen />
      </DashboardLayout>
    </SafeAreaView>
  );
};
