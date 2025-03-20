import { getAuthToken, handleRequest } from "@/src/utils/api/https.utils";

export interface CreateClimbRequest {
  title: string;
  description?: string;
  ratingAverage: number;
  grade: string;
  gradeAverage: number;
  tags: string[];
  status?: string;
  createdBy: string;
}

export interface ClimbResponse {
  message: string;
  data?: {
    id: string;
  };
}

/**
 * Envía una solicitud para crear un nuevo climb.
 */
export const createClimb = async (climbData: CreateClimbRequest): Promise<ClimbResponse> => {
    const token = await getAuthToken();
  
    return handleRequest<ClimbResponse>("/climbs", "POST", {
      ...climbData, // Datos del cuerpo de la petición
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
  