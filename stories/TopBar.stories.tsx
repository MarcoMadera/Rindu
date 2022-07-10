import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TopBar from "../components/TopBar";
import UserContext, {
  IUserContext,
  UserContextProvider,
} from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import HeaderContext, {
  IHeaderContext as HContext,
  HeaderContextProvider,
} from "context/HeaderContext";
import SpotifyContext, { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import {
  withKnobs,
  text,
  optionsKnob as options,
} from "@storybook/addon-knobs";
import PlaylistTopBarExtraField from "components/PlaylistTopBarExtraField";
import { ISpotifyContext, PlaylistItems } from "types/spotify";

export default {
  title: "Components/TopBar",
  component: TopBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof TopBar>;

const track = {
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
} as SpotifyApi.TrackObjectFull;

const Template: ComponentStory<typeof TopBar> = () => (
  <ToastContextProvider>
    <UserContextProvider>
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <TopBar />
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContextProvider>
  </ToastContextProvider>
);

const LoggedInTemplate: ComponentStory<typeof TopBar> = () => (
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
            display_name: "Marco Madera",
            images: [
              {
                url: "https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234",
              },
            ],
          },
          isLogin: true,
          accessToken: text("accessToken", "you need a token here"),
        } as IUserContext
      }
    >
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <TopBar />
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContext.Provider>
  </ToastContextProvider>
);
const LoggedInWithExtraFieldTemplate: ComponentStory<typeof TopBar> = () => (
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
            display_name: "Marco Madera",
            images: [
              {
                url: "https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234",
              },
            ],
          },
          isLogin: true,
          accessToken: text("accessToken", "you need a token here"),
        } as IUserContext
      }
    >
      <HeaderContext.Provider
        value={
          {
            element: <PlaylistTopBarExtraField track={track} isSingle={true} />,
            displayOnFixed: true,
            setDisplayOnFixed: (() => {
              console.log("setDisplayOnFixed");
            }) as React.Dispatch<React.SetStateAction<boolean>>,
            setAlwaysDisplayColor: (() => {
              console.log("setAlwaysDisplayColor");
            }) as React.Dispatch<React.SetStateAction<boolean>>,
            setDisableOpacityChange: (() => {
              console.log("setDisableOpacityChange");
            }) as React.Dispatch<React.SetStateAction<boolean>>,
            setElement: (() => {
              console.log("setElement");
            }) as React.Dispatch<
              React.SetStateAction<React.ReactElement<
                unknown,
                string | React.JSXElementConstructor<unknown>
              > | null>
            >,
          } as HContext
        }
      >
        <SpotifyContext.Provider
          value={
            {
              pageDetails: { name: "Extra field" },
              playlists: [] as PlaylistItems,
            } as ISpotifyContext
          }
        >
          <ContextMenuContextProvider>
            <TopBar />
          </ContextMenuContextProvider>
        </SpotifyContext.Provider>
      </HeaderContext.Provider>
    </UserContext.Provider>
  </ToastContextProvider>
);

export const Default = Template.bind({});
export const LoggedIn = LoggedInTemplate.bind({});
export const LoggedInWithExtraField = LoggedInWithExtraFieldTemplate.bind({});

LoggedIn.parameters = {
  layout: "fullscreen",
  nextRouter: {
    query: {
      foo: "this-is-a-global-override",
    },
    asPath: "/dashboard",
  },
};
LoggedInWithExtraField.parameters = {
  layout: "fullscreen",
  nextRouter: {
    query: {
      foo: "this-is-a-global-override",
    },
    asPath: "/dashboard",
  },
};
