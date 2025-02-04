import { WebHeaderContainer, HeaderTitle, MenuButton, AvatarContainer } from "./styles";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { MenuIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";

interface WebHeaderProps {
  title: string;
  toggleSidebar: () => void;
}

export const WebHeader = ({ title, toggleSidebar }: WebHeaderProps) => (
  <WebHeaderContainer>
    <HStack className="items-center">
      <MenuButton onPress={toggleSidebar}>
        <Icon as={MenuIcon} size="lg" className="mx-5" />
      </MenuButton>
      <HeaderTitle>{title}</HeaderTitle>
    </HStack>

    <AvatarContainer>
      <Text className="font-light">A</Text>
    </AvatarContainer>
  </WebHeaderContainer>
);
