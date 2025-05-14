// src/screens/auth/ResetPasswordScreen.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Yup from "yup";
import { Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useToast, Toast, ToastTitle } from "@/src/components/ui/toast";
import { AuthLayout } from "../layout";
import { GenericButton, GenericControlledInput } from "@/src/shared";
import { VStackContainer, FormsContainer, LoginTextsContainer } from "./styles";
import { Text } from "@/src/components/ui/text";
import { Heading } from "@/src/components/ui/heading";
import { Pressable } from "@/src/components/ui/pressable";
import { Icon } from "@/src/components/ui/icon";
import { ArrowLeftIcon } from "@/src/components/ui/icon";
import { useMediaQuery } from "@gluestack-style/react";
import { submitNewPassword } from "./api/create-password";
import { yupResolver } from "@hookform/resolvers/yup";

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

type ResetPasswordSchemaType = Yup.InferType<typeof resetPasswordSchema>;

const ResetPasswordScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });
  const [isLoading, setIsLoading] = React.useState(false);
  const { token } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    if (!token || typeof token !== "string") {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{t("Invalid reset link")}</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setIsLoading(true);
    try {
      await submitNewPassword({
        token,
        newPassword: data.newPassword,
      });

      toast.show({
        placement: "bottom",
        render: ({ id }) => (

          <Toast nativeID={id} action="success">
            <ToastTitle>{t("Password reset successfully!")}</ToastTitle>
          </Toast>
        ),
      });

      // Redirect to login after successful reset
      router.replace("/auth/signin");
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>
              {error instanceof Error ? error.message : "An error occurred"}
            </ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStackContainer>
      {isMediumScreen && (
        <Pressable
          onPress={() => router.back()}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Icon
            as={ArrowLeftIcon}
            size="xl"
            className="stroke-background-800"
          />
        </Pressable>
      )}
      <LoginTextsContainer>
        <Heading size="3xl">{t("Reset Password")}</Heading>
        <Text>{t("Create a new password for your account.")}</Text>
      </LoginTextsContainer>

      <FormsContainer>
        <GenericControlledInput
          control={control}
          name="newPassword"
          label={t("New Password")}
          placeholder={t("Enter new password")}
          secureTextEntry
          error={errors.newPassword?.message}
          onSubmitEditing={handleKeyPress}
          isPasswordField
        />

        <GenericControlledInput
          control={control}
          name="confirmPassword"
          label={t("Confirm Password")}
          placeholder={t("Confirm new password")}
          secureTextEntry
          error={errors.confirmPassword?.message}
          onSubmitEditing={handleKeyPress}
          isPasswordField
        />

        <GenericButton
          label={t("Reset Password")}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </FormsContainer>
    </VStackContainer>
  );
};

export const CreatePassword = () => (
  <AuthLayout>
    <ResetPasswordScreen />
  </AuthLayout>
);
