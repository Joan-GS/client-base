import { getAuthToken, handleRequest } from "@/src/utils/api/https.utils";

export interface CreateClimbRequest {
  title: string;
  description?: string;
  ratingAverage: number;
  grade: string;
  gradeAverage: string;
  tags: string[];
  status?: string;
  createdBy: string;
  bluetoothCode: string;
  imageUrl?: string | null;
}


export interface ClimbResponse {
  message: string;
  data?: {
    id: string;
  };
}

/**
 * Sends a request to create a new climb.
 */
export const createClimb = async (
  climbData: CreateClimbRequest
): Promise<ClimbResponse> => {
  const { userId } = await getAuthToken();

  try {
    const response = await handleRequest<ClimbResponse>("/climbs", "POST", {
      ...climbData,
      createdBy: userId,
    });

    return response;
  } catch (error) {
    throw error;
  }
};
