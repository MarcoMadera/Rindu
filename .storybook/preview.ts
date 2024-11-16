import { DocsContainer, DocsPage } from "@storybook/addon-docs";
import type { Preview } from "@storybook/react";

import { themes } from "@storybook/theming";

import { WithConfiguration } from "./decorators/WithConfiguration";

import { Locale } from "../utils/locale";

const preview: Preview = {
  parameters: {
    actions: {
      handles: ["click", "input", "submit"],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      theme: themes.dark,
    },
    docs: {
      theme: themes.dark,
      container: DocsContainer,
      page: DocsPage,
    },
    backgrounds: {
      default: "black",
      values: [
        {
          name: "black",
          value: "#121212",
        },
        {
          name: "spotify",
          value: "#1DB954",
        },
        {
          name: "netflix",
          value: "#E50914",
        },
        {
          name: "twitter",
          value: "#00aced",
        },
        {
          name: "facebook",
          value: "#3b5998",
        },
        {
          name: "airbnb",
          value: "#FF5A5F",
        },
        {
          name: "white",
          value: "#ffffff",
        },
      ],
    },
  },
  globals: {
    language: Locale.EN,
    accessToken: "",
    product: "premium",
    isLogin: true,
  },
  globalTypes: {
    language: {
      name: "Language",
      description: "The language to display the component in",
      defaultValue: Locale.EN,
      toolbar: {
        icon: "globe",
        items: [
          { value: Locale.EN, right: "🇺🇸", title: "English" },
          { value: Locale.ES, right: "🇪🇸", title: "Español" },
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

  decorators: [WithConfiguration],
};

export default preview;
