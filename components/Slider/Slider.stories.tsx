import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { Slider } from "components";

export default {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as Meta<typeof Slider>;

const Template: StoryFn<typeof Slider> = (args) => {
  return <Slider {...args} />;
};

export const WithUpdate = Template.bind({});
WithUpdate.args = {
  title: "Interval slider",
  updateProgress: 1,
  intervalUpdateAction: {
    steps: 100 / 12,
    labelUpdateValue: 1,
    ms: 1000,
    shouldUpdate: true,
  },
  onDragging: (isDragging) => {
    console.info("draggin", isDragging);
  },
  setLabelValue: (value) => {
    console.info("label", value);
  },
  valueText: "value",
  initialValuePercent: 0,
  action: (progressPercent) => {
    console.info("progressPercent", progressPercent);
  },
};

export const Static = Template.bind({});
Static.args = {
  title: "Static Slider",
  setLabelValue: (value) => {
    console.info("label", value);
  },
  valueText: "value",
  initialValuePercent: 0,
  action: (progressPercent) => {
    console.info("progressPercent", progressPercent);
  },
};
