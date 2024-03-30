import { ReactElement, useEffect } from "react";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Router from "next/router";

import { CardContainer, FeatureCard, Hero } from "components";
import { useAnalytics, useAuth } from "hooks";
import { ITranslations } from "types/translations";
import {
  ACCESS_TOKEN_COOKIE,
  getSpotifyLoginURL,
  isServer,
  REFRESH_TOKEN_COOKIE,
  removeTokensFromCookieServer,
  serverRedirect,
  takeCookie,
} from "utils";
import { getTranslations } from "utils/getTranslations";
import { refreshAccessToken } from "utils/spotifyCalls";

interface HomeProps {
  translations: ITranslations;
}

interface IFeature {
  eyeBrowText: string;
  titleText: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  anchorType: string;
  ctaText: string;
}

const Home = ({
  translations,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement => {
  const { setIsLogin } = useAuth();

  const { trackWithGoogleAnalytics } = useAnalytics();
  useEffect(() => {
    trackWithGoogleAnalytics();
  }, [trackWithGoogleAnalytics]);

  useEffect(() => {
    setIsLogin(false);
  }, [setIsLogin]);

  const onCTAClick = async () => {
    if (isServer()) return;
    const url = await getSpotifyLoginURL();
    window.location.href = url;
  };

  return (
    <main>
      <Hero
        heroTitle={translations.pages.home.heroTitle}
        imgAlt="hero image"
        imgSrc="https://res.cloudinary.com/marcomadera/image/upload/v1645938502/Spotify-Cleaner-App/Mu1_ytmhg5.jpg"
      />
      <CardContainer className="info">
        <div>
          <h2>{translations.pages.home.heroInfoTitle}</h2>
        </div>
        <div>
          <p>{translations.pages.home.heroInfoDescription}</p>
        </div>
      </CardContainer>
      {translations.homeFeatures.map((feature: IFeature) => {
        return (
          <FeatureCard
            key={feature.titleText}
            titleText={feature.titleText}
            description={feature.description}
            eyeBrowText={feature.eyeBrowText}
            imageSrc={feature.imageSrc}
            imageAlt={feature.imageAlt}
            onCTAClick={onCTAClick}
            ctaText={feature.ctaText}
          />
        );
      })}
      <CardContainer className="conclude">
        <div>
          <h2>{translations.pages.home.concludeSectionTitle}</h2>
        </div>
        <div>
          <p>{translations.pages.home.concludeSectionDescription}</p>
          <button onClick={onCTAClick}>
            {translations.pages.home.concludeSectionCta}
          </button>
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
            min-height: calc((var(--vh, 1vh) * 100) - 124px);
            width: 100%;
            display: block;
            margin: 0 auto;
          }
          main :global(section.info) {
            background-color: #fff;
            color: #000;
          }
          main :global(.info) div {
            padding: 0;
          }
          main :global(section.info) h2 {
            color: #000;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          main :global(section.info) p {
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 0.6px;
            word-spacing: 1.4px;
            line-height: 1.6;
          }
          main :global(section.info div:nth-child(1)) {
            grid-column: 1 / 6;
          }
          main :global(section.info div:nth-child(2)) {
            grid-column: 7 / 13;
          }
          main :global(.conclude) div:nth-child(2) {
            margin: 20px auto;
            padding: 0;
          }
          main :global(.conclude) div {
            padding: 0;
          }
          main :global(button) {
            border: 1px solid #72727280;
            cursor: pointer;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            font-size: 0.8125rem;
            font-weight: 700;
            font-family: sans-serif;
            background-color: transparent;
            border-radius: 9999px;
            cursor: pointer;
            position: relative;
            text-align: center;
            text-decoration: none;
            text-transform: none;
            touch-action: manipulation;
            transition-duration: 33ms;
            transition-property: background-color, border-color, color,
              box-shadow, filter, transform;
            user-select: none;
            vertical-align: middle;
            transform: translate3d(0px, 0px, 0px);
            padding-block-start: 3px;
            padding-block-end: 3px;
            padding-inline-start: 15px;
            padding-inline-end: 15px;
            border: 1px solid 727272;
            color: #fff;
            min-inline-size: 0px;
            min-block-size: 32px;
            display: inline-flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
          }
          main :global(button:hover) {
            transform: scale(1.04);
            border: 1px solid #fff;
          }
          main :global(button:active) {
            opacity: 0.7;
            outline: none;
            transform: scale(1);
            border: 1px solid #727272;
          }
          @media screen and (min-width: 0px) and (max-width: 1100px) {
            main :global(section.info) {
              display: block;
              padding: 10px;
            }
            main :global(section.info) h2 {
              color: #000;
              font-size: 1.4rem;
              line-height: 2.4rem;
            }
            main :global(section.info) {
              background-color: #fff;
            }
            main :global(section.info) p {
              font-size: 20px;
            }
          }
        `}
      </style>
    </main>
  );
};

export default Home;

export const getServerSideProps = (async (context) => {
  const translations = getTranslations(context);

  if (!context.req.cookies) {
    return { props: { translations } };
  }

  const refreshToken = takeCookie(REFRESH_TOKEN_COOKIE, context);

  if (refreshToken) {
    await refreshAccessToken(context);
    const access_token = takeCookie(ACCESS_TOKEN_COOKIE, context);
    if (!access_token) {
      removeTokensFromCookieServer(context.res);
      return { props: { translations } };
    }

    if (context.res) {
      serverRedirect(context.res, "/dashboard");
    } else {
      Router.replace("/dashboard");
    }
    return { props: { translations } };
  }
  removeTokensFromCookieServer(context.res);

  return { props: { translations } };
}) satisfies GetServerSideProps<HomeProps>;
