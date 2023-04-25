import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { LoadingSpinner } from "components";

export default {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as Meta<typeof LoadingSpinner>;

const Template: StoryFn<typeof LoadingSpinner> = () => {
  return <LoadingSpinner />;
};

export const Default = Template.bind({});
