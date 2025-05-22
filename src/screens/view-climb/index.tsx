// index.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Bluetooth,
  ArrowLeft,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Tag,
  User,
  Check,
} from "lucide-react-native";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { Button, ButtonText, ButtonIcon } from "@/src/components/ui/button";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import useBLE from "@/src/hooks/useBLE";
import { ascendClimb, fetchClimb } from "./api/view-climb";
import { ASCENSION_TYPE } from "@joan16/shared-base";
import { DifficultyPerceptionSelector, StarRating } from "@/src/shared";

// Import styles from the separate file
import {
  ClimbContainer,
  ClimbHeader,
  ClimbOverlay,
  ClimbImage,
  ClimbTitleContainer,
  ClimbTitle,
  ClimbContent,
  ClimbGrade,
  GradeText,
  SectionTitle,
  DetailRow,
  DetailText,
  DescriptionBox,
  TagPill,
  TagsContainer,
  BackButton,
  BluetoothButton,
  StatItem,
  StatValue,
  StatLabel,
  StatsContainer,
  ModalContainer,
  ModalContent,
  DeviceItem,
  DeviceText,
} from "./styles";
import { Heading } from "@/src/components/ui/heading";

interface Climb {
  id: string;
  title: string;
  grade: string;
  description?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  imageUrl?: string;
  createdAt: string;
  author?: {
    username: string;
  };
  wall?: {
    name: string;
  };
  tags?: string[];
  isAscended?: boolean;
  userRating?: number;
  difficultyPerception?: "easier" | "accurate" | "harder";
}

const MainContent = () => {
  const params = useLocalSearchParams();
  const climbId = params.climbId as string | undefined;
  const toast = useToast();
  const [climb, setClimb] = useState<Climb | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingCompletion, setIsLoadingCompletion] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [difficultyPerception, setDifficultyPerception] = useState<
    "easier" | "accurate" | "harder"
  >("accurate");
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);

  const {
    scanDevices,
    connectToDevice,
    sendData,
    disconnectFromDevice,
    devices,
    connectedDevice,
    isScanning,
    isConnecting,
    isSending,
    isWeb,
  } = useBLE();

  useEffect(() => {
    const loadClimb = async () => {
      try {
        if (!climbId) return;
        const climbData = await fetchClimb(climbId);
        setClimb(climbData);
        setIsCompleted(climbData.isAscended || false);
        setUserRating(climbData.userRating || 0);
        setDifficultyPerception(climbData.difficultyPerception || "accurate");
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadClimb();
  }, [climbId]);

  const handleCompleteClimb = async () => {
    if (!climbId) return;
    setIsLoadingCompletion(true);
    try {
      await ascendClimb(climbId, ASCENSION_TYPE.FLASH);
      setIsCompleted(true);
      setShowRating(true);
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Climb logged!</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Error saving ascent: {errorMessage}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoadingCompletion(false);
    }
  };

  const saveRating = async () => {
    if (!climbId) return;
    setIsRatingLoading(true);
    try {
      // Request would be here
      setShowRating(false);
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Rating saved</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Rating failed";
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{errorMessage}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsRatingLoading(false);
    }
  };

  const openBluetoothModal = async () => {
    if (isWeb || !climb) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Bluetooth not available</ToastTitle>
          </Toast>
        ),
      });
      return;
    }
    setShowBluetoothModal(true);
    try {
      await scanDevices();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to scan devices";
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{errorMessage}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const connectAndSend = async (device: any) => {
    try {
      await connectToDevice(device);
      const dataToSend = JSON.stringify({
        climbId: climb?.id,
        title: climb?.title,
        grade: climb?.grade,
        description: climb?.description,
      });
      await sendData(dataToSend);
      setShowBluetoothModal(false);
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Data sent to {device.name}</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect/send";
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{errorMessage}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!climb) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Climb not found</Text>
        <Button onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <ClimbContainer>
      <ScrollView>
        <ClimbHeader>
          {climb.imageUrl ? (
            <>
              <ClimbImage source={{ uri: climb.imageUrl }} />
              <ClimbOverlay>
                <ClimbTitleContainer>
                  <Heading size="2xl" style={{color: "gray"}}>{climb.title}</Heading>
                  <ClimbGrade>
                    <GradeText>{climb.grade}</GradeText>
                  </ClimbGrade>
                </ClimbTitleContainer>
              </ClimbOverlay>
            </>
          ) : (
            <View className="flex-1 bg-gray-300 justify-end p-6">
              <ClimbTitleContainer>
                <Heading className="text-gray-900">{climb.title}</Heading>
                <ClimbGrade className="bg-gray-200">
                  <GradeText className="text-gray-900">{climb.grade}</GradeText>
                </ClimbGrade>
              </ClimbTitleContainer>
            </View>
          )}

          <BackButton onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </BackButton>

          <BluetoothButton
            onPress={openBluetoothModal}
            disabled={isScanning || isConnecting || isSending}
          >
            <ButtonIcon as={Bluetooth} color="#fff" />
            <ButtonText>
              {isSending
                ? "Sending..."
                : isConnecting
                ? "Connecting..."
                : isScanning
                ? "Scanning..."
                : connectedDevice
                ? "Send"
                : "Connect & Send"}
            </ButtonText>
          </BluetoothButton>
        </ClimbHeader>

        <ClimbContent>
          <SectionTitle>Route Details</SectionTitle>
          <DetailRow>
            <MapPin size={18} color="#555" />
            <DetailText>{climb.isAscended || "Not specified"}</DetailText>
          </DetailRow>
          <DetailRow>
            <Calendar size={18} color="#555" />
            <DetailText>
              {climb.createdAt}
            </DetailText>
          </DetailRow>

          {climb.description && (
            <>
              <SectionTitle>Description</SectionTitle>
              <DescriptionBox>
                <DetailText>{climb.description}</DetailText>
              </DescriptionBox>
            </>
          )}

          {climb.tags && climb.tags.length > 0 && (
            <>
              <SectionTitle>Tags</SectionTitle>
              <TagsContainer>
                {climb.tags.map((tag, idx) => (
                  <TagPill key={idx}>
                    <DetailRow>
                      <Tag size={14} color="#555" />
                      <DetailText>{tag}</DetailText>
                    </DetailRow>
                  </TagPill>
                ))}
              </TagsContainer>
            </>
          )}

          <Button
            onPress={handleCompleteClimb}
            disabled={isCompleted || isLoadingCompletion}
            style={{ backgroundColor: isCompleted ? "#ccc" : "#4CAF50" }}
          >
            <ButtonIcon as={Check} color="white" />
            <ButtonText>
              {isLoadingCompletion
                ? "Saving..."
                : isCompleted
                ? "Completed"
                : "Log Ascent"}
            </ButtonText>
          </Button>

          {isCompleted && showRating && (
            <View className="mt-6 p-4 bg-gray-100 rounded-lg">
              <SectionTitle>Rate this climb</SectionTitle>
              <Text className="text-center mb-2">
                How would you rate this climb?
              </Text>
              <StarRating rating={userRating} setRating={setUserRating} />
              <Text className="text-center mb-2">
                How did the difficulty feel?
              </Text>
              <DifficultyPerceptionSelector
                value={difficultyPerception}
                onChange={setDifficultyPerception}
              />
              <Button
                onPress={saveRating}
                disabled={isRatingLoading || userRating === 0}
                className="mt-4"
              >
                <ButtonText>
                  {isRatingLoading ? "Saving..." : "Submit Rating"}
                </ButtonText>
              </Button>
            </View>
          )}

          <StatsContainer>
            <StatItem>
              <DetailRow>
                <Heart size={18} color="red" />
                <StatValue>{climb.likesCount}</StatValue>
              </DetailRow>
              <StatLabel>Likes</StatLabel>
            </StatItem>
            <StatItem>
              <DetailRow>
                <MessageCircle size={18} color="#555" />
                <StatValue>{climb.commentsCount}</StatValue>
              </DetailRow>
              <StatLabel>Comments</StatLabel>
            </StatItem>
          </StatsContainer>
        </ClimbContent>
      </ScrollView>

      {/* Bluetooth Device Selection Modal */}
      <Modal
        visible={showBluetoothModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBluetoothModal(false)}
      >
        <ModalContainer>
          <ModalContent>
            <Text className="text-lg font-bold mb-4">Select Bluetooth Device</Text>
            {isScanning ? (
              <View className="flex items-center justify-center py-8">
                <ActivityIndicator size="large" />
                <Text className="mt-4">Scanning for devices...</Text>
              </View>
            ) : devices.length === 0 ? (
              <Text className="text-center py-8">No devices found</Text>
            ) : (
              <View>
                {devices.map((device, index) => (
                  <DeviceItem key={index} onPress={() => connectAndSend(device)}>
                    <DeviceText>{device.name || "Unknown Device"}</DeviceText>
                  </DeviceItem>
                ))}
              </View>
            )}
            <Button
              variant="outline"
              onPress={() => setShowBluetoothModal(false)}
              className="mt-4"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </ClimbContainer>
  );
};

export const ViewClimbPage = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <DashboardLayout
      title="View Climb"
      isSidebarVisible
      isHeaderVisible={false}
    >
      <MainContent />
    </DashboardLayout>
  </SafeAreaView>
);