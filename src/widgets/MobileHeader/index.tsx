import { Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronLeftIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { AvatarContainer, HeaderTitle, StyledHeaderContainer } from "./styles";

export const MobileHeader = ({ title }: { title: string }) => (
  <StyledHeaderContainer>
    <HeaderTitle>{title}</HeaderTitle>
    <AvatarContainer>
      <Text className="font-light">A</Text>
    </AvatarContainer>
  </StyledHeaderContainer>
);
