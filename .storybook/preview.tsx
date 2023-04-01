import { themes } from "@storybook/theming";
import { RouterContext } from "next/dist/shared/lib/router-context";
import * as NextImage from "next/image";
import React from "react";
import "../styles/globals.css";
import "./preview.css";
import { DocsPage, DocsContainer } from "@storybook/addon-docs";
import { Parameters } from "@storybook/react";
import { WithConfiguration } from "./decorators/WithConfiguration";

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters: Parameters = {
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
  globals: {
    language: "EN",
    accessToken: "",
    product: "premium",
    isLogin: true,
  },
  globalTypes: {
    language: {
      name: "Language",
      description: "The language to display the component in",
      defaultValue: "EN",
      toolbar: {
        icon: "globe",
        items: [
          { value: "EN", right: "🇺🇸", title: "English" },
          { value: "ES", right: "🇪🇸", title: "Español" },
        ],
      },
    },
    configuration: {
      name: "Configuration",
      description: "The configuration to display the components in",
      defaultValue: "",
      toolbar: {
        icon: "cog",
        items: [],
      },
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

export const decorators = [WithConfiguration];
