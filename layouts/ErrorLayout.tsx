import { ReactElement, useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { Button, ContentContainer, Heading } from "components";
import { useAnalytics, useTranslations } from "hooks";
import {
  ACCESS_TOKEN_COOKIE,
  eatCookie,
  Locale,
  REFRESH_TOKEN_COOKIE,
} from "utils";

export type ErrorTranslations = Record<
  Locale,
  {
    title: string;
    description: string;
    description2: string;
    button: string;
  }
>;

interface IErrorLayout {
  exDescription: string;
  errorTranslations: ErrorTranslations;
  playlistId: string;
  clearCookies?: boolean;
}

export default function ErrorLayout({
  exDescription,
  errorTranslations,
  playlistId,
  clearCookies,
}: Readonly<IErrorLayout>): ReactElement | null {
  const router = useRouter();
  const { trackWithGoogleAnalytics } = useAnalytics();
  const [emoji, setEmoji] = useState("🚀");

  const [translations, setTranslations] = useState<ErrorTranslations | null>(
    null
  );
  const { locale } = useTranslations();

  useEffect(() => {
    trackWithGoogleAnalytics("exception", {
      exDescription: `${exDescription}: ${router.pathname}`,
      exFatal: "1",
    });
  }, [router.pathname, trackWithGoogleAnalytics, exDescription]);

  useEffect(() => {
    setTranslations(errorTranslations);
  }, [errorTranslations]);

  useEffect(() => {
    const emojiList = ["🚀", "🛸", "🌍", "🌎", "🌏"];
    const intervalId = setInterval(() => {
      setEmoji(emojiList[Math.floor(Math.random() * emojiList.length)]);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  if (!translations) return null;

  const translate = translations[locale];

  return (
    <ContentContainer id="main">
      <Head>
        <title>{translate.title}</title>
      </Head>
      <Heading number={1}>{translate.title}</Heading>
      <p>{translate.description}</p>
      <p className="toxic-text">
        {translate.description2} {emoji}
      </p>
      <Button
        onClick={() => {
          if (clearCookies) {
            eatCookie(ACCESS_TOKEN_COOKIE);
            eatCookie(REFRESH_TOKEN_COOKIE);
          }
          history.pushState({}, "", "/");
          window.location.href = "/";
        }}
      >
        {translate.button}
      </Button>
      <iframe
        style={{ borderRadius: 12, border: "none", margin: "auto" }}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        width={640}
        height={352}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify"
      ></iframe>
      <style jsx>{`
        :global(main) {
          display: flex !important;
          flex-direction: column;
          align-items: center;
          height: 100vh;
        }
        :global(main h1) {
          text-align: center !important;
        }
        :global(button) {
          margin-top: 20px;
          font-size: 18px !important;
          padding: 16px 24px !important;
        }
        p {
          font-size: 30px;
          text-align: center;
        }
        iframe {
          margin-top: 20px !important;
          max-width: 100%;
        }
        .toxic-text {
          font-family: monospace;
          color: #00ff00;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          animation: glitch-horizontal 1s linear infinite;
          white-space: nowrap;
          overflow: hidden;
        }

        @keyframes glitch-horizontal {
          0% {
            text-shadow:
              -0.2px 0 #0f0,
              0.2px 0 #0f0;
          }
          20% {
            text-shadow:
              -0.2px 0 #0f0,
              0.2px 0 #0f0;
          }
          40% {
            text-shadow: 0px 0 #0f0;
          }
          60% {
            text-shadow:
              0.2px 0 #0f0,
              -0.2px 0 #0f0;
          }
          80% {
            text-shadow: 0px 0 #0f0;
          }
          100% {
            text-shadow:
              -0.2px 0 #0f0,
              0.2px 0 #0f0;
          }
        }
        @media (max-width: 600px) {
          :global(main h1) {
            font-size: 32px !important;
          }
          p {
            font-size: 22px;
          }
          iframe {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </ContentContainer>
  );
}
