import React from "react";
import { View } from "react-native";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { Star } from "lucide-react-native";

export const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (value: number) => void;
}) => {
  return (
    <View className="flex-row my-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          onPress={() => setRating(star)}
          style={{ padding: 4, backgroundColor: "transparent" }}
        >
          <ButtonIcon as={Star} color={star <= rating ? "#FFD700" : "#ccc"} />
        </Button>
      ))}
    </View>
  );
};