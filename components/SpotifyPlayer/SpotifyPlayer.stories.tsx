import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { SpotifyPlayer } from "components";
import translations from "i18n";
import { Locale } from "utils";
export default {
  title: "Components/SpotifyPlayer",
  component: SpotifyPlayer,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
} as Meta<typeof SpotifyPlayer>;

const Template: StoryFn<typeof SpotifyPlayer> = () => (
  <SpotifyPlayer translations={translations[Locale.EN]} />
);

export const Default = {
  render: Template,
};
