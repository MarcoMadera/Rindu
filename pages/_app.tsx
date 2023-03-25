import "../styles/globals.css";
import { ReactElement } from "react";

import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

import { Seo } from "components";
import { AppContextProvider } from "context/AppContextProvider";
import { TranslationsContextProviderProps } from "context/TranslationsContext";
import MainLayout from "layouts/MainLayout";

const MyApp = ({
  Component,
  pageProps,
}: AppProps<TranslationsContextProviderProps>): ReactElement => {
  return (
    <AppContextProvider translations={pageProps.translations}>
      <Seo />
      <MainLayout>
        <Component {...pageProps} />
        <Analytics />
      </MainLayout>
    </AppContextProvider>
  );
};

export default MyApp;
