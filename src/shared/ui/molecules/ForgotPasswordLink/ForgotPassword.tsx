import { Pressable } from "@/src/components/ui/pressable";
import { router } from "expo-router";
import { ForgotPasswordText } from "./styles";

type Props = {
  label: string;
  redirectTo?: Parameters<typeof router.push>[0];
};

export const ForgotPasswordLink = ({
  label,
  redirectTo = "/auth/forgot-password",
}: Props) => (
  <Pressable onPress={() => router.push(redirectTo)}>
    <ForgotPasswordText>{label}</ForgotPasswordText>
  </Pressable>
);
