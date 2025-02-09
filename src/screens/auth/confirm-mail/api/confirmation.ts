// confirmService.ts

export interface ConfirmResponse {
    message: string;
    success?: boolean;
  }
  
  export interface ResendResponse {
    message: string;
    success?: boolean;
  }
  
  export const confirmEmail = async (token: string): Promise<ConfirmResponse> => {
    try {
      // Step 1: Send confirmation request with the token
      const response = await fetch("http://localhost:8080/api/v1/auth/confirm-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token, // Token from the user (dynamic value)
        }),
      });
  
      // Handle failure of confirmation request
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Email confirmation failed");
      }
  
      // If confirmation is successful
      return {
        message: "Email confirmed successfully!",
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If an error occurs, throw it
        throw new Error(error.message || "An unexpected error occurred");
      }
      // In case of an unknown error
      throw new Error("An unknown error occurred");
    }
  };
  
  // New function to resend the verification code
  export const resendVerificationCode = async (email: string): Promise<ResendResponse> => {
    try {
      // Step 1: Request to resend the verification code to the email
      const response = await fetch("http://localhost:8080/api/v1/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Email of the user (dynamic value)
        }),
      });
  
      // Handle failure of resend request
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend verification code");
      }
  
      return {
        message: "Verification code resent successfully!",
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If an error occurs, throw it
        throw new Error(error.message || "An unexpected error occurred");
      }
      // In case of an unknown error
      throw new Error("An unknown error occurred");
    }
  };
  