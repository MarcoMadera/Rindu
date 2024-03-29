import React from "react";

import { Meta, StoryFn } from "@storybook/react";
import { fn } from "@storybook/test";

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

export const WithUpdate = {
  render: Template,

  args: {
    title: "Interval slider",
    updateProgress: 1,
    intervalUpdateAction: {
      steps: 100 / 12,
      labelUpdateValue: 1,
      ms: 1000,
      shouldUpdate: true,
    },
    onDragging: fn(),
    setLabelValue: (value: string): void => {
      console.info("label", value);
    },
    valueText: "value",
    initialValuePercent: 0,
    action: (progressPercent: number): void => {
      console.info("progressPercent", progressPercent);
    },
  },
};

export const Static = {
  render: Template,

  args: {
    title: "Static Slider",
    setLabelValue: (value: string): void => {
      console.info("label", value);
    },
    valueText: "value",
    initialValuePercent: 0,
    action: (progressPercent: number): void => {
      console.info("progressPercent", progressPercent);
    },
    onDragging: fn(),
  },
};
