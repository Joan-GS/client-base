import React, { useState } from "react";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { resendVerificationCode } from "./api/confirmation";
import { AuthLayout } from "../layout";
import {
  VStackContainer,
  MessageContainer,
  Heading,
  Text,
  SuccessText,
} from "./styles";
import { GenericButton } from "@/src/shared";

const ConfirmMailPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Get email from route params
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email)
    ? params.email[0]
    : params.email || "";

  // Trigger resend email logic
  const handleResendCode = async () => {
    if (!email) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>{t("No email found in URL.")}</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setLoading(true);
    try {
      const response = await resendVerificationCode(email);

      if (response.success) {
        setEmailSent(true);
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="success">
              <ToastTitle>
                {t(
                  "We've sent you an email with instructions to verify your account."
                )}
              </ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <ToastTitle>
              {t("There was an error sending the email. Please try again.")}
            </ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStackContainer>
      <MessageContainer>
        <Heading>{t("Check your email")}</Heading>
        <Text>
          {t("We've sent an email to")} <SuccessText>{email}</SuccessText>{" "}
          {t("with instructions to verify your account.")}
        </Text>

        {emailSent && (
          <SuccessText>
            {t("We've sent another email with verification instructions.")}
          </SuccessText>
        )}

        <GenericButton
          label={loading ? t("Resending...") : t("Resend Email")}
          onPress={handleResendCode}
          disabled={loading}
        />
      </MessageContainer>
    </VStackContainer>
  );
};

export const ConfirmMail = () => {
  return (
    <AuthLayout>
      <ConfirmMailPage />
    </AuthLayout>
  );
};
