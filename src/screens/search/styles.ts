import { styled } from "@gluestack-style/react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "@/src/components/ui/button";
import { HStack, VStack } from "@gluestack-ui/themed";

export const MainContainer = styled(View, {
  flex: 1,
  backgroundColor: "$background0",
});

export const SearchHeader = styled(VStack, {
  padding: 16,
  paddingBottom: 8,
  backgroundColor: "$background0",
});

export const SearchInputContainer = styled(HStack, {
  alignItems: "center",
  marginBottom: 12,
  flex: 1,
  width: "100%",
  maxWidth: 700,
});

export const TabsContainer = styled(View, {
  gap: 12,
  marginBottom: 12,
  flexDirection: "row",
});

export const TabButton = styled(Button, {
  flex: 1,
  variants: {
    active: {
      true: {
        bg: "$primary600",
        _text: { color: "$white" },
      },
      false: {
        bg: "$background100",
        _text: { color: "$text700" },
      },
    },
  },
});

export const ContentScrollView = styled(ScrollView, {
  flex: 1,
  paddingHorizontal: 16,
  paddingBottom: "$24",
});

export const EmptyState = styled(VStack, {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 32,
});

export const EmptyStateText = styled(Text, {
  color: "$text500",
  fontSize: 16,
  textAlign: "center",
});

export const ClimbItem = styled(View, {
  padding: 16,
  marginBottom: 8,
  borderRadius: 12,
  backgroundColor: "$white",
  shadowColor: "$black",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 1,
  maxWidth: 700,
  alignSelf: "center",
  width: "100%",
});

export const ClimbRow = styled(View, {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 4,
});

export const ClimbTitle = styled(Text, {
  fontSize: 16,
  fontWeight: "600",
  color: "$text900",
  flex: 1,
});

export const ClimbGrade = styled(Text, {
  fontSize: 14,
  color: "$primary600",
  fontWeight: "700",
  marginLeft: 8,
  width: 48,
  textAlign: "right",
});

export const TagContainer = styled(View, {
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 4,
});

export const TagBadge = styled(Text, {
  fontSize: 12,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  backgroundColor: "$primary50",
  color: "$primary700",
  marginRight: 4,
  marginBottom: 4,
});

export const StatsContainer = styled(View, {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
  justifyContent: "space-between",
});

export const StatItem = styled(View, {
  flexDirection: "row",
  alignItems: "center",
  marginLeft: 12,
  gap: 8,
});

export const StatText = styled(Text, {
  fontSize: 14,
  color: "$text600",
});

export const StarIcon = styled(Text, {
  color: "$amber400",
  fontSize: 14,
});

export const HeartIcon = styled(Text, {
  color: "$rose400",
  fontSize: 14,
});
