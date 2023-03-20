import "../styles/globals.css";
import { ReactElement } from "react";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { Seo } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { ModalContextProvider } from "context/ModalContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import { UserContextProvider } from "context/UserContext";
import MainLayout from "layouts/MainLayout";

const MyApp = ({
  Component,
  pageProps,
}: AppProps<TranslationsContextProviderProps>): ReactElement => {
  return (
    <TranslationsContext.Provider
      value={{
        translations: pageProps.translations,
      }}
    >
      <ToastContextProvider>
        <UserContextProvider>
          <HeaderContextProvider>
            <SpotifyContextProvider>
              <ContextMenuContextProvider>
                <ModalContextProvider>
                  <Seo />
                  <MainLayout>
                    <Component {...pageProps} />
                    <Analytics />
                  </MainLayout>
                </ModalContextProvider>
              </ContextMenuContextProvider>
            </SpotifyContextProvider>
          </HeaderContextProvider>
        </UserContextProvider>
      </ToastContextProvider>
    </TranslationsContext.Provider>
  );
};

export default MyApp;
