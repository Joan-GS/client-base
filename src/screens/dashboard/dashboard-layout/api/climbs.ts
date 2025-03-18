import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export interface Climb {
  id: string;
  title: string;
  description?: string;
  ratingAverage: number;
  grade: string;
  gradeAverage: number;
  likesCount: number;
  commentsCount: number;
  recentLikes: string[];
  recentComments: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  tags: string[];
  status?: string;
  createdBy: string;
  isLiked: boolean;
}

export interface ClimbsResponse {
  message: string;
  climbs?: Climb[];
}

export const fetchClimbs = async (): Promise<ClimbsResponse> => {
  try {
    const storedUser = await AsyncStorage.getItem("loggedUser");
    if (!storedUser) throw new Error("No user logged in");

    const { access_token } = JSON.parse(storedUser);
    if (!access_token) throw new Error("Access token not found");

    const decodedToken: { sub: string } = jwtDecode(access_token);
    const userId = decodedToken.sub;

    // Hacer la llamada a la API para obtener los climbs
    const response = await fetch("http://localhost:8080/api/v1/climbs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error fetching climbs");
    }

    const { data: climbs } = await response.json();

    // Obtener el estado "isLiked" de cada climb en paralelo
    const climbsWithLikes = await Promise.all(
      climbs.map(async (climb: Climb) => {
        try {
          const likeResponse = await fetch(
            `http://localhost:8080/api/v1/climbs/${climb.id}/isLiked?userId=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!likeResponse.ok) {
            throw new Error("Error checking like status");
          }

          const { isLiked } = await likeResponse.json();
          return { ...climb, isLiked };
        } catch (error) {
          console.error(
            `Error fetching like status for climb ${climb.id}:`,
            error
          );
          return { ...climb, isLiked: false }; // En caso de error, asumimos que no está likeado
        }
      })
    );

    return {
      message: "Climbs fetched successfully!",
      climbs: climbsWithLikes,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
    throw new Error("An unknown error occurred");
  }
};

export const likeClimb = async (climbId: string): Promise<void> => {
  try {
    const storedUser = await AsyncStorage.getItem("loggedUser");
    if (!storedUser) throw new Error("No user logged in");

    const { access_token } = JSON.parse(storedUser);
    if (!access_token) throw new Error("Access token not found");

    const decodedToken: { sub: string } = jwtDecode(access_token);
    const userId = decodedToken.sub;

    if (!userId) throw new Error("User ID not found in token");

    const response = await fetch(
      `http://localhost:8080/api/v1/climbs/${climbId}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al dar like");
    }

    console.log(
      `✅ Like añadido a la escalada ${climbId} por el usuario ${userId}`
    );
  } catch (error) {
    console.error(
      "❌ Error al dar like:",
      error instanceof Error ? error.message : error
    );
  }
};

export const deleteLikeClimb = async (climbId: string): Promise<void> => {
  try {
    const storedUser = await AsyncStorage.getItem("loggedUser");
    if (!storedUser) throw new Error("No user logged in");

    const { access_token } = JSON.parse(storedUser);
    if (!access_token) throw new Error("Access token not found");

    const decodedToken: { sub: string } = jwtDecode(access_token);
    const userId = decodedToken.sub;

    const response = await fetch(
      `http://localhost:8080/api/v1/climbs/${climbId}/like`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al quitar like");
    }

    console.log(`❌ Like eliminado en la escalada ${climbId}`);
  } catch (error) {
    console.error(
      "❌ Error al quitar like:",
      error instanceof Error ? error.message : error
    );
  }
};
