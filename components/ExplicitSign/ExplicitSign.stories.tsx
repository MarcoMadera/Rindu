import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { ExplicitSign } from "components";

export default {
  title: "Components/ExplicitSign",
  component: ExplicitSign,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      style: {
        width: "fit-content",
      },
    },
  },
} as Meta<typeof ExplicitSign>;

const Template: StoryFn<typeof ExplicitSign> = () => {
  return <ExplicitSign />;
};

export const Default = Template.bind({});
