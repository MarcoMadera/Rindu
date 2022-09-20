import Router from "next/router";
import { NextPage } from "next";
import { takeCookie } from "../utils/cookies";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../utils/constants";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { refreshAccessToken } from "../utils/spotifyCalls/refreshAccessToken";
import useAnalitycs from "../hooks/useAnalytics";
import { removeTokensFromCookieServer } from "utils/removeTokensFromCookieServer";
import { getTranslations, Page } from "utils/getTranslations";

interface HomeProps {
  accessToken?: string | null;
  translations: Record<string, string>;
}

const Home: NextPage<HomeProps> = ({ translations }) => {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938502/Spotify-Cleaner-App/Mu1_ytmhg5.jpg"
          alt=""
          width={500}
          className="hero-image"
        />
        <div className="hero-title">
          <h1>{translations.heroTitle}</h1>
        </div>
      </section>
      <section className="info">
        <h2>{translations.heroInfoTitle}</h2>
        <p>{translations.heroInfoDescription}</p>
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(253, 186, 239)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938505/Spotify-Cleaner-App/Mu2_viopob.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
        <div className="sec-desc">
          <span>{translations.section1Eyebrow}</span>
          <h2 style={{ color: "rgb(210, 64, 230)" }}>
            {translations.section1Title}
          </h2>
          <p>{translations.section1Description}</p>
          <a href={API_AUTH_URL + params}>{translations.cta}</a>
        </div>
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(112, 83, 120)" }}
      >
        <div className="sec-desc">
          <span style={{ color: "#fff" }}>{translations.section2Eyebrow}</span>
          <h2 style={{ color: "rgb(255, 205, 210)" }}>
            {translations.section2Title}
          </h2>
          <p style={{ color: "#fff" }}>{translations.section2Description}</p>
          <a href={API_AUTH_URL + params} style={{ color: "#fff" }}>
            {translations.cta}
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938509/Spotify-Cleaner-App/Mu4_vigcfb.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
        <div className="sec-desc">
          <span>{translations.section3Eyebrow}</span>
          <h2>{translations.section3Title}</h2>
          <p>{translations.section3Description}</p>
          <a href={API_AUTH_URL + params}>{translations.cta}</a>
        </div>
      </section>
      <section
        className="sec-full"
        style={{ backgroundColor: "rgb(112, 83, 120)" }}
      >
        <div className="sec-desc">
          <span style={{ color: "#fff" }}>{translations.section4Eyebrow}</span>
          <h2 style={{ color: "rgb(255, 205, 210)" }}>
            {translations.section4Title}
          </h2>
          <p style={{ color: "#fff" }}>{translations.section4Description}</p>
          <a href={API_AUTH_URL + params} style={{ color: "#fff" }}>
            Descubre como
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/marcomadera/image/upload/v1645938516/Spotify-Cleaner-App/Mu5_n7u3cf.jpg"
          alt=""
          width={500}
          className="sec-image"
        />
      </section>
      <section
        className="sec-full sec-desc"
        style={{ backgroundColor: "rgb(253, 186, 239)" }}
      >
        <h2 style={{ color: "rgb(210, 64, 230)" }}>
          {translations.concludeSectionTitle}
        </h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <p>{translations.concludeSectionDescription}</p>
            <a href={API_AUTH_URL + params}>
              {translations.concludeSectionCta}
            </a>
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
          @media screen and (min-width: 0px) and (max-width: 1100px) {
            .hero,
            .info,
            section.sec-full {
              display: block;
            }
            .sec-full img,
            .hero img {
              transform: translateY(0px);
            }
            .hero-title {
              margin: 0;
            }
            .hero-title h1 {
              font-size: 40px;
              line-height: 40px;
              max-width: fit-content;
              margin-left: 0;
              padding: 10px;
            }
            .hero-title {
              height: auto;
              padding: 40px 0;
              margin-top: -10px;
            }
            .info h2 {
              font-size: 1.4rem;
              line-height: 2.4rem;
            }
            .info p {
              font-size: 20px;
            }
            .info {
              padding: 10px;
            }
            section.sec-full {
              padding: 20px;
            }
            section.sec-full img {
              width: 100%;
            }
            div.sec-desc {
              margin: 20px 0;
              padding: 0 15px;
            }
            .sec-full > :nth-child(2) {
              margin: 20px 0;
              padding: 0 15px;
            }
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

Home.getInitialProps = async ({ res, req, query }): Promise<HomeProps> => {
  const country = (query.country || "US") as string;
  const translations = getTranslations(country, Page.Home);
  const cookies = req?.headers?.cookie;

  if (!cookies) {
    return { accessToken: null, translations };
  }

  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, cookies);

  if (refreshToken) {
    const { access_token } = (await refreshAccessToken(refreshToken)) || {};

    if (!access_token) {
      removeTokensFromCookieServer(res);
      return { accessToken: null, translations };
    }

    const expireCookieDate = new Date();
    expireCookieDate.setTime(
      expireCookieDate.getTime() + 1000 * 60 * 60 * 24 * 30
    );

    res?.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=${access_token}; Path=/; expires=${expireCookieDate.toUTCString()}; SameSite=Lax; Secure;`,
    ]);

    if (res) {
      res.writeHead(307, { Location: "/dashboard" });
      res.end();
    } else {
      Router.replace("/dashboard");
    }

    return { accessToken: access_token, translations };
  }
  removeTokensFromCookieServer(res);

  return { accessToken: null, translations };
};
