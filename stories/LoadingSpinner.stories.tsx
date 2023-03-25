import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof LoadingSpinner>;

const Template: ComponentStory<typeof LoadingSpinner> = () => {
  return <LoadingSpinner />;
};

export const Default = Template.bind({});
