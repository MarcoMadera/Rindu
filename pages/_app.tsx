import "../styles/globals.css";
import { UserContextProvider } from "../context/UserContext";
import { SpotifyContextProvider } from "../context/SpotifyContext";
import type { AppProps } from "next/app";
import { ReactElement } from "react";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <UserContextProvider>
      <SpotifyContextProvider>
        <Component {...pageProps} />
      </SpotifyContextProvider>
    </UserContextProvider>
  );
};

export default MyApp;
