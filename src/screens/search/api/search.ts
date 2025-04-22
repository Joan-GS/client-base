import { getAuthToken, handleRequest } from "@/src/utils/api/https.utils";
import { User } from "@joan16/shared-base";

export interface UsersResponse {
  message: string;
  data?: User[];
  total?: number;
}

export interface Climb {
  imageUrl: string;
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
  total?: number;
}
export interface ClimbFilters {
  OR?: Array<{
    title?: { contains: string };
    grade?: { contains: string };
    tags?: { hasSome: string[] };
  }>;
}

/**
 * Obtiene la lista de climbs desde el servidor.
 */
export const fetchClimbs = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery?: string
): Promise<ClimbsResponse> => {
  let filters: ClimbFilters | undefined;

  if (searchQuery) {
    filters = {
      OR: [
        { title: { contains: searchQuery } },
        { grade: { contains: searchQuery } },
        { tags: { hasSome: [searchQuery] } },
      ],
    };
  }

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters && { filters: JSON.stringify(filters) }),
  });

  return handleRequest<ClimbsResponse>(`/climbs?${params.toString()}`);
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

export const fetchUsers = async (
  page: number = 1,
  pageSize: number = 10,
  searchQuery?: string
): Promise<UsersResponse> => {
  let filters: any;

  if (searchQuery) {
    filters = {
      OR: [{ username: { contains: searchQuery } }],
    };
  }

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters && { filters: JSON.stringify(filters) }),
  });

  return handleRequest<UsersResponse>(`/users?${params.toString()}`);
};
