import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PageHeader } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import { UserContextProvider } from "context/UserContext";
import { HeaderType } from "types/pageHeader";

export default {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    id: { control: "text" },
    title: { control: "text" },
    subTitle: { control: "text", type: "string" },
    images: { control: "array" },
    type: {
      options: HeaderType,
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof PageHeader>;

const Template: ComponentStory<typeof PageHeader> = (args) => (
  <ToastContextProvider>
    <UserContextProvider>
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <PageHeader {...args} />
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContextProvider>
  </ToastContextProvider>
);

export const Playlist = Template.bind({});
Playlist.args = {
  type: HeaderType.playlist,
  title: "Heartstopper: Official Mixtape",
  coverImg:
    "https://th.bing.com/th/id/OIP.3vYK8ab9Pg3FiufY8UgZOwHaHa?pid=ImgDet&rs=1",
  description: "The official playlist for Heartstopper. Watch now on Netflix!",
  ownerDisplayName: "Heartstopper",
  ownerId: "1",
  totalFollowers: 100,
  totalTracks: 10,
};

export const Artist = Template.bind({});
Artist.args = {
  type: HeaderType.artist,
  title: "Billie Eilish",
  coverImg:
    "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
  totalFollowers: 100,
  popularity: 80,
  disableOpacityChange: true,
};

export const ArtistWithBanner = Template.bind({});
ArtistWithBanner.args = {
  type: HeaderType.artist,
  title: "Billie Eilish",
  coverImg:
    "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
  totalFollowers: 100,
  popularity: 80,
  banner:
    "https://www.theaudiodb.com/images/media/artist/fanart/qqwxxp1542730121.jpg",
  disableOpacityChange: true,
};

export const Episode = Template.bind({});
Episode.args = {
  type: HeaderType.episode,
  title: "Shadow Work Demystified",
  coverImg: "https://i.scdn.co/image/ab6765630000ba8adea5d4cd16f16977604725eb",
  ownerId: "2OLNxlrm2OCdATbUaonmEh",
  ownerDisplayName: "Skinny Dipping",
};
