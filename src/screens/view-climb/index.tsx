import { DashboardLayout } from "../dashboard/dashboard-layout";
import { SafeAreaView } from "@/src/components/ui/safe-area-view";

import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { ArrowLeft, Bluetooth, Calendar, MapPin, MessageCircle, Tag, ThumbsUp, User } from "lucide-react-native";

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
import { ButtonIcon, ButtonText } from "@gluestack-ui/themed";

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
    const [isSending, setIsSending] = useState(false);
  
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
      if (!climb) return;
      setIsSending(true);
      try {
        console.log("Sending climb to device:", climb);
      } catch (error) {
        console.error("Failed to send via Bluetooth:", error);
      } finally {
        setIsSending(false);
      }
    };
  
    if (isLoading || !climb) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
              <View style={{ flex: 1, backgroundColor: "#ccc", justifyContent: "flex-end", padding: 20 }}>
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
            
            <BluetoothButton onPress={sendToBluetooth}>
              <ButtonIcon as={Bluetooth} color="#fff" />
              <ButtonText color="#fff">
                {isSending ? "Sending..." : "Send"}
              </ButtonText>
            </BluetoothButton>
          </ClimbHeader>
  
          <ClimbContent>
            <SectionTitle>Route Details</SectionTitle>
            
            <DetailRow>
              <User size={18} color="#555" />
              <DetailText>{climb.author?.username || "Unknown author"}</DetailText>
            </DetailRow>
            
            <DetailRow>
              <MapPin size={18} color="#555" />
              <DetailText>{climb.wall?.name || "Location not specified"}</DetailText>
            </DetailRow>
            
            <DetailRow>
              <Calendar size={18} color="#555" />
              <DetailText>{new Date(climb.createdAt).toLocaleDateString()}</DetailText>
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
                  <ThumbsUp size={18} color="#555" />
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
        <DashboardLayout title="View Climb" isSidebarVisible isHeaderVisible={false}>
          <MainContent />
        </DashboardLayout>
      </SafeAreaView>
    );
  };