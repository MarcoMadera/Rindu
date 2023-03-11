import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LoadingSpinner } from "components";

export default {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof LoadingSpinner>;

const Template: ComponentStory<typeof LoadingSpinner> = () => {
  return (
    <div
      style={{
        padding: "2em",
        background: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <LoadingSpinner />
    </div>
  );
};

export const Default = Template.bind({});
