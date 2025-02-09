import React, { useState, useEffect } from "react";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyAccount } from "./api/verify";
import { AuthLayout } from "../layout";
import {
  VStackContainer,
  MessageContainer,
  Heading,
  Text,
  SuccessText,
  ButtonTextStyled,
} from "./styles";

const VerifiedMailPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Para asegurar que la verificación solo ocurra una vez

  // Obtener parámetros de la URL
  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";
  const code = typeof params.code === "string" ? params.code : "";

  console.log("code", code)

  // useEffect para manejar la verificación
  useEffect(() => {
    // Validar si los parámetros existen antes de proceder con la verificación
    if (!email || !code) {
      // Si los parámetros son inválidos, evitamos la verificación y mostramos el toast solo una vez.
      if (!error) {
        setError(true);
        setLoading(false);
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="error">
              <ToastTitle>{t("Invalid verification link.")}</ToastTitle>
            </Toast>
          ),
        });
      }
      return;
    }

    // Verificación de la cuenta solo si no se ha verificado previamente
    if (isVerified) return;

    const verify = async () => {
      try {
        setLoading(true);
        const response = await verifyAccount(code);

        if (response.success) {
          setVerified(true);
          toast.show({
            render: ({ id }) => (
              <Toast nativeID={id} action="success">
                <ToastTitle>
                  {t("Your account has been successfully verified!")}
                </ToastTitle>
              </Toast>
            ),
          });
          setIsVerified(true); // Marcar como verificado
        } else {
          throw new Error();
        }
      } catch {
        setError(true);
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="error">
              <ToastTitle>
                {t("Verification failed. The link may have expired.")}
              </ToastTitle>
            </Toast>
          ),
        });
        setIsVerified(true); // Marcar como verificado incluso en caso de error
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [email, code, t, toast, isVerified, error]); // Agregar 'error' y 'isVerified' para asegurarnos de no ejecutar el efecto más de una vez

  return (
    <VStackContainer>
      <MessageContainer>
        <Heading>
          {loading
            ? t("Verifying...")
            : verified
            ? t("Account Verified")
            : t("Verification Failed")}
        </Heading>
        <Text>
          {loading
            ? t("Please wait while we verify your account.")
            : verified
            ? t(
                "Your email address has been successfully verified. You can now log in."
              )
            : t(
                "We couldn't verify your account. The link may be invalid or expired."
              )}
        </Text>

        {!loading && (
          <Button
            className="w-full"
            onPress={() => router.replace("/auth/signin")}
          >
            <ButtonTextStyled>{t("Go to Login")}</ButtonTextStyled>
          </Button>
        )}
      </MessageContainer>
    </VStackContainer>
  );
};

export const VerifiedMail = () => (
  <AuthLayout>
    <VerifiedMailPage />
  </AuthLayout>
);
