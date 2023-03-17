import { useContext } from "react";

import UserContext, { IUserContext } from "../context/UserContext";

export function useAuth(): IUserContext {
  const context = useContext(UserContext);
  return context;
}
