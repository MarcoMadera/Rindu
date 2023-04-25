import type { Preview } from "@storybook/react";
import { WithConfiguration } from "./decorators/WithConfiguration";
import { DocsPage, DocsContainer } from "@storybook/addon-docs";
import { themes } from "@storybook/theming";

const preview: Preview = {
  parameters: {
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

  decorators: [WithConfiguration],
};

export default preview;
