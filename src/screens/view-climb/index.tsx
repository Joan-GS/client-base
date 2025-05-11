import { DashboardLayout } from "../dashboard/dashboard-layout";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";

import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import {
  ArrowLeft,
  Bluetooth,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Heart,
  MapPin,
  MessageCircle,
  Star,
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
import { ButtonIcon } from "@gluestack-ui/themed";
import useBLE from "@/src/hooks/useBLE";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { Button, ButtonText } from "@/src/components/ui/button";
import { ascendClimb, fetchClimb } from "./api/view-climb";
import { ASCENSION_TYPE } from "@joan16/shared-base";

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
  isAscended?: boolean;
  userRating?: number;
  difficultyPerception?: "easier" | "accurate" | "harder";
}

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (value: number) => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "center",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          onPress={() => setRating(star)}
          style={{ padding: 4, backgroundColor: "transparent" }}
        >
          <ButtonIcon as={Star} color={star <= rating ? "#FFD700" : "#ccc"} />
        </Button>
      ))}
    </View>
  );
};

const MainContent = () => {
  const params = useLocalSearchParams();
  const climbId = params.climbId as string | undefined;
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
    const fetchClimbData = async () => {
      try {
        const climbData = await fetchClimb(climbId || "");
        console.log("Climb data:", climbData);
        setClimb(climbData);
        setIsCompleted(climbData.isAscended || false);
        if (climbData.userRating) {
          setUserRating(climbData.userRating);
        }
        if (climbData.difficultyPerception) {
          setDifficultyPerception(climbData.difficultyPerception);
        }
        setShowRating(false); // No mostrar rating al cargar inicialmente
      } catch (err) {
        console.error("Failed to fetch climb:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClimbData();
  }, [climbId]);

  const handleCompleteClimb = async () => {
    if (!climbId) return;

    setIsLoadingCompletion(true);
    try {
      console.log("Completing climb:", climbId, "Type:", ASCENSION_TYPE.FLASH);
      await ascendClimb(climbId, ASCENSION_TYPE.FLASH);
      setIsCompleted(true);
      setShowRating(true); // Mostrar el rating solo después de completar
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>¡Ascensión registrada correctamente!</ToastTitle>
          </Toast>
        ),
      });

      const response = await fetchClimb(climbId);
      if (response.data) {
        setClimb(response.data);
      }
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Error al registrar la ascensión</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoadingCompletion(false);
    }
  };

  const DifficultyPerception = ({
    value,
    onChange,
  }: {
    value: "easier" | "accurate" | "harder";
    onChange: (value: "easier" | "accurate" | "harder") => void;
  }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 10,
        }}
      >
        <Button
          variant={value === "easier" ? "solid" : "outline"}
          onPress={() => onChange("easier")}
          style={{ marginHorizontal: 4 }}
        >
          <ButtonIcon
            as={ChevronDown}
            color={value === "accurate" ? "white" : "#555"}
          />
          <ButtonText>Easier</ButtonText>
        </Button>

        <Button
          variant={value === "accurate" ? "solid" : "outline"}
          onPress={() => onChange("accurate")}
          style={{ marginHorizontal: 4 }}
        >
          <ButtonIcon
            as={ChevronRight}
            color={value === "accurate" ? "white" : "#555"}
          />
          <ButtonText>Accurate</ButtonText>
        </Button>

        <Button
          variant={value === "harder" ? "solid" : "outline"}
          onPress={() => onChange("harder")}
          style={{ marginHorizontal: 4 }}
        >
          <ButtonIcon
            as={ChevronUp}
            color={value === "harder" ? "white" : "#555"}
          />
          <ButtonText>Harder</ButtonText>
        </Button>
      </View>
    );
  };

  const saveRating = async () => {
    if (!climbId) return;

    setIsRatingLoading(true);
    try {
      // await handleRequest({
      //   url: `/climbs/${climbId}/rate`,
      //   method: 'POST',
      //   data: {
      //     rating: userRating,
      //     difficultyPerception
      //   }
      // });

      setShowRating(false); // Ocultar el rating después de enviarlo
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>Rating saved successfully!</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>Error saving rating</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsRatingLoading(false);
    }
  };

  const sendToBluetooth = async () => {
    if (isWeb) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>
              Bluetooth functionality is not available in web version
            </ToastTitle>
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

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!climb) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>No se encontró la ruta</Text>
        <Button onPress={() => router.back()}>
          <ButtonText>Volver</ButtonText>
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

          <Button
            onPress={handleCompleteClimb}
            disabled={isCompleted || isLoadingCompletion}
            style={{
              backgroundColor: isCompleted ? "#ccc" : "#4CAF50",
              marginTop: 20,
              maxWidth: 900,
              minWidth: 300,
              alignSelf: "center",
            }}
          >
            <ButtonIcon as={isCompleted ? Check : Check} color={"white"} />

            <ButtonText>
              <Text>
                {isLoadingCompletion
                  ? "Saving..."
                  : isCompleted
                  ? "Completed"
                  : "Log Ascent"}
              </Text>
            </ButtonText>
          </Button>

          {isCompleted && showRating && (
            <View
              style={{
                marginTop: 20,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <SectionTitle>Rate this climb</SectionTitle>

              <Text style={{ marginBottom: 8, textAlign: "center" }}>
                How would you rate this climb?
              </Text>
              <StarRating rating={userRating} setRating={setUserRating} />

              <Text style={{ marginBottom: 8, textAlign: "center" }}>
                How did the difficulty feel?
              </Text>
              <DifficultyPerception
                value={difficultyPerception}
                onChange={setDifficultyPerception}
              />

              <Button
                onPress={saveRating}
                disabled={isRatingLoading || userRating === 0}
                style={{ marginTop: 16 }}
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
