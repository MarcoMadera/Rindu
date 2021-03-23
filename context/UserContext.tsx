import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useCookies from "../hooks/useCookies";
import {
  AuthorizationResponse,
  RefreshResponse,
  SpotifyUserResponse,
} from "../lib/types";

export interface Context {
  accessToken: string | undefined;
  isLogin: boolean;
  user: SpotifyUserResponse | undefined;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<SpotifyUserResponse | undefined>>;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const UserContext = createContext<Context>(null!);
export default UserContext;

export const UserContextProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>();
  const [spotifyCode, setSpotifyCode] = useState<string | string[]>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState<string>();
  const [expiresIn, setExpiresIn] = useState<number | undefined>();
  const { setCookie, getCookie, deleteCookie } = useCookies();
  const [user, setUser] = useState<SpotifyUserResponse | undefined>(undefined);

  useEffect(() => {
    if (accessToken) {
      console.log("render UserEffect");
      // Replace with getAuthorization and move it somewhere else
      fetch("/api/spotify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      })
        .then((res: Response) => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then((user: SpotifyUserResponse) => {
          setUser(user);
          setIsLogin(true);
        })
        .catch(() => {
          setAccessToken("");
          setIsLogin(false);
          deleteCookie("qs");
        });
    }
  }, [accessToken, deleteCookie]);

  useEffect(() => {
    if (router.query.code) {
      setSpotifyCode(router.query.code);
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    if (getCookie("qs") && getCookie("rs")) {
      setAccessToken(getCookie("qs"));
      // setRefreshToken(getCookie("rs"));  //bad
    }
  }, [getCookie]);

  useEffect(() => {
    if (spotifyCode && !accessToken) {
      fetch("/api/spotify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: spotifyCode }),
      })
        .then((res) => res.json())
        .then((data: AuthorizationResponse) => {
          const expire = new Date();
          expire.setTime(expire.getTime() + 1 * 3600 * 1000);
          setSpotifyCode("");
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          setCookie("qs", data.accessToken, expire.toUTCString());
          setCookie("rs", data.refreshToken, expire.toUTCString());
          setExpiresIn(data.expiresIn);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [spotifyCode, accessToken, setCookie]);

  useEffect(() => {
    if (!refreshToken && !expiresIn) {
      return;
    }
    const interval = setInterval(() => {
      console.log("token UserEffect");
      fetch("/api/spotify-refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => res.json())
        .then((data: RefreshResponse) => {
          const expire = new Date();
          setAccessToken(data.accessToken);
          setCookie("qs", data.accessToken, expire.toUTCString());
          setExpiresIn(data.expiresIn);
        })
        .catch((err) => {
          console.log(err);
        });
    }, ((expiresIn || 60) - 60) * 1000);
    return () => clearTimeout(interval);
  }, [refreshToken, expiresIn, setCookie]);

  return (
    <UserContext.Provider
      value={{
        accessToken,
        isLogin,
        user,
        setIsLogin,
        setUser,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
