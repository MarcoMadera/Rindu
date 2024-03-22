import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { Footer } from "components";

export default {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = () => {
  return <Footer />;
};

export const Default = {
  render: Template,
};
