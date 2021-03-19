import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function useAuth() {
  const { accessToken } = useContext(UserContext);

  return {
    accessToken,
  };
}
