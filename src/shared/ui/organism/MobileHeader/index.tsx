import { Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronLeftIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { StyledHeaderContainer } from "./styles";

export const MobileHeader = ({ title }: { title: string }) => (
  <StyledHeaderContainer>
    <Pressable onPress={() => router.back()}>
      {/* <ChevronLeftIcon /> */}
    </Pressable>
    <Text className="text-xl">{title}</Text>
  </StyledHeaderContainer>
);
