// confirmService.ts

import { handlePublicRequest } from "@/src/utils/api/https.utils";

export interface ConfirmResponse {
  message: string;
  success?: boolean;
}

export interface ResendResponse {
  message: string;
  success?: boolean;
}

/**
 * Sends a token to the backend to confirm the user's email.
 */
export const confirmEmail = async (token: string): Promise<ConfirmResponse> => {
  try {
    const response = await handlePublicRequest<ConfirmResponse>(
      "/auth/confirm-email",
      "POST",
      { token }
    );

    return {
      message: response.message || "Email confirmed successfully!",
      success: true,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

/**
 * Sends a request to resend the verification code to the given email address.
 */
export const resendVerificationCode = async (
  email: string
): Promise<ResendResponse> => {
  try {
    const response = await handlePublicRequest<ResendResponse>(
      "/auth/resend",
      "POST",
      { email }
    );

    return {
      message: response.message || "Verification code resent successfully!",
      success: true,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};
