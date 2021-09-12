import { Dispatch, SetStateAction, useContext } from "react";
import { SpotifyUserResponse } from "types/spotify";
import UserContext from "../context/UserContext";

export default function useAuth(): {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<SpotifyUserResponse | null>>;
  user: SpotifyUserResponse | null;
  accessToken: string | undefined;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
} {
  const { isLogin, setIsLogin, user, setUser, accessToken, setAccessToken } =
    useContext(UserContext);
  return {
    isLogin,
    setIsLogin,
    user,
    setUser,
    accessToken,
    setAccessToken,
  };
}
