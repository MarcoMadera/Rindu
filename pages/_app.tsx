import "../styles/globals.css";
import { UserContextProvider } from "../context/UserContext";
import { SpotifyContextProvider } from "../context/SpotifyContext";
import { HeaderContextProvider } from "../context/HeaderContext";
import { ToastContextProvider } from "context/ToastContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import MainLayout from "../layouts/MainLayout";
import Seo from "../components/Seo";

const MyApp = ({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"] & TranslationsContextProviderProps;
}): ReactElement => {
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
                <Seo />
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              </ContextMenuContextProvider>
            </SpotifyContextProvider>
          </HeaderContextProvider>
        </UserContextProvider>
      </ToastContextProvider>
    </TranslationsContext.Provider>
  );
};

export default MyApp;
