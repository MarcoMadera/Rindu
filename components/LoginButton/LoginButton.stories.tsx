import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { LoginButton } from "components";

export default {
  title: "Components/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof LoginButton>;

const Template: StoryFn<typeof LoginButton> = () => {
  return <LoginButton />;
};

export const Default = Template.bind({});
