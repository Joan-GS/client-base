import { handlePublicRequest } from "@/src/utils/api/https.utils";

export interface VerifyResponse {
  success?: boolean;
}

/**
 * Sends a request to the backend to verify the account using a code.
 */
export const verifyAccount = async (code: string): Promise<VerifyResponse> => {
  try {
    const response = await handlePublicRequest<VerifyResponse>(
      "/auth/confirm",
      "POST",
      { code }
    );

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};
