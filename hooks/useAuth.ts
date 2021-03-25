import { Dispatch, SetStateAction, useContext } from "react";
import { SpotifyUserResponse } from "../lib/types";
import UserContext from "../context/UserContext";

export default function useAuth(): {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<SpotifyUserResponse | null>>;
  user: SpotifyUserResponse | null;
} {
  const { isLogin, setIsLogin, user, setUser } = useContext(UserContext);
  return {
    isLogin,
    setIsLogin,
    user,
    setUser,
  };
}
