// verifyService.ts

export interface VerifyResponse {
  success?: boolean;
}

export const verifyAccount = async (
  code: string
): Promise<VerifyResponse> => {
  try {
    // Step 1: Verify the account (waiting for the verification process to complete first)
    const response = await fetch("http://localhost:8080/api/v1/auth/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code, // Dynamic value
      }),
    });

    // Handle verification failure
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Verification failed");
    }

    // Return successful verification response
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // If an error occurs during verification, throw it
      throw new Error(error.message || "An unexpected error occurred");
    }
    // In case of an unknown error
    throw new Error("An unknown error occurred");
  }
};
