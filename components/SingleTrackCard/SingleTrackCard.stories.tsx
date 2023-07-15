import React from "react";

import { Meta, StoryFn } from "@storybook/react";

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

const Template: StoryFn<typeof SingleTrackCard> = (args) => (
  <SingleTrackCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  track: track,
};
