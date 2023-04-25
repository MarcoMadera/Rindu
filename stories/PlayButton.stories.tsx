import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { PlayButton } from "components";

export default {
  title: "Components/PlayButton",
  component: PlayButton,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PlayButton>;

const Template: StoryFn<typeof PlayButton> = (args) => <PlayButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 40,
  centerSize: 20,
};
