import "../styles/globals.css";
import { UserContextProvider } from "../context/UserContext";
import { SpotifyContextProvider } from "../context/SpotifyContext";
import { HeaderContextProvider } from "../context/HeaderContext";
import { ToastContextProvider } from "context/ToastContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import MainLayout from "../layouts/MainLayout";
import Seo from "../components/Seo";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <ToastContextProvider>
      <UserContextProvider>
        <HeaderContextProvider>
          <SpotifyContextProvider>
            <ContextMenuContextProvider>
              <Seo />
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </ContextMenuContextProvider>
          </SpotifyContextProvider>
        </HeaderContextProvider>
      </UserContextProvider>
    </ToastContextProvider>
  );
};

export default MyApp;
