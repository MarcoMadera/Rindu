import React from "react";

import {
  boolean,
  optionsKnob as options,
  text,
  withKnobs,
} from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PresentationCard, SubTitle } from "components";
import { CardType } from "components/CardContent";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import UserContext from "context/UserContext";
import { ISpotifyContext, ITrack, PlaylistItems } from "types/spotify";

export default {
  title: "Components/CardContent",
  component: PresentationCard,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    id: { control: "text" },
    title: { control: "text" },
    subTitle: { control: "text", type: "string" },
    images: { control: "array" },
    type: {
      options: CardType,
      control: { type: "select" },
    },
    track: { control: "object" },
    isSingle: { control: "boolean" },
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof PresentationCard>;

const Template: ComponentStory<typeof PresentationCard> = (args) => (
  <div style={{ maxWidth: "192px", margin: "2em" }}>
    <ToastContextProvider>
      <UserContext.Provider
        value={{
          isLogin: true,
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
                currentlyPlaying: boolean("IsPlaying", false)
                  ? ({
                      id: args.id,
                    } as ITrack)
                  : undefined,
                playlistPlayingId: boolean("IsPlaying", false)
                  ? args.id
                  : undefined,
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
              <PresentationCard {...args} />
            </ContextMenuContextProvider>
          </SpotifyContext.Provider>
        </HeaderContextProvider>
      </UserContext.Provider>
    </ToastContextProvider>
  </div>
);

export const Playlist = Template.bind({});
Playlist.args = {
  id: "37i9dQZF1DX5KARSfd7WcM",
  type: CardType.PLAYLIST,
  images: [
    {
      url: "https://i.scdn.co/image/ab67706f00000003523f91ed9aa259969526c305",
      width: 150,
      height: 150,
    },
  ],
  title: "Heartstopper: Official Mixtape",
  subTitle: "The official playlist for Heartstopper. Watch now on Netflix!",
};

export const Track = Template.bind({});
Track.args = {
  id: "0gYXw7aPoybWFfB7btQ0eM",
  type: CardType.TRACK,
  images: [
    {
      url: "https://i.scdn.co/image/ab67616d0000b2738576efada2170fafa9577cad",
      width: 150,
      height: 150,
    },
  ],
  title: "DON'T YOU WORRY",
  subTitle: (
    <SubTitle
      artists={
        [
          {
            name: "Black Eyed Peas",
            external_urls: { spotify: "" },
            href: "",
            id: "1",
            type: "artist",
            uri: "spotify:artist:2",
          },
          {
            name: "Shakira",
            external_urls: { spotify: "" },
            href: "",
            id: "2",
            type: "artist",
            uri: "spotify:artist:3",
          },
          {
            name: "David Guetta",
            external_urls: { spotify: "" },
            href: "",
            id: "3",
            type: "artist",
            uri: "spotify:artist:3",
          },
        ] as SpotifyApi.ArtistObjectSimplified[]
      }
      albumType="single"
    />
  ),
  track: {
    uri: "spotify:track:0gYXw7aPoybWFfB7btQ0eM",
    name: "DON'T YOU WORRY",
    id: "0gYXw7aPoybWFfB7btQ0eM",
  } as SpotifyApi.TrackObjectFull,
  isSingle: true,
};

export const Artist = Template.bind({});
Artist.args = {
  id: "6qqNVTkY8uBg9cP3Jd7DAH",
  type: CardType.ARTIST,
  images: [
    {
      url: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
      width: 150,
      height: 150,
    },
  ],
  title: "Billie Eilish",
};
