import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://fe87-37-222-224-145.ngrok-free.app/api/v1";

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
  try {
    const { token } = await getAuthToken();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    // Solo añadir Content-Type si hay body
    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
    };

    // Añadir body solo si existe y no es GET
    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Verificar si la respuesta no tiene contenido (204)
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return responseData.data as T;
  } catch (error) {
    console.error(`Request failed to ${endpoint}:`, error);
    throw error;
  }
};

// apiUtils.ts
export const handlePublicRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: object
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 204) {
      return undefined as unknown as T;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return responseData as T; // Note: Not using .data here since login returns token directly
  } catch (error) {
    console.error(`Public request failed to ${endpoint}:`, error);
    throw error;
  }
};