import { Modify } from "types/customTypes";
import { ITrack } from "types/spotify";

export enum HeaderType {
  Song = "SONG",
  Playlist = "PLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Profile = "PROFILE",
  Podcast = "PODCAST",
  Single = "SINGLE",
  Compilation = "COMPILATION",
  Episode = "EPISODE",
  Concert = "CONCERT",
  Radio = "RADIO",
  Top = "TOP",
}

interface IPageHeader {
  type: HeaderType;
  title: string;
  coverImg: string;
  description?: never;
  totalTracks?: never;
  totalFollowers?: never;
  artists?: never;
  release_date?: never;
  duration_s?: never;
  popularity?: never;
  totalPublicPlaylists?: never;
  data?: never;
  banner?: never;
  disableOpacityChange?: never;
  ownerId?: never;
  ownerDisplayName?: never;
  stats?: never;
}

interface IAlbumLike {
  type: HeaderType.Album | HeaderType.Single | HeaderType.Compilation;
  artists: SpotifyApi.ArtistObjectSimplified[];
  release_date: string;
  totalTracks: number;
  data: SpotifyApi.AlbumObjectFull | null;
}
type AlbumLike = Modify<IPageHeader, IAlbumLike>;

interface IProfile {
  type: HeaderType.Profile;
  totalPublicPlaylists: number;
  totalFollowers: number;
  data: SpotifyApi.UserObjectPublic | null;
}
type Profile = Modify<IPageHeader, IProfile>;

interface IArtist {
  type: HeaderType.Artist;
  popularity: number;
  totalFollowers: number;
  banner?: string;
  disableOpacityChange?: boolean;
  stats?: {
    listeners: string;
    playcount: string;
  };
  data: SpotifyApi.ArtistObjectFull | null;
}
type Artist = Modify<IPageHeader, IArtist>;

interface ISong {
  type: HeaderType.Song;
  artists: SpotifyApi.ArtistObjectSimplified[];
  release_date: string;
  duration_s: number;
  data: ITrack | null;
}
type Song = Modify<IPageHeader, ISong>;

interface IPlaylist {
  type: HeaderType.Playlist;
  ownerId: string;
  description: string;
  ownerDisplayName: string;
  totalFollowers: number;
  totalTracks: number;
  data: SpotifyApi.PlaylistObjectFull | null;
}
type Playlist = Modify<IPageHeader, IPlaylist>;

interface IConcert {
  type: HeaderType.Concert;
  ownerId: string;
  description: string;
  ownerDisplayName: string;
  totalFollowers: number;
  totalTracks: number;
}
interface ITop {
  type: HeaderType.Top;
  ownerId: string;
  description: string;
  ownerDisplayName: string;
  totalFollowers: number;
  totalTracks: number;
}

type Concert = Modify<IPageHeader, IConcert>;
interface IRadio {
  type:
    | HeaderType.Playlist
    | HeaderType.Podcast
    | HeaderType.Episode
    | HeaderType.Concert
    | HeaderType.Radio
    | HeaderType.Top;
  ownerId: string;
  description?: string;
  ownerDisplayName: string;
  totalFollowers?: number;
  totalTracks?: number;
  data?: SpotifyApi.PlaylistObjectFull | null;
}

type Radio = Modify<IPageHeader, IRadio>;
type Top = Modify<IPageHeader, ITop>;

interface IShowLike {
  type: HeaderType.Episode | HeaderType.Podcast;
  ownerId: string;
  ownerDisplayName: string;
  description: string;
  data?: SpotifyApi.ShowObject | null;
  totalTracks?: number;
  totalFollowers?: number;
}
type Show = Modify<IPageHeader, IShowLike>;

export type HeaderProps =
  | AlbumLike
  | Profile
  | Artist
  | Song
  | Playlist
  | Show
  | Concert
  | Radio
  | Top;
