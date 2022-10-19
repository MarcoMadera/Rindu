import { RouterContext } from "next/dist/shared/lib/router-context";
import * as NextImage from "next/image";
import "../styles/globals.css";
import "./preview.css";
import { addDecorator } from "@storybook/react";
import { themes } from "@storybook/theming";
import React from "react";
import TranslationsContext from "../context/TranslationsContext";
import { translations } from "../utils/getTranslations";

const allENTranslations: Record<string, string>[] = Object.values(
  translations.EN
);
const allENTranslationsFlat = allENTranslations.reduce(
  (acc, cur) => ({ ...acc, ...cur }),
  {}
);

addDecorator((storyFn) => (
  <>
    <TranslationsContext.Provider
      value={{
        translations: allENTranslationsFlat,
      }}
    >
      <div>{storyFn()}</div>
    </TranslationsContext.Provider>

    <div id="tracksModal" />
    <div id="toast" />
    <div id="contextMenu" />
  </>
));

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.light,
  },
  nextRouter: {
    Provider: RouterContext.Provider,
    query: {
      country: "US",
    },
  },
};
