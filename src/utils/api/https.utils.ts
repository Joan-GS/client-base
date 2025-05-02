import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8080/api/v1";

export const getAuthToken = async (): Promise<{
  token: string;
  userId: string;
}> => {
  const storedUser = await AsyncStorage.getItem("loggedUser");
  if (!storedUser) throw new Error("No user logged in");

  const { access_token } = JSON.parse(storedUser);
  if (!access_token) throw new Error("Access token not found");

  const decodedToken: { sub: string } = jwtDecode(access_token);
  return { token: access_token, userId: decodedToken.sub };
};

/**
 * Realiza peticiones HTTP de forma centralizada con manejo de errores.
 */
export const handleRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: object
): Promise<T> => {
  const { token } = await getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.message || "Error en la petición");
  }

  return responseData.data as T;
};
