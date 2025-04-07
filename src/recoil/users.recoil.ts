import { atom } from "recoil";

export interface UserState {
  id: string | null;
  email: string | null;
  username: string | null;
  followers: string[] | null;
  following: string[] | null;
  ascensions: string[] | null;
  myClimbs: {
    data: Array<{
      id: string;
      title: string;
      grade: string;
      description?: string;
      likesCount: number;
      commentsCount: number;
      isLiked: boolean;
      imageUrl?: string;
    }> | null;
  };
}

export const userState = atom<UserState>({
  key: "userState",
  default: {
    id: null,
    email: null,
    username: null,
    followers: null,
    following: null,
    ascensions: null,
    myClimbs: {
      data: null,
    },
  },
});