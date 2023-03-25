import React from "react";

import { boolean, withKnobs } from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { playlists, track } from "./mocks";
import { PageDetails } from "components";

export default {
  title: "Components/PageDetails",
  component: PageDetails,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
    spotifyValue: {
      playlistPlayingId: boolean("IsPlaying", false) ? track.id : "",
      playlists: playlists,
    },
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof PageDetails>;

const Template: ComponentStory<
  typeof PageDetails & { playlistPlayingId: string }
> = (args) => {
  return <PageDetails {...args} />;
};

export const Default = Template.bind({});

export const WithBanner = Template.bind({});
WithBanner.args = {
  banner:
    "https://www.theaudiodb.com/images/media/artist/fanart/qqwxxp1542730121.jpg",
};

export const WithData = Template.bind({});
WithData.args = {
  data: track,
};
