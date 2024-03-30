import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { PlaylistTopBarExtraField } from "components";
export default {
  title: "Components/PlaylistTopBarExtraField",
  component: PlaylistTopBarExtraField,
  parameters: {
    layout: "fullscreen",
    spotifyValue: {
      pageDetails: {
        name: "Собирай меня",
      },
    },
  },
} as Meta<typeof PlaylistTopBarExtraField>;

const Template: StoryFn<typeof PlaylistTopBarExtraField> = () => {
  return <PlaylistTopBarExtraField />;
};

export const Default = {
  render: Template,
};
