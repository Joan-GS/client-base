import { handlePublicRequest } from "@/src/utils/api/https.utils";

export interface PasswordResetResponse {
  message: string;
  success?: boolean;
}

export interface NewPasswordData {
  token: string;
  newPassword: string;
}

/**
 * Submits a new password with the reset token
 */
export const submitNewPassword = async (
  data: NewPasswordData
): Promise<PasswordResetResponse> => {
  try {
    const response = await handlePublicRequest<PasswordResetResponse>(
      "/auth/reset-password",
      "POST",
      data
    );

    return {
      message: response.message || "Password reset successfully!",
      success: true,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};