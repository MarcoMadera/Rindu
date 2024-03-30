import { Meta } from "@storybook/react";

import { Button } from "components";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Button>;

export const Default = {
  args: {
    children: "click me",
  },
};
