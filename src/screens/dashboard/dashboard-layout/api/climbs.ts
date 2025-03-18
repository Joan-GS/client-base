import { getAuthToken, handleRequest } from "@/src/utils/api/https.utils";


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
  data?: Climb[];
}

/**
 * Obtiene la lista de climbs desde el servidor.
 */
export const fetchClimbs = async (page = 1, pageSize = 3): Promise<ClimbsResponse> => {
  return handleRequest<ClimbsResponse>(`/climbs?page=${page}&pageSize=${pageSize}`);
};

/**
 * Maneja la acción de dar o quitar like en un climb.
 */
export const toggleLikeClimb = async (
  climbId: string,
  isLiked: boolean
): Promise<void> => {
  const { userId } = await getAuthToken();
  const method = isLiked ? "DELETE" : "POST";

  await handleRequest(`/interactions/${climbId}/like`, method, { userId });

  console.log(
    isLiked
      ? `❌ Like eliminado en la escalada ${climbId}`
      : `✅ Like añadido a la escalada ${climbId}`
  );
};
