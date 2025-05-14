import { handlePublicRequest } from "@/src/utils/api/https.utils";

export interface PasswordResetResponse {
  message: string;
  success?: boolean;
}

export const requestPasswordReset = async (
  email: string
): Promise<PasswordResetResponse> => {
  try {
    const response = await handlePublicRequest<PasswordResetResponse>(
      "/auth/forgot-password",
      "POST",
      { email }
    );

    // Asegúrate de manejar el caso donde el backend no devuelve un mensaje
    return {
      message: response?.message || "If an account exists, a reset link has been sent to your email",
      success: true,
    };
  } catch (error) {
    // Mejora el manejo de errores para mostrar mensajes más específicos
    let errorMessage = "An unknown error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Puedes parsear mensajes específicos de tu backend aquí
      if (error.message.includes("400")) {
        errorMessage = "Invalid email format";
      }
    }

    throw new Error(errorMessage);
  }
};