import LoginContainer from "../components/forLoginPage/LoginContainer";
import Router from "next/router";
import { NextPage } from "next";
import { takeCookie } from "../utils/cookies";
import { ACCESSTOKENCOOKIE, REFRESHTOKENCOOKIE } from "../utils/constants";
import { validateAccessToken } from "../utils/validateAccessToken";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { refreshAccessTokenRequest } from "../lib/requests";
import useAnalitycs from "../hooks/useAnalytics";

interface HomeProps {
  accessToken?: string;
}

const Home: NextPage<HomeProps> = () => {
  const { setIsLogin } = useAuth();

  const { trackWithGoogleAnalitycs } = useAnalitycs();
  useEffect(() => {
    trackWithGoogleAnalitycs();
  }, [trackWithGoogleAnalitycs]);

  useEffect(() => {
    setIsLogin(false);
  }, [setIsLogin]);

  return (
    <main>
      <section>
        <LoginContainer />
      </section>
      <section>
        <div>
          <h1>En qué casos te ayuda Rindu:</h1>
          <ul>
            <li>
              Si tu playlist tiene tracks duplicados:
              <p>
                Ya sea si tienes un bot que añade tracks y te ha estado
                añadiendo repetidos, Rindu elimina esos tracks que están de más
                y deja solo uno.
              </p>
            </li>
            <li>
              Si tienes canciones invisibles:
              <p>
                El proceso de agregar canciones por cualquier método puede
                fallar, por lo que queda un espacio guardado sin datos. Esto lo
                identificas si el total de canciones de una playlist no
                concuerda con el último número de la lista. En Spotify versión
                web esto puede causar una duplicación visual de un track.
              </p>
            </li>
          </ul>
          <video
            src="https://res.cloudinary.com/marcomadera/video/upload/v1617518896/Spotify-Cleaner-App/2021-04-04_00-44-53_zxpprv.mp4"
            title="Demo"
            muted
            loop
            autoPlay
            playsInline
          >
            Tu navegador no soporta videos
          </video>
        </div>
      </section>

      <style jsx>
        {`
          main {
            min-height: calc(100vh - 124px);
            width: 100%;
            display: block;
            padding: 0 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
          section {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0 10px 0;
          }
          div {
            padding: 24px;
            background-color: #111111;
            border-radius: 10px;
            width: 100%;
          }
          li {
            list-style-type: circle;
          }
          p {
            line-height: 1.6;
          }
          h1 {
            font-size: 32px;
            font-weight: 400;
            margin-top: 0;
          }
          ul {
            padding-left: 20px;
          }
          video {
            background: #161616;
            width: 100%;
          }
          @media screen and (min-width: 1000px) {
            main {
              display: grid;
              grid-template-columns: minmax(0, 650px) minmax(0, 1fr);
              grid-gap: 20px;
            }
            main section:nth-of-type(2) {
              grid-row-start: 1;
            }
          }
        `}
      </style>
    </main>
  );
};

export default Home;

Home.getInitialProps = async ({
  res,
  req,
}): Promise<{ accessToken: string }> => {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken;
  if (refreshToken) {
    const _res = await refreshAccessTokenRequest(refreshToken);
    const data = await _res.json();
    accessToken = data.accessToken;
    res?.setHeader("Set-Cookie", [
      `${ACCESSTOKENCOOKIE}=${data.accessToken}; Path=/;"`,
    ]);
  } else {
    accessToken = cookies ? takeCookie(ACCESSTOKENCOOKIE, cookies) : undefined;
  }
  try {
    const user = await validateAccessToken(accessToken);
    if (user) {
      if (res) {
        res.writeHead(307, { Location: "/dashboard" });
        res.end();
      } else {
        Router.replace("/dashboard");
      }
      return { accessToken };
    }
  } catch (error) {
    console.log(error);
  }
  return { accessToken };
};
