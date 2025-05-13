import { handlePublicRequest } from "@/src/utils/api/https.utils";

export interface RegisterResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, any>;
}

/**
 * Sends user registration data to the backend.
 * You can extend this to store a token or user if backend returns it.
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await handlePublicRequest<RegisterResponse>(
      "/auth/register",
      "POST",
      {
        username,
        email,
        password,
      }
    );

    return {
      success: true,
      message: response.message ?? "Registration successful",
      data: response.data,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unexpected registration error"
    );
  }
};
