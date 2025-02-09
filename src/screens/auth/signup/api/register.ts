// registerService.ts

import { LoginResponse, loginUser } from "../../signin/api/login";

export interface RegisterResponse {
  success?: boolean;
}

export const registerUser = async (
  userName: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  try {
    // Step 1: Register the user (waiting for registration to complete first)
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName, // Dynamic value
        email, // Dynamic value
        password, // Dynamic value
        birthDate: "2001-05-16T15:00:00.000Z", // Hardcoded value
        gender: "male", // Hardcoded value
      }),
    });

    // Handle registration failure
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    // Return successful registration response
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // If an error occurs during registration, throw it
      throw new Error(error.message || "An unexpected error occurred");
    }
    // In case of an unknown error
    throw new Error("An unknown error occurred");
  }
};
