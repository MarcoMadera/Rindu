import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PlaybackExtraControls from "../components/PlaybackExtraControls";
import { ToastContextProvider } from "context/ToastContext";
import UserContext, { IUserContext } from "context/UserContext";
import { HeaderContextProvider } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import {
  withKnobs,
  text,
  optionsKnob as options,
} from "@storybook/addon-knobs";
import { ISpotifyContext, ITrack, PlaylistItems } from "types/spotify";
export default {
  title: "Components/PlaybackExtraControls",
  component: PlaybackExtraControls,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof PlaybackExtraControls>;

const Template: ComponentStory<typeof PlaybackExtraControls> = () => {
  return (
    <div
      style={{
        padding: "2em",
        background: "#121212",
        position: "relative",
        width: "50%",
        marginTop: "300px",
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
                  allTracks: [] as ITrack[],
                  currentlyPlaying: undefined,
                  playlistPlayingId: undefined,
                  isPlaying: false,
                  setVolume: (() => console.log("setVolume")) as React.Dispatch<
                    React.SetStateAction<number>
                  >,
                  setLastVolume: (() =>
                    console.log("setLastVolume")) as React.Dispatch<
                    React.SetStateAction<number>
                  >,
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
                <PlaybackExtraControls />
              </ContextMenuContextProvider>
            </SpotifyContext.Provider>
          </HeaderContextProvider>
        </UserContext.Provider>
      </ToastContextProvider>
    </div>
  );
};

export const Default = Template.bind({});
