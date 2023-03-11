import { PropsWithChildren, ReactElement, useEffect } from "react";

import { useRouter } from "next/router";

import { Footer, SpotifyPlayer, TopBar } from "components";
import { useDisableGlobalContextMenu, useRefreshAccessToken } from "hooks";
import { AppContainer } from "layouts/AppContainer";

export default function MainLayout({
  children,
}: PropsWithChildren): ReactElement {
  const router = useRouter();
  const isLoginPage = router.pathname === "/";

  useRefreshAccessToken();
  useDisableGlobalContextMenu();

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  return (
    <>
      {isLoginPage ? (
        <>
          <div>
            <TopBar />
            {children}
          </div>
          <Footer />
        </>
      ) : (
        <>
          <AppContainer>{children}</AppContainer>
          <SpotifyPlayer />
        </>
      )}
    </>
  );
}
