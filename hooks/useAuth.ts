import { Dispatch, SetStateAction, useContext } from "react";
import { SpotifyUserResponse } from "../lib/types";
import UserContext from "../context/UserContext";
// import useCookies from "./useCookies";

export default function useAuth(): {
  accessToken: string | undefined;
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  user: SpotifyUserResponse | undefined;
} {
  const {
    accessToken,
    isLogin,
    setIsLogin,
    user,
    // setUser,
    // setAccessToken,
  } = useContext(UserContext);
  // const { deleteCookie } = useCookies();

  // const getAuthorization = useCallback(() => {
  //   fetch("/api/spotify-login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ accessToken }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw Error(JSON.stringify(res));
  //       }
  //       return res.json();
  //     })
  //     .then((user) => {
  //       setUser(user.body);
  //       setIsLogin(true);
  //     })
  //     .catch(() => {
  //       setAccessToken("");
  //       setIsLogin(false);
  //       deleteCookie("qs");
  //     });
  // }, [accessToken, deleteCookie, setAccessToken, setIsLogin, setUser]);

  return {
    accessToken,
    isLogin,
    setIsLogin,
    user,
  };
}
