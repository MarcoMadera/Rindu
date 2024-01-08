import { PropsWithChildren, ReactElement, useEffect } from "react";

import { useRouter } from "next/router";

import { Footer, SpotifyPlayer, TopBar } from "components";
import { useDisableGlobalContextMenu, useRefreshAccessToken } from "hooks";
import { AppContainer } from "layouts/AppContainer";

export default function MainLayout({
  children,
}: Readonly<PropsWithChildren>): ReactElement {
  const router = useRouter();
  const isLoginPage = router.pathname === "/";

  useRefreshAccessToken();
  useDisableGlobalContextMenu();

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  if (isLoginPage) {
    return (
      <>
        <div>
          <TopBar />
          {children}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppContainer>{children}</AppContainer>
      <SpotifyPlayer />
    </>
  );
}
