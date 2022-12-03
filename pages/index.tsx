import Router from "next/router";
import { NextPage } from "next";
import { takeCookie } from "../utils/cookies";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../utils/constants";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { refreshAccessToken } from "../utils/spotifyCalls/refreshAccessToken";
import useAnalytics from "../hooks/useAnalytics";
import { removeTokensFromCookieServer } from "utils/removeTokensFromCookieServer";
import {
  getTranslations,
  IFeaturesTranslations,
  Page,
  Translations,
} from "utils/getTranslations";
import { getSpotifyLoginURL } from "utils/getSpotifyLoginURL";
import { Hero } from "../components/Hero";
import { FeatureCard } from "../components/FeatureCard";
import { CardContainer } from "../components/CardContainer";

interface HomeProps {
  accessToken?: string | null;
  translations: Translations["home"];
}

interface IFeature {
  eyeBrowText: string;
  titleText: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  anchorType: string;
  anchorText: string;
}

const Home: NextPage<HomeProps> = ({ translations }) => {
  const { setIsLogin } = useAuth();

  const { trackWithGoogleAnalytics } = useAnalytics();
  useEffect(() => {
    trackWithGoogleAnalytics();
  }, [trackWithGoogleAnalytics]);

  useEffect(() => {
    setIsLogin(false);
  }, [setIsLogin]);

  const spotifyLoginUrl = getSpotifyLoginURL();
  const features = JSON.parse(translations.features) as IFeaturesTranslations[];

  return (
    <main>
      <Hero
        heroTitle={translations.heroTitle}
        imgAlt="hero image"
        imgSrc="https://res.cloudinary.com/marcomadera/image/upload/v1645938502/Spotify-Cleaner-App/Mu1_ytmhg5.jpg"
      />
      <CardContainer className="info">
        <div>
          <h2>{translations.heroInfoTitle}</h2>
        </div>
        <div>
          <p>{translations.heroInfoDescription}</p>
        </div>
      </CardContainer>
      {features.map((feature: IFeature) => {
        return (
          <FeatureCard
            key={feature.titleText}
            titleText={feature.titleText}
            description={feature.description}
            eyeBrowText={feature.eyeBrowText}
            imageSrc={feature.imageSrc}
            imageAlt={feature.imageAlt}
            anchorHref={spotifyLoginUrl}
            anchorText={feature.anchorText}
          />
        );
      })}
      <CardContainer className="conclude">
        <div>
          <h2>{translations.concludeSectionTitle}</h2>
        </div>
        <div>
          <p>{translations.concludeSectionDescription}</p>
          <a href={spotifyLoginUrl}>{translations.concludeSectionCta}</a>
        </div>
      </CardContainer>
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
          main :global(.info) {
            background-color: #fff;
            color: #000;
          }
          main :global(.info) div {
            padding: 0;
          }
          main :global(.info) h2 {
            color: #000;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          main :global(.info) p {
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 0.6px;
            word-spacing: 1.4px;
            line-height: 1.6;
          }
          main :global(.info div:nth-child(1)) {
            grid-column: 1 / 6;
          }
          main :global(.info div:nth-child(2)) {
            grid-column: 7 / 13;
          }
          main :global(.conclude) div:nth-child(2) {
            margin: 20px auto;
            padding: 0;
          }
          main :global(.conclude) div {
            padding: 0;
          }
          @media screen and (min-width: 0px) and (max-width: 1100px) {
            main :global(.info) {
              display: block;
              padding: 10px;
            }
            main :global(.info) h2 {
              color: #000;
              font-size: 1.4rem;
              line-height: 2.4rem;
            }
            main :global(.info) {
              background-color: #fff;
            }
            main :global(.info) p {
              font-size: 20px;
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
