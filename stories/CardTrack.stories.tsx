import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import CardTrack, { CardType } from "../components/CardTrack";
import { ITrack } from "types/spotify";
export default {
  title: "Components/CardTrack",
  component: CardTrack,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
  argTypes: {
    isTrackInLibrary: {
      control: { type: "boolean" },
    },
  },
} as Meta<typeof CardTrack>;

const Template: StoryFn<typeof CardTrack> = (args) => <CardTrack {...args} />;

const track = {
  album: {
    album_type: "album",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/11sIz9STeD6yVSuBaD8nMW",
        },
        href: "https://api.spotify.com/v1/artists/11sIz9STeD6yVSuBaD8nMW",
        id: "11sIz9STeD6yVSuBaD8nMW",
        name: "Artem Pivovarov",
        type: "artist",
        uri: "spotify:artist:11sIz9STeD6yVSuBaD8nMW",
      },
    ],
    external_urls: {
      spotify: "https://open.spotify.com/album/0YsnO662yMAjaOa99vxBug",
    },
    href: "https://api.spotify.com/v1/albums/0YsnO662yMAjaOa99vxBug",
    id: "0YsnO662yMAjaOa99vxBug",
    images: [
      {
        height: 640,
        url: "https://i.scdn.co/image/ab67616d0000b273dc214b2049cae8b60229207c",
        width: 640,
      },
      {
        height: 300,
        url: "https://i.scdn.co/image/ab67616d00001e02dc214b2049cae8b60229207c",
        width: 300,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/ab67616d00004851dc214b2049cae8b60229207c",
        width: 64,
      },
    ],
    name: "Океан",
    release_date: "2015-08-31",
    release_date_precision: "day",
    total_tracks: 11,
    type: "album",
    uri: "spotify:album:0YsnO662yMAjaOa99vxBug",
  },
  images: [
    {
      url: "https://i.scdn.co/image/ab67616d0000b273dc214b2049cae8b60229207c",
    },
    {
      url: "https://i.scdn.co/image/ab67616d00001e02dc214b2049cae8b60229207c",
    },
    {
      url: "https://i.scdn.co/image/ab67616d00004851dc214b2049cae8b60229207c",
    },
  ],
  artists: [
    {
      id: "11sIz9STeD6yVSuBaD8nMW",
      name: "Artem Pivovarov",
      type: "artist",
      uri: "spotify:artist:11sIz9STeD6yVSuBaD8nMW",
    },
  ],
  duration: 234180,
  explicit: false,
  href: "https://api.spotify.com/v1/tracks/1pCblJqsFVRNc9Xmg0oQz8",
  id: "1pCblJqsFVRNc9Xmg0oQz8",
  is_local: false,
  is_playable: true,
  name: "Собирай меня",
  type: "track",
  uri: "spotify:track:1pCblJqsFVRNc9Xmg0oQz8",
} as ITrack;

export const Default = Template.bind({});
Default.args = {
  track,
  position: 0,
  accessToken: "",
  style: {},
  type: CardType.Playlist,
  isTrackInLibrary: false,
  isSingleTrack: false,
  playlistUri: "",
  uri: "5aubkIdfpFOBcHaF8gxYwo",
  onClickAdd: undefined,
};

export const WithAddButton = Template.bind({});
WithAddButton.args = {
  track,
  position: 0,
  accessToken: "",
  style: {},
  type: CardType.Presentation,
  isTrackInLibrary: false,
  isSingleTrack: false,
  playlistUri: "",
  uri: "5aubkIdfpFOBcHaF8gxYwo",
  onClickAdd: () => {
    console.info("onClickAdd");
  },
};
