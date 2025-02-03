import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { router } from "expo-router";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/src/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { CheckIcon, EyeIcon, EyeOffIcon } from "@/src/components/ui/icon";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/src/components/ui/checkbox";
import { GoogleIcon } from "./assets/icons/google";

// Import styles and logo
import {
  FormsContainer,
  LoginTextsContainer,
  LoginWithLeftBackgroundContainer,
  Button,
  LinkText,
  VStackContainer,
  HStackContainer,
  SignUpContainer,
  // LogoImage,
} from "./styles"; // Add LogoImage to your styles

import { loginUser } from "./api/login";
import { AuthLayout } from "../layout";
import { ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Link } from "@/src/components/ui/link";
import { authState } from "@/src/recoil/users.recoil";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

// Validation schema for login form using yup
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
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(loginSchema),
  });

  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const setAuthState = useSetRecoilState(authState);

  const { t } = useTranslation();

  // Submit form handler
  const onSubmit = async (data: LoginSchemaType) => {
    try {
      // Attempt login with credentials
      const response = await loginUser(data.email, data.password);

      // Store authentication token in global state (Recoil)
      setAuthState({
        token: response.access_token ?? null,
        isAuthenticated: true,
      });

      // Show success toast message
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <ToastTitle>{t("Login Successful")}</ToastTitle>
          </Toast>
        ),
      });

      reset();
      // Redirect user to the dashboard
      // router.push("/dashboard/dashboard-layout");
    } catch (error) {
      // Show error toast message if login fails
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
      {/* Logo - will display on small screens */}
      {/* <LogoImage source={require("@/src/assets/images/splash-icon.png")} alt="Logo" /> */}

      {/* Login text section */}
      <LoginTextsContainer>
        <Heading size="3xl">{t("Log in")}</Heading>
        <Text>{t("Login to start using gluestack")}</Text>
      </LoginTextsContainer>

      {/* Login form */}
      <FormsContainer>
        {/* Email input */}
        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <FormControlLabelText>{t("Email")}</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input>
                <InputField {...field} placeholder={t("Enter email")} />
              </Input>
            )}
          />
          {errors.email && (
            <FormControlError>
              <FormControlErrorText>
                {"* " + errors.email.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Password input */}
        <FormControl isInvalid={!!errors.password}>
          <FormControlLabel>
            <FormControlLabelText>{t("Password")}</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input>
                <InputField
                  {...field}
                  placeholder={t("Enter password")}
                  type={showPassword ? "text" : "password"}
                />
                <InputSlot
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ paddingRight: 12 }}
                >
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          {errors.password && (
            <FormControlError>
              <FormControlErrorText>
                {"* " + errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Remember me checkbox */}
        <HStackContainer>
          <Controller
            name="rememberme"
            defaultValue={false}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                size="sm"
                value="Remember me"
                isChecked={value}
                onChange={onChange}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>{t("Remember me")}</CheckboxLabel>
              </Checkbox>
            )}
          />
          {/* Forgot password link */}
          <Link href="/auth/forgot-password">
            <LinkText className="font-medium text-primary-700">
              {t("Forgot Password?")}{" "}
            </LinkText>
          </Link>
        </HStackContainer>
      </FormsContainer>

      {/* Action buttons */}
      <VStackContainer>
        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText>{t("Log in")}</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => {}}>
          <ButtonText>{t("Continue with Google")}</ButtonText>
          <ButtonIcon as={GoogleIcon} />
        </Button>
      </VStackContainer>

      {/* Sign-up prompt */}
      <SignUpContainer>
        <Text>{t("Don't have an account?")}</Text>
        <Link href="/auth/signup">
          <LinkText className="font-medium text-primary-700">
            {t("Sign up")}{" "}
          </LinkText>
        </Link>
      </SignUpContainer>
    </LoginWithLeftBackgroundContainer>
  );
};

// Wrapping the login component inside the AuthLayout
export const SignIn = () => (
  <AuthLayout>
    <LoginWithLeftBackground />
  </AuthLayout>
);
