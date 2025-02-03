import React, { useState } from "react";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { LinkText } from "@/src/components/ui/link";
import { Link } from "@/src/components/ui/link";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/src/components/ui/input";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/src/components/ui/checkbox";
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/src/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/src/components/ui/button";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertTriangle } from "lucide-react-native";
import { GoogleIcon } from "./assets/icons/google";
import { Pressable } from "@/src/components/ui/pressable";
import { AuthLayout } from "../layout";
import { router } from "expo-router";
import {
  ButtonsContainer,
  FormsContainer,
  LoginTextsContainer,
  SignUpContainer,
  VStackContainer,
} from "./styles";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@gluestack-style/react";
import { registerUser } from "./api/register";
import { useSetRecoilState } from "recoil";
import { authState } from "@/src/recoil/users.recoil";

// Validation schema using Yup
const signUpSchema = Yup.object().shape({
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
});

type SignUpSchemaType = Yup.InferType<typeof signUpSchema>;

const SignUpWithLeftBackground = () => {
  const { t } = useTranslation(); // Translation hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: yupResolver(signUpSchema),
  });

  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const setAuthState = useSetRecoilState(authState);

  // Toggles password visibility
  const handleState = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggles confirm password visibility
  const handleConfirmPwState = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Handles the submit when a key is pressed
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  // This function will be called when the form is submitted
  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      // Attempt login with credentials
      const response = await registerUser(data.email, data.password);

      if (response?.access_token) {
        // Store authentication token in global state (Recoil)
        setAuthState({
          token: response.access_token, // Use access_token from response
          isAuthenticated: true,
        });
      }

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
      //   router.push("/dashboard/dashboard-layout");
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

  // Media query to check if the screen width is small
  const [isMediumScreen] = useMediaQuery({ maxWidth: 768 });

  return (
    <VStackContainer>
      {isMediumScreen && (
        <Pressable
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
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
        {/* Email input field */}
        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <FormControlLabelText>{t("Email")}</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  className="text-sm"
                  placeholder={t("Email")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {"* " + errors.email?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Password input field */}
        <FormControl isInvalid={!!errors.password}>
          <FormControlLabel>
            <FormControlLabelText>{t("Password")}</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  className="text-sm"
                  placeholder={t("Password")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showPassword ? "text" : "password"}
                />
                <InputSlot
                  onPress={handleState}
                  className="pr-3"
                  style={{ paddingRight: 12 }}
                >
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {"* " + errors.password?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Confirm password input field */}
        <FormControl isInvalid={!!errors.confirmpassword}>
          <FormControlLabel>
            <FormControlLabelText>{t("Confirm Password")}</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="confirmpassword"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder={t("Confirm Password")}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <InputSlot
                  onPress={handleConfirmPwState}
                  className="pr-3"
                  style={{ paddingRight: 12 }}
                >
                  <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {"* " + errors.confirmpassword?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        {/* Checkbox to accept terms */}
        <Controller
          name="rememberme"
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <FormControl isInvalid={!!errors.rememberme}>
              <Checkbox
                size="sm"
                isChecked={value}
                onChange={onChange}
                value={""}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>
                  {t("I accept the Terms of Use and Privacy Policy")}
                </CheckboxLabel>
              </Checkbox>
              {errors.rememberme && (
                <FormControlError>
                  <FormControlErrorText>
                    {"* " + errors.rememberme?.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />

        {/* Action buttons */}
        <ButtonsContainer>
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">{t("Sign Up")}</ButtonText>
          </Button>

          <Button variant="outline" className="w-full gap-1" onPress={() => {}}>
            <ButtonText className="font-medium">
              {t("Continue with Google")}
            </ButtonText>
            <ButtonIcon as={GoogleIcon} />
          </Button>
        </ButtonsContainer>

        <SignUpContainer>
          <Text size="md">{t("Already have an account?")}</Text>
          <Link href="/auth/signin">
            <LinkText className="font-medium text-primary-700">
              {t("Sign In")}
            </LinkText>
          </Link>
        </SignUpContainer>
      </FormsContainer>
    </VStackContainer>
  );
};

export const SignUp = () => {
  return (
    <AuthLayout>
      <SignUpWithLeftBackground />
    </AuthLayout>
  );
};
