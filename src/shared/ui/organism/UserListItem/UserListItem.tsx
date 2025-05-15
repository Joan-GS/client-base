import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/src/components/ui/text";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Avatar } from "@/src/components/ui/avatar";

type UserListItemProps = {
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  isFollowing: boolean;
  onPressUser: () => void;
  onFollowPress: () => void;
  onUnfollowPress: () => void;
  currentUserId?: string;
  isLoading?: boolean; // Nuevo prop para manejar estado de carga
};

export const UserListItem = ({
  user,
  isFollowing,
  onPressUser,
  onFollowPress,
  onUnfollowPress,
  currentUserId,
  isLoading = false, // Valor por defecto false
}: UserListItemProps) => {
  const isCurrentUser = user.id === currentUserId;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
      }}
    >
      <Pressable
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        onPress={onPressUser}
      >
        <Avatar size="sm" source={{ uri: user.avatar }} />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            {user.username}
          </Text>
          {isCurrentUser && (
            <Text style={{ fontSize: 12, color: "#888" }}>(You)</Text>
          )}
        </View>
      </Pressable>

      {!isCurrentUser && (
        <Button 
          size="sm" 
          variant={isFollowing ? "outline" : "solid"} 
          onPress={isFollowing ? onUnfollowPress : onFollowPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={isFollowing ? "#000" : "#fff"} />
          ) : (
            <ButtonText>{isFollowing ? "Following" : "Follow"}</ButtonText>
          )}
        </Button>
      )}
    </View>
  );
};