import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { LikedSongsCard } from "components";
import { mockPlaylistTrackResponse } from "utils/__tests__/__mocks__/mocks";
export default {
  title: "Components/LikedSongsCard",
  component: LikedSongsCard,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof LikedSongsCard>;

const Template: StoryFn<typeof LikedSongsCard> = (args) => {
  return <LikedSongsCard {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  likedSongs:
    mockPlaylistTrackResponse as unknown as SpotifyApi.PlaylistTrackResponse,
};
