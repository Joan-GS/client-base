import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Button, ButtonText } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { AlertTriangle } from "lucide-react-native";
import { Keyboard } from "react-native";
import useRouter from "@unitools/router";
import { AuthLayout } from "../layout";

// Importar el servicio de login
import { loginUser } from "./api/login";

// Esquema de validación de login
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

  // Manejar el envío del formulario
  const onSubmit = async (data: LoginSchemaType) => {
    try {
      // Llamar al servicio de login
      const response = await loginUser(data.email, data.password);

      // Mostrar mensaje de éxito
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id}>
            <ToastTitle>{response.message}</ToastTitle>
          </Toast>
        ),
      });

      // Puedes hacer algo con el token (por ejemplo, guardarlo en almacenamiento local)
      console.log("Token recibido:", response.access_token);

      // Limpiar el formulario
      reset();
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id}>
            <ToastTitle>{"Error"}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <VStack className="max-w-[440px] w-full" space="md">
      <VStack className="md:items-center" space="md">
        <Heading className="md:text-center" size="3xl">
          Log in
        </Heading>
        <Text>Login to start using gluestack</Text>
      </VStack>
      <VStack className="w-full">
        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input>
                <InputField {...field} placeholder="Enter email" />
              </Input>
            )}
          />
          {errors.email && (
            <FormControlError>
              <AlertTriangle />
              <FormControlErrorText>
                {errors.email.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input>
                <InputField
                  {...field}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                />
                <InputSlot onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          {errors.password && (
            <FormControlError>
              <AlertTriangle />
              <FormControlErrorText>
                {errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button onPress={handleSubmit(onSubmit)}>
          <ButtonText>Log in</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export const SignIn = () => (
  <AuthLayout>
    <LoginWithLeftBackground />
  </AuthLayout>
);
