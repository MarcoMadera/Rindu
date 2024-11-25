import "../styles/globals.css";
import { ReactElement } from "react";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { ErrorBoundary, Seo } from "components";
import { AppContextProvider } from "context/AppContextProvider";
import { TranslationsContextProviderValue } from "context/TranslationsContext";
import MainLayout from "layouts/MainLayout";

interface AppContextProviderProps extends TranslationsContextProviderValue {
  user: SpotifyApi.UserObjectPrivate | null;
}

const MyApp = ({
  Component,
  pageProps,
}: AppProps<AppContextProviderProps>): ReactElement => {
  return (
    <ErrorBoundary>
      <AppContextProvider
        translations={pageProps.translations}
        locale={pageProps.locale}
        userValue={{ user: pageProps.user }}
      >
        <Seo />
        <MainLayout translations={pageProps.translations}>
          <Component {...pageProps} />
          <Analytics />
        </MainLayout>
      </AppContextProvider>
    </ErrorBoundary>
  );
};

export default MyApp;
