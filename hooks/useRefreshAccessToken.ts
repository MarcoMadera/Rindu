import { useEffect } from "react";

import { useRouter } from "next/router";

import { useAuth } from "hooks";
import { EXPIRE_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, takeCookie } from "utils";
import { refreshAccessToken } from "utils/spotifyCalls";

export function useRefreshAccessToken(): void {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const isLoginPage = router.pathname === "/";
    const isNotFoundPage = router.pathname === "/404";
    const isErrorPage = router.pathname === "/500";

    if (isNotFoundPage || isErrorPage) return;
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

      refreshAccessToken();
    }

    const expireIn = parseInt(takeCookie(EXPIRE_TOKEN_COOKIE) ?? "3600", 10);

    const interval = setInterval(
      handleRefreshAccessToken,
      (expireIn - 500) * 1000
    );

    return () => clearInterval(interval);
  }, [user?.uri, router]);
}
