import React from "react";

import { Meta, StoryFn } from "@storybook/react";

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

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "click me",
};
