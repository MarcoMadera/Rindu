import React from "react";

import { Meta } from "@storybook/react";

import { PresentationCard, SubTitle } from "components";
import { CardType } from "components/CardContent";

export default {
  title: "Components/CardContent",
  component: PresentationCard,
  parameters: {
    layout: "fullscreen",
    container: {
      style: {
        maxWidth: "290px",
      },
    },
  },
  argTypes: {
    id: {
      control: "text",
      type: "string",
      description:
        "id of the track or playlist, found in the url https://open.spotify.com/track/3EKqxoUzL0ly6lFcMdxi69 the id is 3EKqxoUzL0ly6lFcMdxi69",
    },
    title: {
      control: "text",
      type: "string",
      description: "title of the card",
    },
    subTitle: { control: "text", type: "string", description: "subTitle" },
    images: { control: "array" },
    type: {
      description: "type of card",
      options: CardType,
      control: {
        type: "select",
        labels: CardType,
        description: "type of card",
      },
    },
    track: {
      control: "object",
      description: "track object",
      type: "string",
    },
    isSingle: {
      control: "boolean",
      defaultValue: true,
      description: "isSingle",
    },
  },
} as Meta<typeof PresentationCard>;

export const Playlist = {
  args: {
    id: "37i9dQZF1DX5KARSfd7WcM",
    type: CardType.PLAYLIST,
    images: [
      {
        url: "https://i.scdn.co/image/ab67706f00000003523f91ed9aa259969526c305",
        width: 150,
        height: 150,
      },
    ],
    title: "Heartstopper: Official Mixtape",
    subTitle: "The official playlist for Heartstopper. Watch now on Netflix!",
  },
};

export const Track = {
  args: {
    id: "0gYXw7aPoybWFfB7btQ0eM",
    type: CardType.TRACK,
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
    track: {
      uri: "spotify:track:0gYXw7aPoybWFfB7btQ0eM",
      name: "DON'T YOU WORRY",
      id: "0gYXw7aPoybWFfB7btQ0eM",
    } as SpotifyApi.TrackObjectFull,
    isSingle: true,
  },
};

export const Artist = {
  args: {
    id: "6qqNVTkY8uBg9cP3Jd7DAH",
    type: CardType.ARTIST,
    images: [
      {
        url: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
        width: 150,
        height: 150,
      },
    ],
    title: "Billie Eilish",
  },
};
