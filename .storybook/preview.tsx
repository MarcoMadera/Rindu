import { themes } from "@storybook/theming";
import { RouterContext } from "next/dist/shared/lib/router-context";
import * as NextImage from "next/image";
import React from "react";
import "../styles/globals.css";
import { translations, Language } from "../utils/getTranslations";
import "./preview.css";
import { DocsPage, DocsContainer } from "@storybook/addon-docs";
import { AppContextProvider } from "../context/AppContextProvider";
import { optionsKnob as options, text, boolean } from "@storybook/addon-knobs";
import { nextRouterMock } from "../utils/__tests__/__mocks__/mocks";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*",
    handles: ["click", "input", "submit"],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.light,
    container: DocsContainer,
    page: DocsPage,
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

export const decorators = [
  (Story, context) => {
    const allTranslations: Record<string, string>[] = Object.values(
      translations[
        options("Language", Language, Language.EN, {
          display: "select",
        })
      ]
    );
    const allTranslationsFlat = allTranslations.reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      {}
    );
    return (
      <div
        style={{
          padding: context.parameters.container?.disablePadding ? "" : "3rem",
          backgroundColor: `${
            !context.parameters.container?.backgroundTheme
              ? "transparent"
              : context.parameters.container?.backgroundTheme === "dark"
              ? "#121212"
              : "#fff"
          }`,
          ...context.parameters.container?.style,
        }}
        id="__next"
      >
        <RouterContext.Provider
          value={{ ...nextRouterMock, ...context.parameters.nextRouter }}
        >
          <AppContextProvider
            translations={allTranslationsFlat}
            userValue={{
              isLogin: boolean("isLogin", true),
              user: {
                product: options(
                  "product",
                  {
                    Premium: "premium",
                    Open: "open",
                  },
                  "premium",
                  {
                    display: "inline-radio",
                  }
                ),
                birthdate: "1990-01-01",
                country: "US",
                display_name: "Marco Madera",
                email: "rindu@marcomadera.com",
                id: "12133024755",
                images: [
                  {
                    url: "https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234",
                    height: 640,
                    width: 640,
                  },
                ],
                uri: "spotify:user:12133024755",
                type: "user",
                href: "https://api.spotify.com/v1/users/12133024755",
                followers: {
                  href: null,
                  total: 0,
                },
                external_urls: {
                  spotify: "https://open.spotify.com/user/12133024755",
                },
              } as SpotifyApi.UserObjectPrivate,
              accessToken: text("accessToken", "you need a token here"),
            }}
            spotifyValue={context.parameters.spotifyValue}
            contextMenuValue={context.parameters.contextMenuValue}
            headerValue={context.parameters.headerValue}
          >
            <Story />
          </AppContextProvider>
        </RouterContext.Provider>
        <div id="tracksModal" />
        <div id="toast" />
        <div id="contextMenu" />
      </div>
    );
  },
];
