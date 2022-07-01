import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils/constants";
import { makeCookie, takeCookie } from "utils/cookies";
import { refreshAccessToken } from "utils/spotifyCalls/refreshAccessToken";
import useAuth from "./useAuth";

export default function useRefreshAccessToken(): void {
  const router = useRouter();
  const { user, setAccessToken } = useAuth();

  useEffect(() => {
    if (!user?.uri) {
      return;
    }

    const expireIn = parseInt(takeCookie(EXPIRE_TOKEN_COOKIE) || "3600", 10);

    setAccessToken(takeCookie(ACCESS_TOKEN_COOKIE) ?? "");

    const interval = setInterval(async () => {
      const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE);
      if (refreshToken) {
        const { accessToken } = (await refreshAccessToken(refreshToken)) || {};
        if (accessToken) {
          setAccessToken(accessToken);
          makeCookie({
            name: ACCESS_TOKEN_COOKIE,
            value: accessToken,
            age: 60 * 60 * 24 * 30 * 2,
          });
          return;
        }
        router.push("/");
      }
    }, (expireIn - 1000) * 1000);

    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uri]);
}
