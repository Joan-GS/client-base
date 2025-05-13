import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Toast, ToastTitle, useToast } from "@/src/components/ui/toast";
import { GenericButton } from "@/src/shared/ui/atoms";
import { verifyAccount } from "./api/verify";
import { AuthLayout } from "../layout";
import {
  VStackContainer,
  MessageContainer,
  HeadingText,
  BodyText,
} from "./styles";

const VerifiedMailPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const params = useLocalSearchParams();
  const email = typeof params.email === "string" ? params.email : "";
  const code = typeof params.code === "string" ? params.code : "";

  useEffect(() => {
    // Automatically verify account when component mounts
    const verify = async () => {
      if (!email || !code) {
        setLoading(false);
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="error">
              <ToastTitle>{t("Invalid verification link.")}</ToastTitle>
            </Toast>
          ),
        });
        return;
      }

      try {
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
        } else {
          throw new Error();
        }
      } catch {
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="error">
              <ToastTitle>
                {t("Verification failed. The link may have expired.")}
              </ToastTitle>
            </Toast>
          ),
        });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [email, code]);

  return (
    <VStackContainer>
      <MessageContainer>
        <HeadingText>
          {loading
            ? t("Verifying...")
            : verified
            ? t("Account Verified")
            : t("Verification Failed")}
        </HeadingText>

        <BodyText>
          {loading
            ? t("Please wait while we verify your account.")
            : verified
            ? t(
                "Your email address has been successfully verified. You can now log in."
              )
            : t(
                "We couldn't verify your account. The link may be invalid or expired."
              )}
        </BodyText>

        {!loading && (
          <GenericButton
            label={t("Go to Login")}
            onPress={() => router.replace("/auth/signin")}
          />
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
