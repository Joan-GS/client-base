// loginService.ts

export interface LoginResponse {
    message: string;
    access_token?: string;
  }
  
  export const loginUser = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
  
      const data = await response.json();

      return {
        message: "Login successful!",
        access_token: data.access_token,
      };

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || "An unexpected error occurred");
      }
      throw new Error("An unknown error occurred");
    }
  };
  