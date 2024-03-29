import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: "Rindu",
    brandUrl: "https://rindu.marcomadera.com",
    brandTarget: "_self",
    appPreviewBg: "#121212",
  },
});
