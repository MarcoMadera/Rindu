import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ProgressBar } from "../components/ProgressBar";
import { ToastContextProvider } from "context/ToastContext";
import UserContext, { Context } from "context/UserContext";
import { HeaderContextProvider } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import {
  withKnobs,
  text,
  optionsKnob as options,
} from "@storybook/addon-knobs";
import {
  AllTracksFromAPlayList,
  ISpotifyContext,
  PlaylistItems,
} from "types/spotify";
export default {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = () => {
  return (
    <div
      style={{
        padding: "2em",
        background: "#121212",
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
                  currrentlyPlaying: undefined,
                  playlistPlayingId: undefined,
                  playlistDetails: {
                    name: "Собирай меня",
                  },
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
                <ProgressBar />
              </ContextMenuContextProvider>
            </SpotifyContext.Provider>
          </HeaderContextProvider>
        </UserContext.Provider>
      </ToastContextProvider>
    </div>
  );
};

export const Default = Template.bind({});
