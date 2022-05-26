import { useRouter } from "next/router";
import Footer from "./Footer";
import Navbar from "./navbar";
import SpotifyPlayer from "./SpotifyPlayer";
import SideBar from "./SideBar";
import Header from "./Header";
import { makeCookie, takeCookie } from "utils/cookies";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils/constants";
import useAuth from "hooks/useAuth";
import { ReactElement, ReactNode, useEffect } from "react";
import { refreshAccessToken } from "utils/spotifyCalls/refreshAccessToken";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
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

  const isLoginPage = router.asPath === "/";

  return (
    <>
      {isLoginPage ? (
        <>
          <div>
            <Navbar />
            {children}
          </div>
          <Footer />
        </>
      ) : (
        <>
          <SideBar>
            <Header>{children}</Header>
          </SideBar>
          <SpotifyPlayer />
        </>
      )}
    </>
  );
}
