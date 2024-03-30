import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { SideBar } from "components";
import translations from "i18n";
import { Locale } from "utils";
export default {
  title: "Components/SideBar",
  component: SideBar,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
      style: {
        maxWidth: "300px",
      },
    },
  },
} as Meta<typeof SideBar>;

const Template: StoryFn<typeof SideBar> = () => {
  return <SideBar width={245} translations={translations[Locale.EN]} />;
};

export const Default = {
  render: Template,
};
