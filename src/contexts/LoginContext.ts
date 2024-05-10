import { createContext, Dispatch } from "react";
import Cookies from "js-cookie";
import {Axios} from "axios";
import ApiService, {jsonHeaders} from "../services/ApiService.ts";

export type User = {
  id: number;
  is_superuser: boolean;
  is_staff: boolean;
  username: string;
};

export type UserAction = {
  type: "login" | "logout" | "clearUser";
  user: User | null;
};

export const LoginContext = createContext<User | null>(null);
export const LoginDispatchContext = createContext<Dispatch<UserAction> | null>(
  null,
);

export const loginReducer = (user: User | null, action: UserAction) => {
  switch (action.type) {
    case "login": {
      return action.user;
    }
    case "logout":
      (async () => ApiService.post("/logout", undefined, jsonHeaders()).then(() => {
        Cookies.remove("csrftoken");
        Cookies.remove("sessionid");
        localStorage.removeItem('sessionid');
      }).catch().finally(() => null))()
      return null;
    case "clearUser":
      return null;
    default:
      return user;
  }
};
