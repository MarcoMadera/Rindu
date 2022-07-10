import { useContext } from "react";
import UserContext, { IUserContext } from "../context/UserContext";

export default function useAuth(): IUserContext {
  const context = useContext(UserContext);
  return context;
}
