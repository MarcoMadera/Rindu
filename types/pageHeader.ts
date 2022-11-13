import { Modify } from "./customTypes";
import { ITrack } from "./spotify";

export enum HeaderType {
  song = "SONG",
  playlist = "PLAYLIST",
  album = "ALBUM",
  artist = "ARTIST",
  profile = "PROFILE",
  podcast = "PODCAST",
  single = "SINGLE",
  compilation = "COMPILATION",
  episode = "EPISODE",
  concert = "CONCERT",
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
  type: HeaderType.album | HeaderType.single | HeaderType.compilation;
  artists: SpotifyApi.ArtistObjectSimplified[];
  release_date: string;
  totalTracks: number;
}
type AlbumLike = Modify<IPageHeader, IAlbumLike>;

interface IProfile {
  type: HeaderType.profile;
  totalPublicPlaylists: number;
  totalFollowers: number;
}
type Profile = Modify<IPageHeader, IProfile>;

interface IArtist {
  type: HeaderType.artist;
  popularity: number;
  totalFollowers: number;
  banner?: string;
  disableOpacityChange?: boolean;
  stats?: {
    listeners: string;
    playcount: string;
  };
}
type Artist = Modify<IPageHeader, IArtist>;

interface ISong {
  type: HeaderType.song;
  artists: SpotifyApi.ArtistObjectSimplified[];
  release_date: string;
  duration_s: number;
  data: ITrack | null;
}
type Song = Modify<IPageHeader, ISong>;

interface IPlaylist {
  type: HeaderType.playlist;
  ownerId: string;
  description: string;
  ownerDisplayName: string;
  totalFollowers: number;
  totalTracks: number;
}
type Playlist = Modify<IPageHeader, IPlaylist>;

interface IConcert {
  type: HeaderType.concert;
  ownerId: string;
  description: string;
  ownerDisplayName: string;
  totalFollowers: number;
  totalTracks: number;
}

type Concert = Modify<IPageHeader, IConcert>;

interface IShowLike {
  type: HeaderType.episode | HeaderType.podcast;
  ownerId: string;
  ownerDisplayName: string;
}
type Show = Modify<IPageHeader, IShowLike>;

export type HeaderProps =
  | AlbumLike
  | Profile
  | Artist
  | Song
  | Playlist
  | Show
  | Concert;
