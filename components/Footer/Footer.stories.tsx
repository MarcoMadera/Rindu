import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { Footer } from "components";
import translations from "i18n";
import { Locale } from "utils";

export default {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = () => {
  return <Footer translations={translations[Locale.EN]} />;
};

export const Default = {
  render: Template,
};
