import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { SingleTrackCard } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import { UserContextProvider } from "context/UserContext";
export default {
  title: "Components/SingleTrackCard",
  component: SingleTrackCard,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof SingleTrackCard>;

const Template: ComponentStory<typeof SingleTrackCard> = (args) => (
  <ToastContextProvider>
    <UserContextProvider>
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <div
              style={{
                padding: "2em",
                background: "rgba(0, 0, 0, 0.9)",
                maxWidth: "400px",
              }}
            >
              <SingleTrackCard {...args} />
            </div>
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContextProvider>
  </ToastContextProvider>
);

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
    popularity: 42,
    preview_url:
      "https://p.scdn.co/mp3-preview/cfa1f1a97bbb1146b837fffcb03e93f5dd6c6cc9?cid=4131d07903c94ae5b560db44fc1fed20",
    type: "track",
    uri: "spotify:track:1pCblJqsFVRNc9Xmg0oQz8",
  },
};
