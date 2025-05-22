import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Keyboard, Platform } from "react-native";
import { useMediaQuery } from "@gluestack-style/react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Pressable } from "@/src/components/ui/pressable";
import { Icon } from "@/src/components/ui/icon";
import { AuthLayout } from "../layout";
import { ArrowLeftIcon } from "@/src/components/ui/icon";
import {
  ButtonsContainer,
  FormsContainer,
  LoginTextsContainer,
  VStackContainer,
} from "./styles";
import { registerUser } from "./api/register";
import {
  GenericControlledInput,
  GenericControlledCheckbox,
  GenericDatePicker,
} from "@/src/shared/ui/molecules";
import { GenericButton, GenericSelect } from "@/src/shared/ui/atoms";
import { SignupPrompt } from "@/src/shared";

const signUpSchema = Yup.object().shape({
  username: Yup.string().min(3).max(20).required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    )
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  rememberme: Yup.boolean()
    .oneOf([true], "You must accept the Terms of Use and Privacy Policy")
    .required("You must accept the Terms of Use and Privacy Policy"),
  // birthDate: Yup.date()
  //   .required("Birth date is required")
  //   .test("is-18", "You must be at least 18 years old", function (value) {
  //     if (!value) return false;
  //     const today = new Date();
  //     const age = today.getFullYear() - value.getFullYear();
  //     return (
  //       age > 18 ||
  //       (age === 18 &&
  //         today >= new Date(value.setFullYear(value.getFullYear() + 18)))
  //     );
  //   }),
  // gender: Yup.string().required("Gender is required"),
});

type SignUpSchemaType = Yup.InferType<typeof signUpSchema>;

const SignUpWithLeftBackground = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: yupResolver(signUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });

  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      const response = await registerUser(
        data.username,
        data.email,
        data.password
      );
      if (response?.success) {
        router.push({
          pathname: "/auth/confirm-mail",
          params: { email: data.email },
        });
      }
    } catch {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{t("Register Error")}</ToastTitle>
          </Toast>
        ),
      });
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
        <Heading size="3xl">{t("Sign Up")}</Heading>
        <Text>{t("Sign up and start using Gluestack")}</Text>
      </LoginTextsContainer>

      <FormsContainer>
        <GenericControlledInput
          control={control}
          name="username"
          label={t("Username")}
          placeholder={t("Username")}
          error={errors.username?.message}
        />

        <GenericControlledInput
          control={control}
          name="email"
          label={t("Email")}
          placeholder={t("Email")}
          error={errors.email?.message}
        />

        <GenericControlledInput
          control={control}
          name="password"
          label={t("Password")}
          placeholder={t("Password")}
          error={errors.password?.message}
          isPasswordField
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <GenericControlledInput
          control={control}
          name="confirmpassword"
          label={t("Confirm Password")}
          placeholder={t("Confirm Password")}
          error={errors.confirmpassword?.message}
          isPasswordField
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
        />

        {/* <GenericDatePicker
          control={control}
          name="birthDate"
          label={t("Birth Date")}
          error={errors.birthDate?.message}
        /> */}

        {/* <GenericSelect
          name="gender"
          control={control}
          setValue={setValue}
          label={t("Select Gender")}
          items={[
            { label: t("Male"), value: "male" },
            { label: t("Female"), value: "female" },
            { label: t("Prefer not to say"), value: "prefer_not" },
          ]}
          error={errors.gender?.message}
        /> */}

        <GenericControlledCheckbox
          control={control}
          name="rememberme"
          label={t("I accept the Terms of Use and Privacy Policy")}
          error={errors.rememberme?.message}
        />

        <ButtonsContainer>
          <GenericButton
            label={t("Sign Up")}
            onPress={handleSubmit(onSubmit)}
          />
        </ButtonsContainer>

        <SignupPrompt
          message={t("Already have an account?")}
          actionText={t("Sign In")}
          redirectTo="/auth/signin"
        />
      </FormsContainer>
    </VStackContainer>
  );
};

export const SignUp = () => (
  <AuthLayout>
    <SignUpWithLeftBackground />
  </AuthLayout>
);
