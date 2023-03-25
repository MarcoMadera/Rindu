import type { StorybookConfig } from "@storybook/core-common";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import type { Configuration } from "webpack";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next-router",
    "@storybook/addon-knobs",
    {
      name: "@storybook/addon-docs",
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
  ],
  core: {
    builder: "@storybook/builder-webpack5",
  },
  features: {
    postcss: false,
    previewMdx2: true,
  },
  framework: "@storybook/react",
  staticDirs: ["../public"],
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  typescript: {
    // @ts-ignore
    reactDocgen: "react-docgen-typescript-plugin",
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
