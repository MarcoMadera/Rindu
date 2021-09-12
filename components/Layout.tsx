import { useRouter } from "next/router";
import Footer from "./Footer";
import Navbar from "./navbar";
import SpotifyPlayer from "./SpotifyPlayer";
import SideBar from "./SideBar";
import Header from "./Header";
import { takeCookie } from "utils/cookies";
import { EXPIRETOKENCOOKIE, REFRESHTOKENCOOKIE } from "utils/constants";
import { RefreshResponse } from "types/spotify";
import useAuth from "hooks/useAuth";
import { useEffect } from "react";

const Layout: React.FC = ({ children }) => {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    if (router.asPath === "/") {
      return;
    }
    const expireIn = parseInt(takeCookie(EXPIRETOKENCOOKIE) || "3600", 10);
    const interval = setInterval(async () => {
      const refreshToken = takeCookie(REFRESHTOKENCOOKIE);
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
      }
    }, (expireIn - 60) * 1000);
    return () => clearTimeout(interval);
  }, [setAccessToken, router.asPath]);

  return (
    <>
      {router.asPath === "/" ? (
        <>
          <Navbar />
          {children}
        </>
      ) : (
        <SideBar>
          <div>
            <Header />
            {children}
            <style jsx>{`
              div {
                display: flex;
                flex-direction: column;
              }
            `}</style>
          </div>
        </SideBar>
      )}

      {router.asPath === "/" ? <Footer /> : <SpotifyPlayer />}
    </>
  );
};

export default Layout;
