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

export function useRefreshAccessToken(): void {
  const router = useRouter();
  const { user, setAccessToken } = useAuth();

  useEffect(() => {
    const isLoginPage = router.pathname === "/";
    if (!user?.uri && !isLoginPage) {
      router.push("/");
      return;
    }

    function handleRefreshAccessToken() {
      const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE);
      if (!refreshToken) {
        router.push("/");
        return;
      }

      refreshAccessToken(refreshToken).then((res) => {
        if (res?.access_token) {
          setAccessToken(res.access_token);
          makeCookie({
            name: REFRESH_TOKEN_COOKIE,
            value: res.refresh_token,
            age: 60 * 60 * 24 * 30 * 2,
          });
          makeCookie({
            name: ACCESS_TOKEN_COOKIE,
            value: res.access_token,
            age: 60 * 60 * 24 * 30 * 2,
          });
          return;
        }

        router.push("/");
      });
    }

    const expireIn = parseInt(takeCookie(EXPIRE_TOKEN_COOKIE) ?? "3600", 10);

    const interval = setInterval(
      handleRefreshAccessToken,
      (expireIn - 1000) * 1000
    );

    return () => clearInterval(interval);
  }, [user?.uri, router, setAccessToken]);
}
