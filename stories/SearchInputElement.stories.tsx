import React, { Dispatch, SetStateAction } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SearchInputElement } from "../components/SearchInputElement";
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
  title: "Components/SearchInputElement",
  component: SearchInputElement,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    source: {
      options: { playlist: "playlist", search: "search" },
      control: { type: "select" },
    },
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof SearchInputElement>;

const Template: ComponentStory<typeof SearchInputElement> = (args) => {
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
                currrentlyPlaying: undefined,
                playlistPlayingId: undefined,
                pageDetails: {
                  name: "Собирай меня",
                },
                isPlaying: false,
                setVolume: (() => console.log("setVolume")) as React.Dispatch<
                  React.SetStateAction<number>
                >,
                setAllTracks: (() =>
                  console.log("setAllTracks")) as React.Dispatch<
                  React.SetStateAction<ITrack[]>
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
              <div
                style={{
                  padding: "2em",
                  background: "#121212",
                }}
              >
                <SearchInputElement {...args} />
              </div>
            </ContextMenuContextProvider>
          </SpotifyContext.Provider>
        </HeaderContextProvider>
      </UserContext.Provider>
    </ToastContextProvider>
  );
};

export const Search = Template.bind({});
Search.args = {
  setData: (() => console.log("setData")) as Dispatch<
    SetStateAction<SpotifyApi.SearchResponse | null>
  >,
  source: "search",
};
export const Playlist = Template.bind({});
Playlist.args = {
  setData: (() => console.log("setData")) as Dispatch<
    SetStateAction<SpotifyApi.SearchResponse | null>
  >,
  source: "playlist",
};
