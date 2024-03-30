import "../styles/globals.css";
import { ReactElement } from "react";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { Seo } from "components";
import { AppContextProvider } from "context/AppContextProvider";
import { TranslationsContextProviderProps } from "context/TranslationsContext";
import MainLayout from "layouts/MainLayout";

interface AppContextProviderProps extends TranslationsContextProviderProps {
  user: SpotifyApi.UserObjectPrivate | null;
}

const MyApp = ({
  Component,
  pageProps,
}: AppProps<AppContextProviderProps>): ReactElement => {
  return (
    <AppContextProvider
      translations={pageProps.translations}
      userValue={{ user: pageProps.user }}
    >
      <Seo />
      <MainLayout translations={pageProps.translations}>
        <Component {...pageProps} />
        <Analytics />
      </MainLayout>
    </AppContextProvider>
  );
};

export default MyApp;
