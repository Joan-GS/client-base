import { DashboardLayout } from "../dashboard/dashboard-layout";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";

import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import {
  ArrowLeft,
  Bluetooth,
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  Tag,
  ThumbsUp,
  User,
} from "lucide-react-native";

// Styles
import {
  ClimbHeader,
  ClimbContent,
  ClimbContainer,
  ClimbImage,
  ClimbOverlay,
  DetailRow,
  DetailText,
  GradeText,
  SectionTitle,
  StatItem,
  StatLabel,
  StatsContainer,
  StatValue,
  TagPill,
  TagsContainer,
  BluetoothButton,
  BackButton,
  ClimbGrade,
  ClimbTitle,
  ClimbTitleContainer,
  DescriptionBox,
} from "./styles";

// API
import { handleRequest } from "@/src/utils/api/https.utils";
import { ButtonIcon, ButtonText} from "@gluestack-ui/themed";
import useBLE from "@/src/hooks/useBLE";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";


// Types
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
}

const MainContent = () => {
  const params = useLocalSearchParams();
  const climbId = params.climbId as string | undefined;
  const [climb, setClimb] = useState<Climb | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWebAlert, setShowWebAlert] = useState(false);
  const toast = useToast();

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
    const fetchClimb = async () => {
      try {
        const data = await handleRequest<Climb>(`/climbs/${climbId}`, "GET");
        setClimb(data);
      } catch (error) {
        console.error("Failed to fetch climb:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClimb();
  }, [climbId]);

  const sendToBluetooth = async () => {
    if (isWeb) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Bluetooth functionality is not available in web version</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    if (!climb) return;

    try {
      if (!connectedDevice) {
        await scanDevices();
        if (devices.length === 0) {
          toast.show({
            render: ({ id }) => (
              <Toast nativeID={id} action="error">
                <ToastTitle>No BLE devices found</ToastTitle>
              </Toast>
            ),
          });
          return;
        }
        await connectToDevice(devices[0]);
      }

      const dataToSend = JSON.stringify({
        climbId: climb.id,
        title: climb.title,
        grade: climb.grade,
        description: climb.description,
      });

      await sendData(dataToSend);
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Data sent successfully to Bluetooth device</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Failed to send via Bluetooth</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  if (isLoading || !climb) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
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
                  <ClimbTitle>{climb.title}</ClimbTitle>
                  <ClimbGrade>
                    <GradeText>{climb.grade}</GradeText>
                  </ClimbGrade>
                </ClimbTitleContainer>
              </ClimbOverlay>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: "#ccc",
                justifyContent: "flex-end",
                padding: 20,
              }}
            >
              <ClimbTitleContainer>
                <ClimbTitle style={{ color: "#333" }}>{climb.title}</ClimbTitle>
                <ClimbGrade style={{ backgroundColor: "#ddd" }}>
                  <GradeText style={{ color: "#333" }}>{climb.grade}</GradeText>
                </ClimbGrade>
              </ClimbTitleContainer>
            </View>
          )}

          <BackButton onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </BackButton>

          <BluetoothButton
            onPress={sendToBluetooth}
            disabled={isScanning || isConnecting || isSending}
          >
            <ButtonIcon as={Bluetooth} color="#fff" />
            <ButtonText color="#fff">
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
            <User size={18} color="#555" />
            <DetailText>
              {climb.author?.username || "Unknown author"}
            </DetailText>
          </DetailRow>

          <DetailRow>
            <MapPin size={18} color="#555" />
            <DetailText>
              {climb.wall?.name || "Location not specified"}
            </DetailText>
          </DetailRow>

          <DetailRow>
            <Calendar size={18} color="#555" />
            <DetailText>
              {new Date(climb.createdAt).toLocaleDateString()}
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
                {climb.tags.map((tag, index) => (
                  <TagPill key={index}>
                    <DetailRow>
                      <Tag size={14} color="#555" />
                      <DetailText>{tag}</DetailText>
                    </DetailRow>
                  </TagPill>
                ))}
              </TagsContainer>
            </>
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
    </ClimbContainer>
  );
};

export const ViewClimbPage = () => {
  return (
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
};
