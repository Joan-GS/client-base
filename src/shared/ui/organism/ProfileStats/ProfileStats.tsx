import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/text";
import { Divider } from "@/src/components/ui/divider";

type StatsItemProps = {
  value: number | string;
  label: string;
  onPress?: () => void;
};

const StatsItem = ({ value, label, onPress }: StatsItemProps) => (
  <Pressable onPress={onPress}>
    <View style={{ alignItems: "center" }}>
      <Text className="font-semibold text-lg">{value}</Text>
      <Text className="text-sm text-gray-500">{label}</Text>
    </View>
  </Pressable>
);

type ProfileStatsProps = {
  followersCount: number;
  followingCount: number;
  createdRoutesCount: number;
  completedRoutesCount: number;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onCreatedRoutesPress: () => void;
  onCompletedRoutesPress: () => void;
};

export const ProfileStats = ({
  followersCount,
  followingCount,
  createdRoutesCount,
  completedRoutesCount,
  onFollowersPress,
  onFollowingPress,
  onCreatedRoutesPress,
  onCompletedRoutesPress,
}: ProfileStatsProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
      }}
    >
      <StatsItem
        value={followersCount}
        label="Followers"
        onPress={onFollowersPress}
      />
      <Divider orientation="vertical" />
      <StatsItem
        value={followingCount}
        label="Following"
        onPress={onFollowingPress}
      />
      <Divider orientation="vertical" />

      <StatsItem
        value={createdRoutesCount}
        label="My Climbs"
        onPress={onCreatedRoutesPress}
      />
      <Divider orientation="vertical" />

      <StatsItem
        value={completedRoutesCount}
        label="Climbs"
        onPress={onCompletedRoutesPress}
      />
    </View>
  );
};
