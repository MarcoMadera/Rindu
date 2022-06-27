import { RouterContext } from "next/dist/shared/lib/router-context";
import * as NextImage from "next/image";
import "../styles/globals.css";
import "./preview.css";
import { addDecorator } from "@storybook/react";
import { themes } from "@storybook/theming";

addDecorator((storyFn) => (
  <>
    <div>{storyFn()}</div>

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
      foo: "this-is-a-global-override",
    },
  },
};
