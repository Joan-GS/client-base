// view-climb.styles.ts
import { styled } from "@gluestack-style/react";
import { Button } from "@/src/components/ui/button";
import { Pressable } from "@/src/components/ui/pressable";
import { View, Image } from "@gluestack-ui/themed";
import { Text } from "@/src/components/ui/text";

export const ClimbContainer = styled(View, {
  flex: 1,
  backgroundColor: "#fff",
  marginBottom: 60
});

export const ClimbHeader = styled(View, {
  position: "relative",
  width: "100%",
  maxHeight: 600,
  minHeight: 300,
  overflow: "hidden",
  alignItems: "center",
});

export const ClimbImage = styled(Image, {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
  position: "relative",
  top: 0,
  left: 0,
  minHeight: 500,
  maxHeight: 700,
  maxWidth: 700,
});

export const ClimbOverlay = styled(View, {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  justifyContent: "flex-end",
  padding: 24,
});

export const ClimbTitleContainer = styled(View, {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
});

export const ClimbTitle = styled(Text, {
  fontSize: 28,
  fontWeight: "800",
  color: "#fff",
  maxWidth: "70%",
  textShadowColor: "rgba(0,0,0,0.5)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
});

export const ClimbGrade = styled(View, {
  backgroundColor: "rgba(255,255,255,0.15)",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  backdropFilter: "blur(4px)",
});

export const GradeText = styled(Text, {
  fontSize: 18,
  fontWeight: "700",
  color: "#fff",
});

export const ClimbContent = styled(View, {
  padding: 24,
});

export const DetailRow = styled(View, {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
});

export const DetailText = styled(Text, {
  fontSize: 16,
  color: "#444",
});

export const SectionTitle = styled(Text, {
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 16,
  color: "#222",
  marginTop: 8,
});

export const DescriptionBox = styled(View, {
  backgroundColor: "#f9f9f9",
  padding: 18,
  borderRadius: 12,
  marginBottom: 24,
});

export const TagsContainer = styled(View, {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 24,
});

export const TagPill = styled(View, {
  backgroundColor: "#f0f0f0",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 16,
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
});

export const StatsContainer = styled(View, {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 24,
  paddingTop: 24,
  borderTopWidth: 1,
  borderTopColor: "#f0f0f0",
});

export const StatItem = styled(View, {
  alignItems: "center",
  gap: 4,
});

export const StatValue = styled(Text, {
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
});

export const StatLabel = styled(Text, {
  fontSize: 14,
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: 0.5,
});

export const BackButton = styled(Pressable, {
  position: "absolute",
  top: 48,
  left: 20,
  zIndex: 20,
  backgroundColor: "rgba(0,0,0,0.4)",
  padding: 10,
  borderRadius: 30,
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
});

export const BluetoothButton = styled(Button, {
  position: "absolute",
  top: 48,
  right: 20,
  zIndex: 20,
  backgroundColor: "rgba(0,0,0,0.4)",
  borderRadius: 30,
  paddingHorizontal: 16,
  height: 40,
  minWidth: 80,
});

// styles.ts
export const ModalContainer = styled(View, {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
});

export const ModalContent = styled(View, {
  backgroundColor: "white",
  borderRadius: 12,
  padding: 20,
  width: "80%",
  maxHeight: "60%",
});

export const DeviceItem = styled(Pressable, {
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
});

export const DeviceText = styled(Text, {
  fontSize: 16,
});