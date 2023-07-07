import "../styles/globals.css";
import { ReactElement } from "react";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { Seo } from "components";
import { AppContextProvider } from "context/AppContextProvider";
import { TranslationsContextProviderProps } from "context/TranslationsContext";
import MainLayout from "layouts/MainLayout";

interface AppContextProviderProps extends TranslationsContextProviderProps {
  accessToken?: string;
}

const MyApp = ({
  Component,
  pageProps,
}: AppProps<AppContextProviderProps>): ReactElement => {
  return (
    <AppContextProvider
      translations={pageProps.translations}
      userValue={{ accessToken: pageProps.accessToken }}
    >
      <Seo />
      <MainLayout>
        <Component {...pageProps} />
        <Analytics />
      </MainLayout>
    </AppContextProvider>
  );
};

export default MyApp;
