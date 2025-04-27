import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthToken, handleRequest } from "@/src/utils/api/https.utils";
import { useSetRecoilState } from "recoil";
import { userState } from "@/src/recoil/users.recoil";
import { User } from "@joan16/shared-base";

export interface UserProfileData {
  id: string;
  email: string;
  username: string;
  followers: string[];
  following: string[];
  ascensions: string[];
  myClimbs: {
    data: {
      id: string;
      title: string;
      grade: string;
      description?: string;
      likesCount: number;
      commentsCount: number;
      isLiked: boolean;
      imageUrl?: string;
    }[];
  };
}

/**
 * Fetch user profile data.
 * - If no userId is provided, fetches logged-in user's profile (/auth/me) with GET.
 * - If userId is provided, fetches another user's profile (/auth/profile?profileId=xxx) with GET.
 */
export const fetchUserProfile = async (userId?: string): Promise<UserProfileData & { isFollowing?: boolean }> => {
  if (userId) {
    // GET a /auth/profile amb query param
    const data = await handleRequest<UserProfileData & { isFollowing: boolean }>(
      `/auth/profile/${userId}`,
      "GET"
    );

    if (!data.myClimbs?.data) {
      data.myClimbs = { data: [] };
    }

    return data;
  } else {
    // GET normal a /auth/me
    const data = await handleRequest<UserProfileData>("/auth/me", "GET");

    if (!data.myClimbs?.data) {
      data.myClimbs = { data: [] };
    }

    return data;
  }
};



/**
 * Update the user's profile information.
 */
export const updateProfile = async (
  userId: string,
  updates: {
    username?: string;
  }
): Promise<UserProfileData> => {
  const storedUser = await AsyncStorage.getItem("loggedUser");
  if (!storedUser) throw new Error("User not logged in");

  const { access_token, user: currentUser } = JSON.parse(storedUser);

  const updatedData = await handleRequest<UserProfileData>(
    `/users/${userId}`,
    "PUT",
    updates
  );

  // Update local storage
  const updatedUser = {
    access_token,
    user: {
      ...currentUser,
      ...updatedData,
    },
  };
  await AsyncStorage.setItem("loggedUser", JSON.stringify(updatedUser));

  return updatedData;
};

/**
 * Custom hook to interact with the user's profile state.
 */
export const useProfile = () => {
  const setUser = useSetRecoilState(userState);

  const loadUserProfile = async () => {
    try {
      const profileData = await fetchUserProfile();
      setUser((prev) => ({
        ...prev,
        ...profileData,
        myClimbs: {
          data: profileData.myClimbs?.data || [],
        },
      }));
      return profileData;
    } catch (error) {
      console.error("Error loading user profile:", error);
      throw error;
    }
  };

  const updateUserProfile = async (
    userId: string,
    updates: {
      username?: string;
    }
  ) => {
    try {
      const storedUser = await AsyncStorage.getItem("loggedUser");
      if (!storedUser) throw new Error("User not logged in");

      const { user: currentUser } = JSON.parse(storedUser);
      const updatedProfile = await updateProfile(userId, updates);

      setUser((prev) => ({
        ...prev,
        ...updatedProfile,
        id: currentUser.id,
        email: currentUser.email,
        myClimbs: {
          data: updatedProfile.myClimbs?.data || prev.myClimbs?.data || [],
        },
        followers: updatedProfile.followers || prev.followers || [],
        following: updatedProfile.following || prev.following || [],
        ascensions: updatedProfile.ascensions || prev.ascensions || [],
      }));

      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return { loadUserProfile, updateUserProfile };
};

/**
 * Fetch list of followers for a specific user.
 */
export const fetchFollowers = async (userId: string): Promise<any> => {
  return handleRequest(`/interactions/${userId}/followers`);
};

/**
 * Fetch list of following users for a specific user.
 */
export const fetchFollowing = async (userId: string): Promise<any> => {
  return handleRequest(`/interactions/${userId}/following`);
};

/**
 * Follow a user.
 */
export const followUser = async (userId: string, followerId: string) => {
  return handleRequest(`/interactions/${userId}/follow`, "POST", {
    followerId,
  });
};

/**
 * Unfollow a user.
 */
export const unfollowUser = async (userId: string, followerId: string) => {
  return handleRequest(`/interactions/${userId}/unfollow`, "DELETE", {
    followerId,
  });
};
