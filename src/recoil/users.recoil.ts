import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: {
    token: null as string | null,
    isAuthenticated: false,
  },
});
