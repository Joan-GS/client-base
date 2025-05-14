import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "expo-router";
import { useToast, Toast, ToastTitle } from "@/src/components/ui/toast";

import { useTranslation } from "react-i18next";
import { loginUser, useInitializeUser } from "./api/login";
import {
  FormsContainer,
  LoginTextsContainer,
  LoginWithLeftBackgroundContainer,
  VStackContainer,
  HStackContainer,
} from "./styles";
import { AuthLayout } from "../layout";
import { GoogleIcon } from "./assets/icons/google";
import {
  ForgotPasswordLink,
  GenericButton,
  GenericControlledCheckbox,
  GenericControlledInput,
  SignupPrompt,
} from "@/src/shared";
import { Text } from "@/src/components/ui/text";
import { Heading } from "@/src/components/ui/heading";

// Validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberme: yup.boolean(),
});

type LoginSchemaType = yup.InferType<typeof loginSchema>;

const LoginWithLeftBackground = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(loginSchema),
  });

  const toast = useToast();
  const { t } = useTranslation();
  const loadUser = useInitializeUser();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await loginUser(data.email, data.password);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>{t("Login Successful")}</ToastTitle>
          </Toast>
        ),
      });

      loadUser();
      router.push("/dashboard/dashboard-layout");
    } catch {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{t("Invalid credentials")}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <LoginWithLeftBackgroundContainer>
      {/* Header */}
      <LoginTextsContainer>
        <Heading size="3xl">{t("Log in")}</Heading>
        <Text>{t("Login to start using gluestack")}</Text>
      </LoginTextsContainer>

      {/* Form */}
      <FormsContainer>
        <GenericControlledInput
          control={control}
          name="email"
          label={t("Email")}
          placeholder={t("Enter email")}
          error={errors.email?.message}
        />
        <GenericControlledInput
          control={control}
          name="password"
          label={t("Password")}
          placeholder={t("Enter password")}
          error={errors.password?.message}
          isPasswordField
        />
        <HStackContainer>
          <GenericControlledCheckbox
            control={control}
            name="rememberme"
            label={t("Remember me")}
          />
          <ForgotPasswordLink
            label={t("Forgot Password?")}
            redirectTo="/auth/forgot-password"
          />
        </HStackContainer>
      </FormsContainer>

      {/* Buttons */}
      <VStackContainer>
        <GenericButton label={t("Log in")} onPress={handleSubmit(onSubmit)} />
        {/* <GenericButton
          label={t("Continue with Google")}
          onPress={() => {}}
          icon={GoogleIcon}
          variant="outline"
        /> */}
      </VStackContainer>

      {/* Navigation */}
      <SignupPrompt
        message={t("Don't have an account?")}
        actionText={t("Sign up")}
        redirectTo="/auth/signup"
      />
    </LoginWithLeftBackgroundContainer>
  );
};

export const SignIn = () => (
  <AuthLayout>
    <LoginWithLeftBackground />
  </AuthLayout>
);
