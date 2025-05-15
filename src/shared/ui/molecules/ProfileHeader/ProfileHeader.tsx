import { View } from "react-native";
import { Text } from "@/src/components/ui/text";
import { Avatar } from "@/src/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { EditIcon } from "@/src/components/ui/icon";

type ProfileHeaderProps = {
  username: string;
  avatar?: string;
  isCurrentUser?: boolean;
  onEditPress?: () => void;
  isFollowing?: boolean;
  onFollowPress?: () => void;
};

export const ProfileHeader = ({
  username,
  avatar,
  isCurrentUser = false,
  onEditPress,
  isFollowing = false,
  onFollowPress,
}: ProfileHeaderProps) => {
  return (
    <View style={{ alignItems: "center", marginBottom: 16 }}>
      <Avatar size="2xl" source={{ uri: avatar }} />
      <Text className="text-xl font-semibold mt-4">{username}</Text>
      
      {isCurrentUser ? (
        <Button
          variant="outline"
          action="secondary"
          onPress={onEditPress}
          className="gap-3 relative mt-4"
        >
          <ButtonText className="text-dark">Edit Profile</ButtonText>
          <ButtonIcon as={EditIcon} />
        </Button>
      ) : (
        <Button
          variant={isFollowing ? "outline" : "solid"}
          onPress={onFollowPress}
          className="mt-4"
        >
          <Text className={isFollowing ? "text-black" : "text-white"}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </Button>
      )}
    </View>
  );
};