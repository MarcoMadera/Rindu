import React from "react";

import { number, withKnobs } from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ContextMenu } from "components";
import ContextMenuContext from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import SpotifyContext from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import UserContext, { IUserContext } from "context/UserContext";
import { ContextMenuContextProviderProps } from "types/contextMenu";
import { ISpotifyContext } from "types/spotify";

export default {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof ContextMenu>;

export const Track: ComponentStory<typeof ContextMenu> = () => (
  <ToastContextProvider>
    <UserContext.Provider
      value={{ user: { id: "12133024755" } } as IUserContext}
    >
      <HeaderContextProvider>
        <SpotifyContext.Provider
          value={
            {
              playlists: [
                {
                  id: "1",
                  uri: "spotify:playlist:1",
                  name: "playlist 1",
                  owner: { id: "12133024755", display_name: "Marco Madera" },
                },
                {
                  id: "2",
                  uri: "spotify:playlist:2",
                  name: "playlist 2",
                  owner: { id: "12133024755", display_name: "Marco Madera" },
                },
                {
                  id: "3",
                  uri: "spotify:playlist:3",
                  name: "playlist 3",
                  owner: { id: "12133024755", display_name: "Marco Madera" },
                },
                {
                  id: "4",
                  uri: "spotify:playlist:4",
                  name: "playlist 4",
                  owner: { id: "12133024755", display_name: "Marco Madera" },
                },
              ],
            } as ISpotifyContext
          }
        >
          <ContextMenuContext.Provider
            value={
              {
                contextMenuData: {
                  type: "cardTrack",
                  data: {
                    album: {
                      id: "31776n0a6xHYMHSlK4983u",
                      name: "EMOTION SIDE B",
                      release_date: "2016-07-15",
                      type: "album",
                      uri: "spotify:album:31776n0a6xHYMHSlK4983u",
                      images: [],
                    },
                    artists: [
                      {
                        id: "6sFIWsNpZYqfjUpaCgueju",
                        name: "Carly Rae Jepsen",
                        type: "artist",
                        uri: "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
                      },
                    ],
                    duration_ms: 236533,
                    explicit: false,
                    is_local: false,
                    name: "Cry",
                    type: "track",
                    uri: "spotify:track:7wgxq27uOvfydLunYkcmAU",
                  },
                  position: {
                    x: number("position x", 50),
                    y: number("position y", 50),
                  },
                },
                setContextMenuData: () => {
                  console.log("setContextMenuData");
                },
              } as ContextMenuContextProviderProps
            }
          >
            <ContextMenu />
          </ContextMenuContext.Provider>
        </SpotifyContext.Provider>
      </HeaderContextProvider>
    </UserContext.Provider>
  </ToastContextProvider>
);
