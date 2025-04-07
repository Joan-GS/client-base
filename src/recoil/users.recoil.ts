import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    username: null as string | null,
    followers: null as string[] | null,
    following: null as string[] | null,
    ascensions: null as string[] | null,
    myClimbs: {
      data: null as string[] | null,
      },
    },
});
