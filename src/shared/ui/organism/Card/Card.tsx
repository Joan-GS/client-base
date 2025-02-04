import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import { Button, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";

interface CardData {
  bannerUri: string;
  title: string;
  description: string;
}

const HeadingCards: CardData[] = [
  { bannerUri: require("@/src/assets/dashboard/dashboard-layout/image.png"), title: "Update your profile", description: "Add your details" },
  { bannerUri: require("@/src/assets/dashboard/dashboard-layout/image2.png"), title: "Your skills", description: "Add your skills here" },
];

export const HeadingCard = ({ bannerUri, title, description }: CardData) => (
  <HStack space="md" className="border border-border-300 rounded-lg p-4 items-center justify-between">
    <HStack space="xl" className="items-center">
      <Avatar>
        <AvatarImage height={"100%"} width={"100%"} source={bannerUri} />
      </Avatar>
      <VStack>
        <Text className="font-semibold text-typography-900 line-clamp-1">{title}</Text>
        <Text className="line-clamp-1">{description}</Text>
      </VStack>
    </HStack>
    <Button size="xs">
      <ButtonText>Edit</ButtonText>
    </Button>
  </HStack>
);
