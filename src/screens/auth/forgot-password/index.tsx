// src/screens/auth/ForgotPasswordScreen.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "expo-router";
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
import { requestPasswordReset } from "./api/forgot-password";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ForgotPasswordSchemaType = yup.InferType<typeof forgotPasswordSchema>;

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setIsLoading(true);
    try {
      const response = await requestPasswordReset(data.email);

      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>{response.message}</ToastTitle>
          </Toast>
        ),
      });

      router.back();
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>
              {error instanceof Error
                ? error.message
                : t("Failed to send reset link. Please try again.")}
            </ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
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
        <Heading size="3xl">{t("Forgot Password")}</Heading>
        <Text>{t("Enter your email to receive a password reset link")}</Text>
      </LoginTextsContainer>

      <FormsContainer>
        <GenericControlledInput
          control={control}
          name="email"
          label={t("Email")}
          placeholder={t("Enter your email")}
          error={errors.email?.message}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <GenericButton
          label={t("Send Reset Link")}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </FormsContainer>
    </VStackContainer>
  );
};

export const ForgotPassword = () => (
  <AuthLayout>
    <ForgotPasswordScreen />
  </AuthLayout>
);
