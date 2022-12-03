import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SideBar from "../components/SideBar";
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
  title: "Components/SideBar",
  component: SideBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof SideBar>;

const Template: ComponentStory<typeof SideBar> = () => {
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
                playlists: [
                  {
                    id: "1",
                    uri: "uri1",
                    name: "playlist 1",
                    type: "playlist",
                    owner: { id: "12133024755", display_name: "Marco Madera" },
                  },
                  {
                    id: "2",
                    uri: "uri2",
                    name: "playlist 2",
                    type: "playlist",
                    owner: { id: "12133024755", display_name: "Marco Madera" },
                  },
                  {
                    id: "3",
                    uri: "uri3",
                    name: "playlist 3",
                    type: "playlist",
                    owner: { id: "12133024755", display_name: "Marco Madera" },
                  },
                  {
                    id: "4",
                    uri: "uri4",
                    name: "playlist 4",
                    type: "playlist",
                    owner: { id: "12133024755", display_name: "Marco Madera" },
                  },
                ] as PlaylistItems,
                allTracks: [] as ITrack[],
                currentlyPlaying: undefined,
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
              <SideBar />
            </ContextMenuContextProvider>
          </SpotifyContext.Provider>
        </HeaderContextProvider>
      </UserContext.Provider>
    </ToastContextProvider>
  );
};

export const Default = Template;
