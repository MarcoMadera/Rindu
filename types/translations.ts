export interface ITranslations {
  toastMessages: ToastMessages;
  shortCuts: ShortCuts;
  contentType: ContentType;
  sideBar: SideBar;
  queue: Queue;
  pageHeader: PageHeader;
  playlistHeader: PlaylistHeader;
  removeTracksModal: RemoveTracksModal;
  homeFeatures: HomeFeature[];
  pages: Pages;
  common: Common;
  terminal: Terminal;
}

export interface Common {
  guest: string;
}

export interface Terminal {
  title: string;
  welcome: string;
  commandMessages: CommandMessages;
}

export interface CommandMessages {
  help: string;
  unrecognizedCommand: string;
}

export interface ContentType {
  album: string;
  artist: string;
  playlist: string;
  podcast: string;
  track: string;
  items: string;
  episode: string;
  show: string;
  library: string;
  queue: string;
  image: string;
  details: string;
}

export interface HomeFeature {
  eyeBrowText: string;
  titleText: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  anchorType: string;
  ctaText: string;
}

export interface PageHeader {
  Artist: string;
  Album: string;
  Playlist: string;
  Single: string;
  Compilation: string;
  Profile: string;
  Concert: string;
  Episode: string;
  Podcast: string;
  Radio: string;
  Top: string;
  Song: string;
  followers: string;
  song: string;
  songs: string;
  minutes: string;
  popularity: string;
  publicPlaylist: string;
  listeners: string;
  plays: string;
}

export interface Pages {
  home: Home;
  dashboard: Dashboard;
  album: Album;
  playlist: CollectionTracks;
  artist: Artist;
  search: Search;
  concert: Concert;
  radio: Concert;
  topTracks: TopTracks;
  episode: Episode;
  podcast: Album;
  genre: Album;
  show: Album;
  track: Track;
  user: User;
  collectionTracks: CollectionTracks;
  collectionAlbums: CollectionAlbums;
  collectionArtists: CollectionArtists;
  collectionPlaylists: CollectionPlaylists;
  collectionPodcasts: Album;
  collection: Album;
  preferences: Preferences;
}

export interface Album {
  title: string;
}

export interface Artist {
  title: string;
  showLess: string;
  showMore: string;
  readLess: string;
  readMore: string;
  popular: string;
  following: string;
  follow: string;
  concerts: string;
  singleAlbumsCarouselTitle: string;
  appearAlbumsCarouselTitle: string;
  albumsCarouselTitle: string;
  compilationsCarouselTitle: string;
  relatedArtistsCarouselTitle: string;
  artist: string;
  about: string;
  concertSetlistOn: string;
  strBiography: string;
  by: string;
}

export interface CollectionAlbums {
  title: string;
  album: string;
  albums: string;
}

export interface CollectionArtists {
  title: string;
  artist: string;
  artists: string;
}

export interface CollectionPlaylists {
  title: string;
  by: string;
  likedSongsCardTitle: string;
  likedSongsCardDescriptionPlural: string;
  likedSongsCardDescriptionSingular: string;
}

export interface CollectionTracks {
  title: string;
  playlistSearchHeading: string;
  analyzingPlaylist?: string;
  searchPlaceholder: string;
}

export interface Concert {
  title: string;
  searchPlaceholder: string;
  noTracksFound: string;
  saveAsPlaylist: string;
}

export interface Dashboard {
  title: string;
  topTracksHeading: string;
  featuredPlaylistsHeading: string;
  by: string;
  recentlyListenedHeading: string;
  newReleasesHeading: string;
  tracksRecommendationsHeading: string;
  artistOfTheWeekHeading: string;
  tracksOfTheWeekHeading: string;
  topTracksPlaylistHeading: string;
  topTracksPlaylistLongTermTitle: string;
  topTracksPlaylistMediumTermTitle: string;
  topTracksPlaylistShortTermTitle: string;
  thisPlaylistsHeading: string;
  recentListeningRecommendationsHeading: string;
  topArtistsHeading: string;
  categories: string;
}

export interface Episode {
  title: string;
  about: string;
  allEpisodes: string;
}

export interface Home {
  heroTitle: string;
  heroInfoTitle: string;
  heroInfoDescription: string;
  concludeSectionTitle: string;
  concludeSectionDescription: string;
  concludeSectionCta: string;
  loginButton: string;
  madeBy: string;
}

export interface LocalLabel {
  en: string;
  es: string;
}

export interface Preferences {
  preferences: string;
  language: string;
  languageLabel: string;
  spanish: string;
  english: string;
  reload: string;
  localLabel: LocalLabel;
}

export interface Search {
  title: string;
  search: string;
  searchPlaceholder: string;
  browseAll: string;
  songs: string;
  playlists: string;
  artists: string;
  artist: string;
  albums: string;
  album: string;
  shows: string;
  episodes: string;
  by: string;
}

export interface TopTracks {
  title: string;
  searchPlaceholder: string;
  noTracksFound: string;
  saveAsPlaylist: string;
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
}

export interface Track {
  title: string;
  playlistAddedToLibrary: string;
  playlistRemovedFromLibrary: string;
  playlistSearchHeading: string;
  artist: string;
  lyrics: string;
  songs: string;
  popularTracksBy: string;
  showMore: string;
  showLess: string;
}

export interface User {
  title: string;
  followers: string;
  by: string;
  topTracksPlaylistHeading: string;
  topTracksPlaylistLongTermTitle: string;
  topTracksPlaylistMediumTermTitle: string;
  topTracksPlaylistShortTermTitle: string;
  yourPlaylists: string;
  playlists: string;
}

export interface PlaylistHeader {
  title: string;
  album: string;
  dateAdded: string;
}

export interface Queue {
  previousTracks: string;
  currentlyPlaying: string;
  nextUp: string;
}

export interface RemoveTracksModal {
  cleanPlaylist: string;
  analyzingPlaylist: string;
  noCorruptOrDuplicateSongs: string;
  oneDuplicateOneCorrupt: string;
  oneDuplicate: string;
  oneCorrupt: string;
  multipleCorrupt: string;
  multipleDuplicate: string;
  multipleCorruptAndMultipleDuplicate: string;
  close: string;
}

export interface ShortCuts {
  shortCutsTitle: string;
  shortCutdescription: string;
  basic: string;
  createNewPlaylist: string;
  createNewFolder: string;
  openContextMenu: string;
  openQuickSearch: string;
  logOut: string;
  playback: string;
  playPause: string;
  like: string;
  shuffle: string;
  repeat: string;
  skipToPrevious: string;
  skipToNext: string;
  seekBackward: string;
  seekForward: string;
  raiseVolume: string;
  lowerVolume: string;
  navigation: string;
  home: string;
  backInHistory: string;
  forwardInHistory: string;
  currentlyPlaying: string;
  search: string;
  likedSongs: string;
  queue: string;
  yourPlaylists: string;
  yourPodcasts: string;
  yourArtists: string;
  yourAlbums: string;
  madeForYou: string;
  newReleases: string;
  charts: string;
  layout: string;
  decreaseNavigationWidth: string;
  increaseNavigationWidth: string;
  decreaseActivityTabWidth: string;
  increaseActivityTabWidth: string;
}

export interface SideBar {
  collection: string;
  createPlaylist: string;
  yourEpisodes: string;
  minimizeCoverImage: string;
  download: string;
  help: string;
  profile: string;
  account: string;
  preferences: string;
  upgradeToPremium: string;
}

export interface ToastMessages {
  addedTo: string;
  removedFrom: string;
  typeAddedTo: string;
  typeRemovedFrom: string;
  couldNotAddTo: string;
  couldNotRemoveFrom: string;
  unableToPlayReconnecting: string;
  errorPlayingThis: string;
  isCorruptedAndCannotBePlayed: string;
  contentIsUnavailable: string;
  deviceConnectedTo: string;
  premiumRequired: string;
  typeUpdated: string;
  errorCreating: string;
  errorUpdating: string;
  unabledToRemove: string;
  fileIsNotAnImage: string;
  copiedToClipboard: string;
  failedToCopyToClipboard: string;
  noLyricsToDisplay: string;
  noDeviceConnected: string;
  nothingPlaying: string;
  welcomePreparing: string;
  welcomeReady: string;
  playerReady: string;
  playerNotReady: string;
  playerAuthenticationError: string;
  playerAutoPlayFailed: string;
  playerInitializationError: string;
  playerPlaybackError: string;
  playerAccountError: string;
  failToPasteFromClipboard: string;
}
