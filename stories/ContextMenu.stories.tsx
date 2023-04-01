import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { playlists } from "./mocks";
import { ContextMenu } from "components";

export default {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof ContextMenu>;

const Template: ComponentStory<typeof ContextMenu> = () => <ContextMenu />;
export const Track = Template.bind({});

Track.parameters = {
  contextMenuValue: {
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
        x: 50,
        y: 50,
      },
    },
  },
  spotifyValue: {
    playlists: playlists,
  },
};
