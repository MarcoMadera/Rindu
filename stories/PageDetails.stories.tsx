import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PageDetails from "../components/PageDetails";
import { HeaderContextProvider } from "context/HeaderContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { ToastContextProvider } from "context/ToastContext";
import {
  AllTracksFromAPlayList,
  ISpotifyContext,
  normalTrackTypes,
  PlaylistItems,
} from "types/spotify";
import {
  withKnobs,
  text,
  boolean,
  optionsKnob as options,
} from "@storybook/addon-knobs";
import SpotifyContext from "context/SpotifyContext";
import UserContext, { Context } from "context/UserContext";
export default {
  title: "Components/PageDetails",
  component: PageDetails,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof PageDetails>;
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
  disc_number: 1,
  duration_ms: 234180,
  explicit: false,
  external_ids: {
    isrc: "QMPU51501752",
  },
  external_urls: {
    spotify: "https://open.spotify.com/track/1pCblJqsFVRNc9Xmg0oQz8",
  },
  href: "https://api.spotify.com/v1/tracks/1pCblJqsFVRNc9Xmg0oQz8",
  id: "1pCblJqsFVRNc9Xmg0oQz8",
  is_local: false,
  is_playable: true,
  name: "Собирай меня",
  popularity: 42,
  preview_url:
    "https://p.scdn.co/mp3-preview/cfa1f1a97bbb1146b837fffcb03e93f5dd6c6cc9?cid=4131d07903c94ae5b560db44fc1fed20",
  track_number: 7,
  type: "track",
  uri: "spotify:track:1pCblJqsFVRNc9Xmg0oQz8",
};
const Template: ComponentStory<typeof PageDetails> = (args) => {
  return (
    <ToastContextProvider>
      <UserContext.Provider
        value={
          {
            user: {
              product: options(
                "product",
                {
                  Premium: "premium",
                  Open: "open",
                },
                "premium",
                {
                  display: "inline-radio",
                }
              ),
            },
            accessToken: text("accessToken", "you need a token here"),
          } as Context
        }
      >
        <HeaderContextProvider>
          <SpotifyContext.Provider
            value={
              {
                deviceId: text("deviceId", ""),
                playlists: [] as PlaylistItems,
                allTracks: [] as AllTracksFromAPlayList,
                currrentlyPlaying: boolean("IsPlaying", false)
                  ? (track as normalTrackTypes)
                  : undefined,
                playlistPlayingId: boolean("IsPlaying", false)
                  ? track.id
                  : undefined,
                isPlaying: boolean("IsPlaying", false),
                setPlayedSource: (() => "") as React.Dispatch<
                  React.SetStateAction<string | undefined>
                >,
                setPlaylistPlayingId: (() => "") as React.Dispatch<
                  React.SetStateAction<string | undefined>
                >,
                setIsShowingSideBarImg: ((value) =>
                  console.log("showing image:", value)) as React.Dispatch<
                  React.SetStateAction<boolean>
                >,
              } as ISpotifyContext
            }
          >
            <ContextMenuContextProvider>
              <PageDetails {...args} />
            </ContextMenuContextProvider>
          </SpotifyContext.Provider>
        </HeaderContextProvider>
      </UserContext.Provider>
    </ToastContextProvider>
  );
};

export const Default = Template.bind({});
export const WithBanner = Template.bind({});
WithBanner.args = {
  banner:
    "https://www.theaudiodb.com/images/media/artist/fanart/qqwxxp1542730121.jpg",
};
export const WithData = Template.bind({});
WithData.args = {
  data: track as normalTrackTypes,
};
