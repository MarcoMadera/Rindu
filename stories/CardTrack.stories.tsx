import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CardTrack from "../components/CardTrack";
import UserContext from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { ISpotifyContext, ITrack, PlaylistItems } from "types/spotify";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";
export default {
  title: "Components/CardTrack",
  component: CardTrack,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
  argTypes: {
    isTrackInLibrary: {
      control: { type: "boolean" },
    },
  },
} as ComponentMeta<typeof CardTrack>;

const Template: ComponentStory<typeof CardTrack> = (args) => (
  <ToastContextProvider>
    <UserContext.Provider
      value={{
        isLogin: true,
        user: {
          product: "premium",
        } as SpotifyApi.UserObjectPrivate,
        accessToken: text("accessToken", "you need a token here"),
        setAccessToken: () => "token",
        setIsLogin: () => true,
        setUser: () => ({}),
      }}
    >
      <HeaderContextProvider>
        <SpotifyContext.Provider
          value={
            {
              deviceId: text("deviceId", ""),
              playlists: [] as PlaylistItems,
              allTracks: [{ uri: args.track.uri }] as ITrack[],
              currentlyPlaying: {
                uri: boolean("IsPlaying", false) ? args.track.uri : undefined,
              } as ITrack,
              isPlaying: boolean("IsPlaying", false),
              setPlayedSource: (() => "") as React.Dispatch<
                React.SetStateAction<string | undefined>
              >,
              setPlaylistPlayingId: (() => "") as React.Dispatch<
                React.SetStateAction<string | undefined>
              >,
            } as ISpotifyContext
          }
        >
          <ContextMenuContextProvider>
            <div
              style={{
                margin: "2em",
                background: "#121212",
                minHeight: "180px",
                padding: "30px",
              }}
            >
              <CardTrack {...args} />
            </div>
          </ContextMenuContextProvider>
        </SpotifyContext.Provider>
      </HeaderContextProvider>
    </UserContext.Provider>
  </ToastContextProvider>
);

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

export const Default = Template;
Template.args = {
  track,
  position: 0,
  accessToken: "",
  style: {},
  type: "playlist",
  isTrackInLibrary: false,
  isSingleTrack: false,
  playlistUri: "",
  uri: "5aubkIdfpFOBcHaF8gxYwo",
  onClickAdd: undefined,
};

export const WithAddButton = Template;
WithAddButton.args = {
  track,
  position: 0,
  accessToken: "",
  style: {},
  type: "presentation",
  isTrackInLibrary: false,
  isSingleTrack: false,
  playlistUri: "",
  uri: "5aubkIdfpFOBcHaF8gxYwo",
  onClickAdd: () => {
    console.log("onClickAdd");
  },
};
