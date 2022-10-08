import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import FirstTrackContainer from "../components/FirstTrackContainer";
import { ToastContextProvider } from "context/ToastContext";
import UserContext, { IUserContext } from "context/UserContext";
import { HeaderContextProvider } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import {
  withKnobs,
  text,
  boolean,
  optionsKnob as options,
} from "@storybook/addon-knobs";
import { ISpotifyContext, ITrack, PlaylistItems } from "types/spotify";
export default {
  title: "Components/FirstTrackContainer",
  component: FirstTrackContainer,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof FirstTrackContainer>;

const Template: ComponentStory<typeof FirstTrackContainer> = (args) => {
  return (
    <div
      style={{
        padding: "2em",
      }}
    >
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
            } as IUserContext
          }
        >
          <HeaderContextProvider>
            <SpotifyContext.Provider
              value={
                {
                  deviceId: text("deviceId", ""),
                  playlists: [] as PlaylistItems,
                  allTracks: [{ uri: args.track.uri }] as ITrack[],
                  currentlyPlaying: boolean("IsPlaying", false)
                    ? ({
                        id: args.track.id,
                      } as ITrack)
                    : undefined,
                  playlistPlayingId: boolean("IsPlaying", false)
                    ? args.track.id
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
                <FirstTrackContainer {...args} />
              </ContextMenuContextProvider>
            </SpotifyContext.Provider>
          </HeaderContextProvider>
        </UserContext.Provider>
      </ToastContextProvider>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  track: {
    album: {
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
      type: "album",
      uri: "spotify:album:0YsnO662yMAjaOa99vxBug",
    },
    artists: [
      {
        id: "11sIz9STeD6yVSuBaD8nMW",
        name: "Artem Pivovarov",
        type: "artist",
        uri: "spotify:artist:11sIz9STeD6yVSuBaD8nMW",
      },
    ],
    duration_ms: 234180,
    explicit: false,
    id: "1pCblJqsFVRNc9Xmg0oQz8",
    is_local: false,
    is_playable: true,
    name: "Собирай меня",
    preview_url:
      "https://p.scdn.co/mp3-preview/cfa1f1a97bbb1146b837fffcb03e93f5dd6c6cc9?cid=4131d07903c94ae5b560db44fc1fed20",
    type: "track",
    uri: "spotify:track:1pCblJqsFVRNc9Xmg0oQz8",
  },
  backgroundColor: "rgba(171, 202, 165, 0.9)",
  position: 0,
};
