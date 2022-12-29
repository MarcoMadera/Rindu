import { useRouter } from "next/router";
import Footer from "components/Footer";
import TopBar from "components/TopBar";
import SpotifyPlayer from "components/SpotifyPlayer";
import { PropsWithChildren, ReactElement } from "react";
import useRefreshAccessToken from "hooks/useRefreshAccessToken";
import useDisableGlobalContextMenu from "hooks/useDisableGlobalContextMenu";
import { AppContainer } from "./AppContainer";

export default function MainLayout({
  children,
}: PropsWithChildren): ReactElement {
  const router = useRouter();
  const isLoginPage = router.pathname === "/";

  useRefreshAccessToken();
  useDisableGlobalContextMenu();

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
