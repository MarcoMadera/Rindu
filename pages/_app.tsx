import "../styles/globals.css";
import { UserContextProvider } from "../context/UserContext";
import { SpotifyContextProvider } from "../context/SpotifyContext";
import { HeaderContextProvider } from "../context/HeaderContext";
import { ToastContextProvider } from "context/ToastContext";
import type { AppProps } from "next/app";
import { ReactElement } from "react";
import Layout from "../components/Layout";
import Seo from "../components/Seo";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <ToastContextProvider>
      <UserContextProvider>
        <HeaderContextProvider>
          <SpotifyContextProvider>
            <Seo />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SpotifyContextProvider>
        </HeaderContextProvider>
      </UserContextProvider>
    </ToastContextProvider>
  );
};

export default MyApp;
