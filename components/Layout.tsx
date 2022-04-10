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
import { RefreshResponse } from "types/spotify";
import useAuth from "hooks/useAuth";
import { useEffect } from "react";

const Layout: React.FC = ({ children }) => {
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
        const res = await fetch("/api/spotify-refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        const data: RefreshResponse = await res.json();
        setAccessToken(data.accessToken);
        makeCookie({
          name: ACCESS_TOKEN_COOKIE,
          value: data.accessToken,
          age: expireIn,
        });
      }
    }, (expireIn - 300) * 1000);
    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uri]);

  const isLoginPage = router.asPath === "/";

  return (
    <>
      {isLoginPage ? (
        <div>
          <Navbar />
          {children}
        </div>
      ) : (
        <SideBar>
          <Header>{children}</Header>
        </SideBar>
      )}

      {router.asPath === "/" ? <Footer /> : <SpotifyPlayer />}
    </>
  );
};

export default Layout;
