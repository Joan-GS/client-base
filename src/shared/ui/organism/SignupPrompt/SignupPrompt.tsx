import { router, Router } from "expo-router";
import { PromptContainer, PromptLinkText } from "./styles";
import { Pressable } from "@/src/components/ui/pressable";
import { Text } from "@/src/components/ui/text";

type Props = {
  message: string;
  actionText: string;
  redirectTo: Parameters<typeof router.push>[0];
};

export const SignupPrompt = ({ message, actionText, redirectTo }: Props) => (
  <PromptContainer>
    <Text>{message}</Text>
    <Pressable onPress={() => router.push(redirectTo)}>
      <PromptLinkText>{actionText}</PromptLinkText>
    </Pressable>
  </PromptContainer>
);
