import { Meta } from "@storybook/react";

import { track } from "../mocks";
import { SingleTrackCard } from "components";

export default {
  title: "Components/SingleTrackCard",
  component: SingleTrackCard,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      style: {
        maxWidth: "400px",
      },
    },
  },
} as Meta<typeof SingleTrackCard>;

export const Default = {
  args: {
    track: track,
  },
};
