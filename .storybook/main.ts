import type { StorybookConfig } from "@storybook/core-common";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import type { Configuration } from "webpack";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next-router",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  features: {
    postcss: false,
  },
  webpackFinal: (configuration) => {
    return {
      ...configuration,
      resolve: {
        ...configuration.resolve,
        plugins: [
          ...(configuration.resolve?.plugins || []),
          new TsconfigPathsPlugin({
            extensions: configuration.resolve?.extensions,
          }),
        ],
      },
    } as Configuration;
  },
};
module.exports = config;
