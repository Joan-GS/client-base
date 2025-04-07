// loginService.ts
import { userState } from '@/src/recoil/users.recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSetRecoilState } from 'recoil';

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

      await AsyncStorage.setItem("loggedUser", JSON.stringify(data));

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
  
  export const useInitializeUser = () => {
    const setUser = useSetRecoilState(userState);
  
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("loggedUser");
        if (!storedUser) return;
  
        const { access_token } = JSON.parse(storedUser);
  
        const response = await fetch("http://localhost:8080/api/v1/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("Error al obtener el usuario");
  
        const userData = await response.json();
  
        setUser({
          username: userData.username,
          followers: userData.followers,
          following: userData.following,
          ascensions: userData.ascensions,
          myClimbs: userData.myClimbs,
        });
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };
  
    return loadUser;
  };