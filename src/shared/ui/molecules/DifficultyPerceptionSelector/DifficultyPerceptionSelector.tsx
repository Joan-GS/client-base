import React from "react";
import { View } from "react-native";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react-native";

type Difficulty = "easier" | "accurate" | "harder";

export const DifficultyPerceptionSelector = ({
  value,
  onChange,
}: {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}) => (
  <View className="flex-row justify-center my-2">
    <Button
      variant={value === "easier" ? "solid" : "outline"}
      onPress={() => onChange("easier")}
      className="mx-1"
    >
      <ButtonIcon as={ChevronDown} />
      <ButtonText>Easier</ButtonText>
    </Button>

    <Button
      variant={value === "accurate" ? "solid" : "outline"}
      onPress={() => onChange("accurate")}
      className="mx-1"
    >
      <ButtonIcon as={ChevronRight} />
      <ButtonText>Accurate</ButtonText>
    </Button>

    <Button
      variant={value === "harder" ? "solid" : "outline"}
      onPress={() => onChange("harder")}
      className="mx-1"
    >
      <ButtonIcon as={ChevronUp} />
      <ButtonText>Harder</ButtonText>
    </Button>
  </View>
);

