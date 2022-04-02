import Router from "next/router";
import { NextPage } from "next";
import { takeCookie } from "../utils/cookies";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../utils/constants";
import { validateAccessToken } from "../utils/spotifyCalls/validateAccessToken";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { refreshAccessToken } from "../utils/spotifyCalls/refreshAccessToken";
import useAnalitycs from "../hooks/useAnalytics";
import { removeTokensFromCookieServer } from "utils/removeTokensFromCookieServer";

interface HomeProps {
  accessToken?: string | null;
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

  const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const SPOTIFY_REDIRECT_URL = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL;
  const API_AUTH_URL = "https://accounts.spotify.com/authorize?";
  const scopes =
    "streaming,user-read-email,user-follow-read,user-follow-modify,playlist-read-private,user-read-private,user-library-read,user-library-modify,user-read-playback-state,user-modify-playback-state,playlist-modify-private,playlist-modify-public";
  const paramsData = {
    client_id: SPOTIFY_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URL || "",
    scope: scopes,
  };
  const params = new URLSearchParams(paramsData);

  return (
    <main>
      <section className="hero">
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938502/Spotify-Cleaner-App/Mu1_ytmhg5.jpg"
          alt=""
          width={500}
          className="hero-image"
        />
        <div className="hero-title">
          <h1>Todo lo que necesitas para disfrutar de la música</h1>
        </div>
      </section>
      <section className="info">
        <h2>Ideal para cualquier tipo de situación.</h2>
        <p>
          Ya sea si tienes un bot que añade tracks y te ha estado añadiendo
          repetidos, Rindu elimina esos tracks que están de más y deja solo uno.
        </p>
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(253, 186, 239)" }}
      >
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938505/Spotify-Cleaner-App/Mu2_viopob.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
        <div className="sec-desc">
          <span>HERRAMIENTAS FÁCILES DE USAR</span>
          <h2 style={{ color: "rgb(210, 64, 230)" }}>
            Lo mejor para arreglar tus playlists
          </h2>
          <p>
            Agregar canciones por cualquier método puede fallar, por lo que
            queda un espacio guardado sin datos. Esto es una canción corrupta.
          </p>
          <a href={API_AUTH_URL + params}>Descubre como</a>
        </div>
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(112, 83, 120)" }}
      >
        <div className="sec-desc">
          <span style={{ color: "#fff" }}>SIN COMPLICACIONES</span>
          <h2 style={{ color: "rgb(255, 205, 210)" }}>
            Elimina las canciones invisibles
          </h2>
          <p style={{ color: "#fff" }}>
            Si el total de canciones de una playlist no concuerda con el último
            número de la lista, tu playlist está corrupta.
          </p>
          <a href={API_AUTH_URL + params} style={{ color: "#fff" }}>
            Descubre como
          </a>
        </div>
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938507/Spotify-Cleaner-App/Mu3_xbb08n.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(253, 186, 239)" }}
      >
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938509/Spotify-Cleaner-App/Mu4_vigcfb.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
        <div className="sec-desc">
          <span>ELIMINA DISTRACCIONES</span>
          <h2>No más duplicados en tus playlists</h2>
          <p>
            Escucha sin repetir canciones, Rindu elimina los duplicados de tus
            playlists y lista de favoritos.
          </p>
          <a href={API_AUTH_URL + params}>Descubre como</a>
        </div>
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(112, 83, 120)" }}
      >
        <div className="sec-desc">
          <span style={{ color: "#fff" }}>LAS FUNCIONALIDADES QUE AMAS</span>
          <h2 style={{ color: "rgb(255, 205, 210)" }}>Explora y escucha</h2>
          <p style={{ color: "#fff" }}>
            Rindu te permite explorar y escuchar canciones de manera sencilla.
            Agrega canciones a tus playlists y listas de favoritos.
          </p>
          <a href={API_AUTH_URL + params} style={{ color: "#fff" }}>
            Descubre como
          </a>
        </div>
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938516/Spotify-Cleaner-App/Mu5_n7u3cf.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
      </section>
      <section
        className="sec-full sec-desc"
        style={{ backgroundColor: "rgb(253, 186, 239)", marginLeft: "0" }}
      >
        <h2 style={{ color: "rgb(210, 64, 230)" }}>
          ¿Qué esperas para descubrir Rindu?
        </h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <p>
              Disfruta de la música a tu ritmo, tu pones las reglas y Rindu te
              lo hace realidad.
            </p>
            <a href={API_AUTH_URL + params}>Empieza ahora</a>
          </div>
        </div>
      </section>
      <style jsx>
        {`
          :global(html, body) {
            overflow-y: unset;
            background-color: rgb(199, 199, 199);
          }
          :global(body) {
            background: #fff;
          }
          main {
            min-height: calc(100vh - 124px);
            width: 100%;
            display: block;
            max-width: 1400px;
            margin: 0 auto;
          }
          .hero-title {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgb(112, 83, 120);
            grid-column-start: 7;
            grid-column-end: 13;
            margin-left: -280px;
            height: 700px;
          }
          h1 {
            font-size: 64px;
            line-height: 64px;
            color: rgb(255, 205, 210);
            margin-left: 24%;
            max-width: 56.43%;
            padding: 0px;
            width: 100%;
          }
          h2,
          p {
            color: #000;
            align-self: center;
          }
          h2 {
            grid-column-start: 1;
            grid-column-end: 4;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          p {
            grid-column-start: 5;
            grid-column-end: 12;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 0.6px;
            word-spacing: 1.4px;
            line-height: 1.6;
          }
          .info {
            max-width: 1568px;
            padding-left: 64px;
            padding-right: 64px;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            position: relative;
            margin: 64px auto;
          }
          .sec-full {
            max-width: 1568px;
            padding: 64px;
            background-color: rgb(199, 24, 161);
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            position: relative;
            margin: 0 auto;
          }
          .sec-full > :nth-child(2) {
            grid-column-start: 7;
            grid-column-end: 13;
            padding: 0 32px;
          }
          .sec-desc p {
            font-size: 18px;
            font-weight: 400;
          }
          span {
            color: #000;
          }
          a {
            color: #000;
            margin: 32px 0 0 0;
            font-size: 16px;
            font-weight: 500;
            display: block;
          }
          .sec-desc {
            margin-left: 48px;
          }
          .sec-desc h2 {
            font-size: 48px;
            letter-spacing: -0.1rem;
            line-height: 64px;
            font-weight: 900;
            color: rgb(210, 64, 230);
          }
          .sec-full > :nth-child(1) {
            grid-column-start: 1;
            grid-column-end: 6;
          }
          .sec-image {
            margin: 0 auto;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            position: relative;
          }
          .hero-image {
            width: 500px;
            margin: 0 auto;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            position: relative;
            width: 100%;
            height: 80%;
            grid-column-start: 1;
            grid-column-end: 7;
          }
          .hero {
            margin-top: 64px;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            position: relative;
          }
          @media screen and (min-width: 1000px) {
            .hero {
              grid-gap: 20px;
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
}): Promise<{ accessToken: string | null }> => {
  const cookies = req?.headers?.cookie;

  if (!cookies) {
    return { accessToken: null };
  }

  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, cookies);

  if (refreshToken) {
    const { accessToken } = (await refreshAccessToken(refreshToken)) || {};

    if (!accessToken) {
      removeTokensFromCookieServer(res);
      return { accessToken: null };
    }

    res?.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=${accessToken}; Path=/;"`,
    ]);
  }

  const accessTokenFromCookies = takeCookie(ACCESS_TOKEN_COOKIE, cookies);
  const user = await validateAccessToken(accessTokenFromCookies);

  if (!user) {
    removeTokensFromCookieServer(res);
    return { accessToken: null };
  }

  if (res) {
    res.writeHead(307, { Location: "/dashboard" });
    res.end();
  } else {
    Router.replace("/dashboard");
  }

  return { accessToken: accessTokenFromCookies };
};
