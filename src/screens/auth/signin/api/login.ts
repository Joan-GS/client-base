import { useSetRecoilState } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userState } from "@/src/recoil/users.recoil";
import { handlePublicRequest, handleRequest } from "@/src/utils/api/https.utils";

export interface LoginResponse {
  message: string;
  access_token?: string;
  data?: Record<string, any>;
}

/**
 * Performs user login by sending credentials to the API.
 * Stores the user data in AsyncStorage if successful.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await handlePublicRequest<LoginResponse>(
      "/auth/login",
      "POST",
      { email, password }
    );

    if (!response.data) {
      throw new Error("No user data received");
    }

    await AsyncStorage.setItem("loggedUser", JSON.stringify(response.data));

    return {
      message: response.message || "Login successful!",
      access_token: response.access_token,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unexpected login error");
  }
};

/**
 * Initializes the Recoil user state by validating the stored token and fetching user data.
 */
export const useInitializeUser = () => {
  const setUser = useSetRecoilState(userState);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("loggedUser");
      if (!storedUser) return;

      const user = await handleRequest<any>("/auth/me", "GET");

      setUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
      await AsyncStorage.removeItem("loggedUser");
    }
  };

  return loadUser;
};
