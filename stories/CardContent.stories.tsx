import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PresentationCard from "../components/PlaylistCard";
import { UserContextProvider } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import SubTitle from "components/SubtTitle";

export default {
  title: "Components/CardContent",
  component: PresentationCard,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    id: { control: "text" },
    title: { control: "text" },
    subTitle: { control: "text", type: "string" },
    images: { control: "array" },
    type: {
      options: [
        "track",
        "playlist",
        "album",
        "artist",
        "user",
        "show",
        "genre",
        "episode",
      ],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof PresentationCard>;

const Template: ComponentStory<typeof PresentationCard> = (args) => (
  <div style={{ maxWidth: "192px", margin: "2em" }}>
    <ToastContextProvider>
      <UserContextProvider>
        <HeaderContextProvider>
          <SpotifyContextProvider>
            <ContextMenuContextProvider>
              <PresentationCard {...args} />
            </ContextMenuContextProvider>
          </SpotifyContextProvider>
        </HeaderContextProvider>
      </UserContextProvider>
    </ToastContextProvider>
  </div>
);

export const Playlist = Template.bind({});
Playlist.args = {
  id: "1",
  type: "playlist",
  images: [
    {
      url: "https://i.scdn.co/image/ab67706f00000003523f91ed9aa259969526c305",
      width: 150,
      height: 150,
    },
  ],
  title: "Heartstopper: Official Mixtape",
  subTitle: "The official playlist for Heartstopper. Watch now on Netflix!",
};

export const Track = Template.bind({});
Track.args = {
  id: "1",
  type: "track",
  images: [
    {
      url: "https://i.scdn.co/image/ab67616d0000b2738576efada2170fafa9577cad",
      width: 150,
      height: 150,
    },
  ],
  title: "DON'T YOU WORRY",
  subTitle: (
    <SubTitle
      artists={
        [
          {
            name: "Black Eyed Peas",
            external_urls: { spotify: "" },
            href: "",
            id: "1",
            type: "artist",
            uri: "spotify:artist:2",
          },
          {
            name: "Shakira",
            external_urls: { spotify: "" },
            href: "",
            id: "2",
            type: "artist",
            uri: "spotify:artist:3",
          },
          {
            name: "David Guetta",
            external_urls: { spotify: "" },
            href: "",
            id: "3",
            type: "artist",
            uri: "spotify:artist:3",
          },
        ] as SpotifyApi.ArtistObjectSimplified[]
      }
      albumType="single"
    />
  ),
};

export const Artist = Template.bind({});
Artist.args = {
  id: "4",
  type: "artist",
  images: [
    {
      url: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
      width: 150,
      height: 150,
    },
  ],
  title: "Billie Eilish",
};
