import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { MenuIcon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { Avatar } from "@/src/components/ui/avatar";
import { Pressable } from "@/src/components/ui/pressable";

export const WebHeader = ({ title, toggleSidebar }: { title: string; toggleSidebar: () => void }) => (
  <HStack className="pt-4 pr-10 pb-3 bg-background-0 items-center justify-between border-b border-border-300">
    <HStack className="items-center">
      <Pressable onPress={toggleSidebar}>
        <Icon as={MenuIcon} size="lg" className="mx-5" />
      </Pressable>
      <Text className="text-2xl">{title}</Text>
    </HStack>

    <Avatar className="h-9 w-9">
      <Text className="font-light">A</Text>
    </Avatar>
  </HStack>
);
