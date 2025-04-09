import { styled } from "@gluestack-style/react";
import { View, Text, ScrollView } from "react-native";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Box, HStack, VStack } from "@gluestack-ui/themed";

export const MainContainer = styled(View, {
  flex: 1,
  backgroundColor: "$background0",
});

export const SearchHeader = styled(VStack, {
  padding: "$4",
  paddingBottom: "$2",
  backgroundColor: "$background0",
});

export const SearchInputContainer = styled(HStack, {
  alignItems: "center",
  marginBottom: "$3",
  flex: 1,
  width: "100%",
});

export const TabsContainer = styled(Box, {
  gap: "$4",
  marginBottom: "$4",
  flexDirection: "row",
});

export const TabButton = styled(Button, {
  flex: 1,
  variants: {
    active: {
      true: {
        bg: "$primary500",
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
  paddingHorizontal: "$4",
});

export const EmptyState = styled(VStack, {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: "$8",
});

export const EmptyStateText = styled(Text, {
  color: "$text500",
  fontSize: "$md",
  textAlign: "center",
});
