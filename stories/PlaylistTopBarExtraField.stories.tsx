import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PlaylistTopBarExtraField } from "components";
export default {
  title: "Components/PlaylistTopBarExtraField",
  component: PlaylistTopBarExtraField,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
    spotifyValue: {
      pageDetails: {
        name: "Собирай меня",
      },
    },
  },
} as ComponentMeta<typeof PlaylistTopBarExtraField>;

const Template: ComponentStory<typeof PlaylistTopBarExtraField> = () => {
  return <PlaylistTopBarExtraField />;
};

export const Default = Template.bind({});
