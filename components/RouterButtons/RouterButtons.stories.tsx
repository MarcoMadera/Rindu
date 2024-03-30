import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { RouterButtons } from "components";

export default {
  title: "Components/RouterButtons",
  component: RouterButtons,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
} as Meta<typeof RouterButtons>;

const Template: StoryFn<typeof RouterButtons> = () => {
  return (
    <div
      style={{
        padding: "2em",
      }}
    >
      <RouterButtons />
    </div>
  );
};

export const Default = {
  render: Template,
};
