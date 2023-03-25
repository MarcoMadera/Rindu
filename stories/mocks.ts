import { ITrack } from "types/spotify";

export const artist = {
  img: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
  title: "Artist",
  subTitle: "Billie Eilish",
  href: "/artist/1",
};

export const playlists = [
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
];

export const track: ITrack = {
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
};
