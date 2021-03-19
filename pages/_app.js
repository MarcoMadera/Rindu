import "../styles/globals.css";
import { UserContextProvider } from "../context/UserContext";
function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;
