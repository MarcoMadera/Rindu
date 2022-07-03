import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RemoveTracksModal from "../components/RemoveTracksModal";
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
  title: "Components/RemoveTracksModal",
  component: RemoveTracksModal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof RemoveTracksModal>;

const Template: ComponentStory<typeof RemoveTracksModal> = (args) => {
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
              <RemoveTracksModal {...args} />
            </ContextMenuContextProvider>
          </SpotifyContext.Provider>
        </HeaderContextProvider>
      </UserContext.Provider>
    </ToastContextProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  openModal: true,
  isLibrary: true,
};
