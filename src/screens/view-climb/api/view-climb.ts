// src/api/view-climb.ts
import { getAuthToken, handleRequest } from "@/src/utils/api/https.utils";
import { ASCENSION_TYPE } from "@joan16/shared-base";

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
    isCompleted?: boolean;
    isAscended?: boolean;
    completedCount?: number;
}

export interface ClimbResponse {
    message: string;
    data?: Climb;
}

export interface AscendResponse {
    message: string;
}

/**
 * Obtiene los detalles de un climb específico
 */
export const fetchClimb = async (climbId: string): Promise<any> => {
    return handleRequest<any>(`/climbs/${climbId}`, "GET");
};

/**
 * Marca un climb como ascendido/completado
 */
export const ascendClimb = async (
    climbId: string,
    ascensionType: ASCENSION_TYPE = ASCENSION_TYPE.FLASH 
): Promise<any> => {
    return handleRequest<any>(
        `/interactions/${climbId}/ascend`,
        "POST",
        { ascensionType }
    );
};

/**
 * Maneja la acción de dar o quitar like en un climb
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