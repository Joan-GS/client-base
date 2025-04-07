import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetRecoilState } from "recoil";
import { userState } from "@/src/recoil/users.recoil";

export interface UserProfileData {
  id: string;
  email: string;
  username: string;
  followers: string[];
  following: string[];
  ascensions: string[];
  myClimbs: {
    data: [{
      id: string;
      title: string;
      grade: string;
      description?: string;
      likesCount: number;
      commentsCount: number;
      isLiked: boolean;
      imageUrl?: string;
    }];
  };
}

export const fetchUserProfile = async (): Promise<UserProfileData> => {
  try {
    const storedUser = await AsyncStorage.getItem("loggedUser");
    if (!storedUser) throw new Error("User not logged in");

    const { access_token } = JSON.parse(storedUser);

    const response = await fetch(`http://localhost:8080/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user profile");
    }

    const data = await response.json();

    // Asegurar que myClimbs.data sea un array
    if (!data.myClimbs?.data) {
      data.myClimbs = { data: [] };
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
    throw new Error("An unknown error occurred");
  }
};

export const updateProfile = async (
    email: string,
    updates: {
      username?: string;
    }
  ): Promise<UserProfileData> => {
    try {
      const storedUser = await AsyncStorage.getItem("loggedUser");
      if (!storedUser) throw new Error("User not logged in");
  
      const { access_token, user: currentUser } = JSON.parse(storedUser);
  
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${email}`, // Usar ID en lugar de email
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(updates),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed");
      }
  
      const data = await response.json();
  
      // Mantener la estructura correcta de AsyncStorage
      const updatedUser = {
        access_token,
        user: {
          ...currentUser,
          ...data
        }
      };
      
      await AsyncStorage.setItem("loggedUser", JSON.stringify(updatedUser));
  
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || "An unexpected error occurred");
      }
      throw new Error("An unknown error occurred");
    }
  };

  export const useProfile = () => {
    const setUser = useSetRecoilState(userState);
  
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setUser(prev => ({
          ...prev,
          ...profileData,
          myClimbs: {
            data: profileData.myClimbs?.data || []
          }
        }));
        return profileData;
      } catch (error) {
        console.error("Error loading user profile:", error);
        throw error;
      }
    };
  
    const updateUserProfile = async (
      email: string,
      updates: {
        username?: string;
      }
    ) => {
      try {
        const storedUser = await AsyncStorage.getItem("loggedUser");
        if (!storedUser) throw new Error("User not logged in");
        
        const { user: currentUser } = JSON.parse(storedUser);
        const updatedProfile = await updateProfile(email, updates);
        
        // Actualiza el estado manteniendo todos los datos
        setUser(prev => ({
          ...prev,
          ...updatedProfile,
          id: currentUser.id, // Asegurar que el ID se mantiene
          email: currentUser.email, // Asegurar que el email se mantiene
          myClimbs: {
            data: updatedProfile.myClimbs?.data || prev.myClimbs?.data || []
          },
          followers: updatedProfile.followers || prev.followers || [],
          following: updatedProfile.following || prev.following || [],
          ascensions: updatedProfile.ascensions || prev.ascensions || []
        }));
        
        return updatedProfile;
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    };
  
    return { loadUserProfile, updateUserProfile };
  };
