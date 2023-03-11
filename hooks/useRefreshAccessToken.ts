import { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "hooks";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  makeCookie,
  REFRESH_TOKEN_COOKIE,
  takeCookie,
} from "utils";
import { refreshAccessToken } from "utils/spotifyCalls";

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
        const { access_token } = (await refreshAccessToken(refreshToken)) || {};
        if (access_token) {
          setAccessToken(access_token);
          makeCookie({
            name: ACCESS_TOKEN_COOKIE,
            value: access_token,
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
