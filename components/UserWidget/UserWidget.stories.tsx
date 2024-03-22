import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { UserWidget } from "components";

export default {
  title: "Components/UserWidget",
  component: UserWidget,
  parameters: {
    layout: "fullscreen",
    container: {
      style: {
        maxWidth: "300px",
        display: "flex",
        justifyContent: "center",
      },
    },
  },
} as Meta<typeof UserWidget>;

const Template: StoryFn<typeof UserWidget> = () => (
  <UserWidget
    name="Marco Madera"
    img="https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234"
  />
);

export const Default = {
  render: Template,
};
