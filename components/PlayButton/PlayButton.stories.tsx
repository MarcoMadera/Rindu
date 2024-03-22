import { Meta } from "@storybook/react";

import { PlayButton } from "components";

export default {
  title: "Components/PlayButton",
  component: PlayButton,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PlayButton>;

export const Default = {
  args: {
    size: 40,
    centerSize: 20,
  },
};
