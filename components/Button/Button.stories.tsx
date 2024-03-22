import { Meta } from "@storybook/react";

import { Button } from "components";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as Meta<typeof Button>;

export const Default = {
  args: {
    children: "click me",
  },
};
