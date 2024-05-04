import { createContext, Dispatch } from "react";
import Cookies from "js-cookie";

export type User = {
  id: number;
  username: string;
};

export type UserAction = {
  type: "login" | "logout";
  user: User | null;
};

export const LoginContext = createContext<User | null>(null);
export const LoginDispatchContext = createContext<Dispatch<UserAction> | null>(
  null,
);

export const loginReducer = (user: User | null, action: UserAction) => {
  switch (action.type) {
    case "login": {
      console.log("in LOGIN action")
      return action.user;
    }
    case "logout":
      Cookies.remove("csrftoken");
      Cookies.remove("sessionid");
      return null;
    default:
      return user;
  }
};
