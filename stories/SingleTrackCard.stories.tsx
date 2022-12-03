import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SingleTrackCard from "../components/SingleTrackCard";
import { UserContextProvider } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
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

export const Default = Template;
Default.args = {
  track: {
    album: {
      album_type: "album",
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/11sIz9STeD6yVSuBaD8nMW",
          },
          href: "https://api.spotify.com/v1/artists/11sIz9STeD6yVSuBaD8nMW",
          id: "11sIz9STeD6yVSuBaD8nMW",
          name: "Artem Pivovarov",
          type: "artist",
          uri: "spotify:artist:11sIz9STeD6yVSuBaD8nMW",
        },
      ],
      external_urls: {
        spotify: "https://open.spotify.com/album/0YsnO662yMAjaOa99vxBug",
      },
      href: "https://api.spotify.com/v1/albums/0YsnO662yMAjaOa99vxBug",
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
      release_date_precision: "day",
      total_tracks: 11,
      type: "album",
      uri: "spotify:album:0YsnO662yMAjaOa99vxBug",
    },
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/11sIz9STeD6yVSuBaD8nMW",
        },
        href: "https://api.spotify.com/v1/artists/11sIz9STeD6yVSuBaD8nMW",
        id: "11sIz9STeD6yVSuBaD8nMW",
        name: "Artem Pivovarov",
        type: "artist",
        uri: "spotify:artist:11sIz9STeD6yVSuBaD8nMW",
      },
    ],
    disc_number: 1,
    duration_ms: 234180,
    explicit: false,
    external_ids: {
      isrc: "QMPU51501752",
    },
    external_urls: {
      spotify: "https://open.spotify.com/track/1pCblJqsFVRNc9Xmg0oQz8",
    },
    href: "https://api.spotify.com/v1/tracks/1pCblJqsFVRNc9Xmg0oQz8",
    id: "1pCblJqsFVRNc9Xmg0oQz8",
    is_local: false,
    is_playable: true,
    name: "Собирай меня",
    popularity: 42,
    preview_url:
      "https://p.scdn.co/mp3-preview/cfa1f1a97bbb1146b837fffcb03e93f5dd6c6cc9?cid=4131d07903c94ae5b560db44fc1fed20",
    track_number: 7,
    type: "track",
    uri: "spotify:track:1pCblJqsFVRNc9Xmg0oQz8",
  },
};
