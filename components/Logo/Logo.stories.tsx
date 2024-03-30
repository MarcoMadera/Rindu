import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { Logo } from "components";

export default {
  title: "Design System/Logo",
  component: Logo,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Logo>;

const Template: StoryFn<typeof Logo> = (args) => {
  return <Logo {...args} />;
};

export const Default = {
  render: Template,

  args: {
    color: "#000",
  },
  parameters: {
    backgrounds: {
      default: "white",
    },
  },
};

export const LoggedIn = {
  render: Template,

  args: {
    color: "#fff",
  },
  parameters: {
    backgrounds: {
      default: "black",
    },
  },
};
