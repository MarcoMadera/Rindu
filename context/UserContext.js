import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import useCookies from "../hooks/useCookies";

const UserContext = createContext({
  accessToken: "",
});
export default UserContext;

export function UserContextProvider({ children }) {
  const [accessToken, setAccessToken] = useState();
  const [spotifyCode, setSpotifyCode] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const { setCookie, getCookie } = useCookies();

  const router = useRouter();
  useEffect(() => {
    if (router.query.code) {
      setSpotifyCode(router.query.code);
      router.replace("/", null, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    if (getCookie("qs")) {
      setAccessToken(getCookie("qs"));
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
        .then((data) => {
          const expire = new Date();
          expire.setTime(expire.getTime() + 1 * 3600 * 1000);
          setSpotifyCode(null);
          setAccessToken(data.accessToken);
          setCookie("qs", data.accessToken, expire.toUTCString());
          setRefreshToken(data.refreshToken);
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
      fetch("/api/spotify-refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          const expire = new Date();
          setAccessToken(data.accessToken);
          setCookie("qs", data.accessToken, expire.toUTCString());
          setExpiresIn(data.expiresIn);
        })
        .catch((err) => {
          console.log(err);
        });
    }, (expiresIn - 60) * 1000);
    return () => clearTimeout(interval);
  }, [refreshToken, expiresIn, setCookie]);

  return (
    <UserContext.Provider
      value={{
        accessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
