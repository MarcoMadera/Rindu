export enum Page {
  Home = "home",
  Dashboard = "dashboard",
  Album = "album",
  NotFound = "notFound",
  Playlist = "playlist",
  Artist = "artist",
  Search = "search",
  Concert = "concert",
  Episode = "episode",
  Podcast = "podcast",
  Genre = "genre",
  Show = "show",
  Track = "track",
  User = "user",
  CollectionTracks = "collectionTracks",
  CollectionAlbums = "collectionAlbums",
  CollectionArtists = "collectionArtists",
  CollectionPlaylists = "collectionPlaylists",
  CollectionPodcasts = "collectionPodcasts",
  Collection = "collection",
}

export enum Language {
  EN = "EN",
  ES = "ES",
}

export const spanishCountries = [
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "SV",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PY",
  "PE",
  "PR",
  "ES",
  "UY",
  "VE",
];

const sideBarTranslations = {
  [Language.EN]: {
    home: "Home",
    search: "Search",
    collection: "Your Library",
    createPlaylist: "Create Playlist",
    likedSongs: "Liked Songs",
    yourEpisodes: "Your Episodes",
    minimizeCoverImage: "Minimize cover image",
  },
  [Language.ES]: {
    home: "Inicio",
    search: "Buscar",
    collection: "Tu Biblioteca",
    createPlaylist: "Crear Playlist",
    likedSongs: "Tus me gusta",
    yourEpisodes: "Tus episodios",
    minimizeCoverImage: "Minimizar imagen de portada",
  },
};

const pageHeaderTranslations = {
  [Language.EN]: {
    pageHeaderArtist: "ARTIST",
    pageHeaderAlbum: "ALBUM",
    pageHeaderPlaylist: "PLAYLIST",
    pageHeaderSingle: "SINGLE",
    pageHeaderCompilation: "COMPILATION",
    pageHeaderProfile: "PROFILE",
    pageHeaderConcert: "CONCERT",
    pageHeaderEpisode: "EPISODE",
    pageHeaderPodcast: "PODCAST",
    pageHeaderSong: "SONG",
    followers: "followers",
    song: "Song",
    songs: "Songs",
    minutes: "minutes",
    popularity: "popularity",
    publicPlaylist: "public playlists",
    listeners: "listeners",
    plays: "plays",
  },
  [Language.ES]: {
    pageHeaderArtist: "ARTISTA",
    pageHeaderAlbum: "ÁLBUM",
    pageHeaderPlaylist: "PLAYLIST",
    pageHeaderSingle: "SENCILLO",
    pageHeaderCompilation: "COMPILACIÓN",
    pageHeaderProfile: "PERFIL",
    pageHeaderConcert: "CONCIERTO",
    pageHeaderEpisode: "EPISODIO",
    pageHeaderPodcast: "PODCAST",
    pageHeaderSong: "CANCIÓN",
    followers: "seguidores",
    song: "Canción",
    songs: "Canciones",
    minutes: "minutos",
    popularity: "popularidad",
    publicPlaylist: "playlist públicas",
    listeners: "escuchas",
    plays: "reproducciones",
  },
};

const listHeaderTranslations = {
  [Language.EN]: {
    titleListHeader: "TITLE",
    albumListHeader: "ALBUM",
    dateAddedListHeader: "DATE ADDED",
  },
  [Language.ES]: {
    titleListHeader: "TÍTULO",
    albumListHeader: "ÁLBUM",
    dateAddedListHeader: "FECHA",
  },
};

const removeTracksModalTranslations = {
  [Language.EN]: {
    cleanPlaylist: "CLEAN PLAYLIST",
    analyzingPlaylist: "Analyzing playlist",
    noCorruptOrDuplicateSongs: "No corrupt or duplicate songs",
    oneDuplicateOneCorrupt: "There is a duplicate song and a corrupt",
    oneDuplicate: "There is a duplicate song",
    oneCorrupt: "There is a corrupt song",
    multipleCorrupt: "There are {0} corrupted songs",
    multipleDuplicate: "There are {0} duplicate songs",
    multipleCorruptAndMultipleDuplicate:
      "There are {0} corrupt songs and {1} duplicate songs",
    close: "Close",
  },
  [Language.ES]: {
    cleanPlaylist: "LIMPIAR PLAYLIST",
    analyzingPlaylist: "Analizando playlist",
    noCorruptOrDuplicateSongs: "No hay canciones corruptas ni duplicadas",
    oneDuplicateOneCorrupt: "Hay una canción duplicada y una corrupta",
    oneDuplicate: "Hay una canción duplicada",
    oneCorrupt: "Hay una canción corrupta",
    multipleCorrupt: "Hay {0} canciones corruptas",
    multipleDuplicate: "Hay {0} canciones duplicadas",
    multipleCorruptAndMultipleDuplicate:
      "Hay {0} canciones corruptas y {1} canciones duplicadas",
    close: "Cerrar",
  },
};

export interface IFeaturesTranslations {
  eyeBrowText: string;
  titleText: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  anchorType: string;
  anchorText: string;
}

const featuresTranslationsEN: IFeaturesTranslations[] = [
  {
    eyeBrowText: "EASY TO USE TOOLS",
    titleText: "The best to fix your playlists",
    description:
      "Adding songs by any method may fail, leaving a save space with no data. This is a corrupt song.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938505/Spotify-Cleaner-App/Mu2_viopob.jpg",
    imageAlt: "A woman wearing headphones",
    anchorType: "login",
    anchorText: "Find out how",
  },
  {
    eyeBrowText: "WITHOUT COMPLICATIONS",
    titleText: "Remove invisible songs",
    description:
      "If the total number of songs in a playlist does not match the last number in the playlist, your playlist is corrupted.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938507/Spotify-Cleaner-App/Mu3_xbb08n.jpg",
    imageAlt: "A man jumping in the air",
    anchorType: "login",
    anchorText: "Find out how",
  },
  {
    eyeBrowText: "ELIMINATE DISTRACTIONS",
    titleText: "No more duplicates in your playlists",
    description:
      "Listen without repeating songs, Rindu removes duplicates from your playlists and favorites list.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938509/Spotify-Cleaner-App/Mu4_vigcfb.jpg",
    imageAlt: "A woman with her arms out",
    anchorType: "login",
    anchorText: "Find out how",
  },
  {
    eyeBrowText: "THE FEATURES YOU LOVE",
    titleText: "Explore and listen",
    description:
      "Rindu makes it easy for you to explore and listen to songs. Add songs to your playlists and favorites lists.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938516/Spotify-Cleaner-App/Mu5_n7u3cf.jpg",
    imageAlt: "A woman stretching the leg",
    anchorType: "login",
    anchorText: "Find out how",
  },
];
const featuresTranslationsES: IFeaturesTranslations[] = [
  {
    eyeBrowText: "HERRAMIENTAS FÁCILES DE USAR",
    titleText: "Lo mejor para arreglar tus playlists",
    description:
      "Agregar canciones por cualquier método puede fallar, por lo que queda un espacio guardado sin datos. Esto es una canción corrupta.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938505/Spotify-Cleaner-App/Mu2_viopob.jpg",
    imageAlt: "Una mujer usando audífonos",
    anchorType: "login",
    anchorText: "Descubre como",
  },
  {
    eyeBrowText: "SIN COMPLICACIONES",
    titleText: "Elimina las canciones invisibles",
    description:
      "Si el total de canciones de una playlist no concuerda con el último número de la lista, tu playlist está corrupta.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938507/Spotify-Cleaner-App/Mu3_xbb08n.jpg",
    imageAlt: "Un hombre saltando en el aire",
    anchorType: "login",
    anchorText: "Descubre como",
  },
  {
    eyeBrowText: "ELIMINA DISTRACCIONES",
    titleText: "No más duplicados en tus playlists",
    description:
      "Escucha sin repetir canciones, Rindu elimina los duplicados de tus playlists y lista de favoritos.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938509/Spotify-Cleaner-App/Mu4_vigcfb.jpg",
    imageAlt: "Una mujer con los brazos extendidos",
    anchorType: "login",
    anchorText: "Descubre como",
  },
  {
    eyeBrowText: "LAS FUNCIONALIDADES QUE AMAS",
    titleText: "Explora y escucha",
    description:
      "Rindu te permite explorar y escuchar canciones de manera sencilla. Agrega canciones a tus playlists y listas de favoritos.",
    imageSrc:
      "https://res.cloudinary.com/marcomadera/image/upload/v1645938516/Spotify-Cleaner-App/Mu5_n7u3cf.jpg",
    imageAlt: "Una mujer estirando la pierna",
    anchorType: "login",
    anchorText: "Descubre como",
  },
];

export const translations = {
  [Language.EN]: {
    [Page.Home]: {
      heroTitle: "Everything you need to enjoy music",
      heroInfoTitle: "Ideal for any type of situation.",
      heroInfoDescription:
        "Whether you have a bot that adds tracks and has been adding repeated tracks, Rindu removes those extra tracks and leaves just one.",
      features: JSON.stringify(featuresTranslationsEN),
      concludeSectionTitle: "What are you waiting for to discover Rindu?",
      concludeSectionDescription:
        "Enjoy music at your own pace, you set the rules and Rindu makes it happen for you.",
      concludeSectionCta: "Start now",
      loginButton: "LOGIN WITH SPOTIFY",
      madeBy: "Made by",
    },
    [Page.Dashboard]: {
      ...sideBarTranslations[Language.EN],
      title: "Dashboard",
      topTracksHeading: "You love these songs",
      featuredPlaylistsHeading: "Enjoy these playlists",
      by: "By",
      recentlyListenedHeading: "Recently played",
      newReleasesHeading: "New releases for you",
      tracksRecommendationsHeading: "More of what you like",
      artistOfTheWeekHeading: "Top Hit Makers",
      tracksOfTheWeekHeading: "Weekly Chart Toppers",
      thisPlaylistsHeading: "This is:",
      recentListeningRecommendationsHeading: "Based on what you like",
      topArtistsHeading: "Enjoy your favorite artists",
      categories: "Categories",
    },
    [Page.Album]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      ...listHeaderTranslations[Language.EN],
      title: "Album",
    },
    [Page.NotFound]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      title: "NotFound",
    },
    [Page.Playlist]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      ...listHeaderTranslations[Language.EN],
      ...removeTracksModalTranslations[Language.EN],
      title: "Playlist",
      playlistAddedToLibrary: "Playlist added to your library",
      playlistRemovedFromLibrary: "Playlist removed from your library",
      playlistSearchHeading: "Let's find something for your playlist",
      searchPlaceholder: "Search for songs or episodes",
    },
    [Page.Artist]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      title: "Artist",
      showLess: "SHOW LESS",
      showMore: "SHOW MORE",
      readLess: "Read less",
      readMore: "Read more",
      popular: "Popular",
      following: "Following",
      follow: "Follow",
      concerts: "Concerts",
      singleAlbumsCarouselTitle: "Singles & EPs",
      appearAlbumsCarouselTitle: "Appears on",
      albumsCarouselTitle: "Albums",
      compilationsCarouselTitle: "Compilations",
      relatedArtistsCarouselTitle: "You may also like",
      artist: "Artist",
      about: "About",
      concertSetlistOn: "Concert setlists on",
      strBiography: "strBiographyEN",
    },
    [Page.Search]: {
      ...sideBarTranslations[Language.EN],
      title: "Search",
      search: "Search",
      searchPlaceholder: "Artists, songs, or podcasts",
      browseAll: "Browse All",
      songs: "Songs",
      playlists: "Playlists",
      artists: "Artists",
      artist: "Artist",
      albums: "Albums",
      album: "Album",
      shows: "Shows",
      episodes: "Episodes",
      by: "By",
    },
    [Page.Concert]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      ...listHeaderTranslations[Language.EN],
      ...removeTracksModalTranslations[Language.EN],
      title: "Concert",
      searchPlaceholder: "Search for songs or episodes",
      noTracksFoundForConcert: "No tracks found for this concert",
      saveConcertToPlaylist: "Save concert to playlist",
    },
    [Page.Episode]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      title: "Episode",
      about: "About",
      allEpisodes: "All Episodes",
    },
    [Page.Podcast]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      title: "Podcast",
    },
    [Page.Genre]: { ...sideBarTranslations[Language.EN], title: "Genre" },
    [Page.Show]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      title: "Show",
    },
    [Page.Track]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      ...listHeaderTranslations[Language.EN],
      title: "Track",
      playlistAddedToLibrary: "Playlist added to your library",
      playlistRemovedFromLibrary: "Playlist removed from your library",
      playlistSearchHeading: "Let's find something for your playlist",
      artist: "ARTIST",
      lyrics: "Lyrics",
      songs: "Songs",
      popularTracksBy: "Popular tracks by {0}",
      showMore: "SHOW MORE",
      showLess: "SHOW LESS",
    },
    [Page.User]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      title: "User",
      followers: "followers",
    },
    [Page.CollectionTracks]: {
      ...sideBarTranslations[Language.EN],
      ...pageHeaderTranslations[Language.EN],
      ...listHeaderTranslations[Language.EN],
      ...removeTracksModalTranslations[Language.EN],
      title: "Track",
      playlistAddedToLibrary: "Playlist added to your library",
      playlistRemovedFromLibrary: "Playlist removed from your library",
      playlistSearchHeading: "Let's find something for your playlist",
      searchPlaceholder: "Search for songs or episodes",
    },
    [Page.CollectionAlbums]: {
      ...sideBarTranslations[Language.EN],
      title: "Collection Albums",
      album: "Album",
      albums: "Albums",
    },
    [Page.CollectionArtists]: {
      ...sideBarTranslations[Language.EN],
      title: "Collection Artists",
      artist: "Artist",
      artists: "Artists",
    },
    [Page.CollectionPlaylists]: {
      ...sideBarTranslations[Language.EN],
      title: "Collection Playlists",
      by: "By",
    },
    [Page.CollectionPodcasts]: {
      ...sideBarTranslations[Language.EN],
      title: "Collection Podcasts",
    },
    [Page.Collection]: {
      ...sideBarTranslations[Language.EN],
      title: "Collection",
    },
  },
  [Language.ES]: {
    [Page.Home]: {
      heroTitle: "Todo lo que necesitas para disfrutar de la música",
      heroInfoTitle: "Ideal para cualquier tipo de situación.",
      heroInfoDescription:
        "Ya sea si tienes un bot que añade tracks y te ha estado añadiendo repetidos, Rindu elimina esos tracks que están de más y deja solo uno.",
      features: JSON.stringify(featuresTranslationsES),
      concludeSectionTitle: "¿Qué esperas para descubrir Rindu?",
      concludeSectionDescription:
        "Disfruta de la música a tu ritmo, tu pones las reglas y Rindu te lo hace realidad.",
      concludeSectionCta: "Empieza ahora",
      loginButton: "ENTRA CON SPOTIFY",
      madeBy: "Hecho por",
    },
    [Page.Dashboard]: {
      ...sideBarTranslations[Language.ES],
      title: "Dashboard",
      topTracksHeading: "Las canciones que más te gustan",
      featuredPlaylistsHeading: "Disfruta de estás playlists",
      by: "De",
      recentlyListenedHeading: "Recién escuchado",
      newReleasesHeading: "Nuevos lanzamientos para ti",
      artistOfTheWeekHeading: "Los artistas más exitosos",
      tracksOfTheWeekHeading: "Las canciones más populares de la semana",
      thisPlaylistsHeading: "Esto es:",
      tracksRecommendationsHeading: "Más de lo que te gusta",
      recentListeningRecommendationsHeading: "Basado en lo que escuchaste",
      topArtistsHeading: "Disfruta de tus artistas favoritos",
      categories: "Categorias",
    },
    [Page.Album]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      ...listHeaderTranslations[Language.ES],
      title: "Álbum",
    },
    [Page.NotFound]: {
      ...sideBarTranslations[Language.ES],
      title: "NotFound",
    },
    [Page.Playlist]: {
      title: "Playlist",
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      ...listHeaderTranslations[Language.ES],
      ...removeTracksModalTranslations[Language.ES],
      playlistAddedToLibrary: "Playlist añadida a tu biblioteca",
      playlistRemovedFromLibrary: "Playlist removida de tu biblioteca",
      playlistSearchHeading: "Busquemos algo para tu playlist",
      searchPlaceholder: "Busca canciones o episodios",
    },
    [Page.Artist]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      title: "Artist",
      showLess: "MOSTRAR MENOS",
      showMore: "MOSTRAR MÁS",
      readLess: "Leer menos",
      readMore: "Leer más",
      popular: "Popular",
      following: "Siguiendo",
      follow: "Seguir",
      concerts: "Conciertos",
      singleAlbumsCarouselTitle: "Sencillos y EPs",
      appearAlbumsCarouselTitle: "Aparece en",
      albumsCarouselTitle: "Álbumes",
      compilationsCarouselTitle: "Compilaciones",
      relatedArtistsCarouselTitle: "Te pueden gustar",
      artist: "Artista",
      about: "Sobre",
      concertSetlistOn: "Lista de conciertos en",
      strBiography: "strBiographyES",
    },
    [Page.Search]: {
      ...sideBarTranslations[Language.ES],
      title: "Search",
      search: "Búsqueda",
      searchPlaceholder: "Artistas, canciones, o podcasts",
      browseAll: "Explora todo",
      songs: "Canciones",
      playlists: "Playlists",
      artists: "Artistas",
      artist: "Artista",
      albums: "Álbumes",
      album: "Álbum",
      shows: "Shows",
      episodes: "Episodios",
      by: "De",
    },
    [Page.Concert]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      ...listHeaderTranslations[Language.ES],
      ...removeTracksModalTranslations[Language.ES],
      title: "Concert",
      searchPlaceholder: "Busca canciones o episodios",
      noTracksFoundForConcert:
        "No se encontraron canciones para este concierto",
      saveConcertToPlaylist: "Guardar concierto en playlist",
    },
    [Page.Episode]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      title: "Episode",
      about: "Sobre",
      allEpisodes: "Todos los episodios",
    },
    [Page.Podcast]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      title: "Podcast",
    },
    [Page.Genre]: { ...sideBarTranslations[Language.ES], title: "Genre" },
    [Page.Show]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      title: "Show",
    },
    [Page.Track]: {
      title: "Track",
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      ...listHeaderTranslations[Language.ES],
      playlistAddedToLibrary: "Playlist añadida a tu biblioteca",
      playlistRemovedFromLibrary: "Playlist removida de tu biblioteca",
      playlistSearchHeading: "Busquemos algo para tu playlist",
      artist: "ARTISTA",
      lyrics: "Letra",
      songs: "Canciones",
      popularTracksBy: "Canciones populares de {0}",
      showMore: "MOSTRAR MÁS",
      showLess: "MOSTRAR MENOS",
    },
    [Page.User]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      title: "User",
      followers: "seguidores",
    },
    [Page.CollectionTracks]: {
      ...sideBarTranslations[Language.ES],
      ...pageHeaderTranslations[Language.ES],
      ...listHeaderTranslations[Language.ES],
      ...removeTracksModalTranslations[Language.ES],
      title: "Tus canciones",
      playlistAddedToLibrary: "Playlist añadida a tu biblioteca",
      playlistRemovedFromLibrary: "Playlist removida de tu biblioteca",
      playlistSearchHeading: "Busquemos algo para tu playlist",
      analyzingPlaylist: "Analizando playlist",
      searchPlaceholder: "Busca canciones o episodios",
    },
    [Page.CollectionAlbums]: {
      ...sideBarTranslations[Language.ES],
      title: "Tus álbumes",
      album: "Álbum",
      albums: "Álbumes",
    },
    [Page.CollectionArtists]: {
      ...sideBarTranslations[Language.ES],
      title: "Tus artistas",
      artist: "Artista",
      artists: "Artistas",
    },
    [Page.CollectionPlaylists]: {
      ...sideBarTranslations[Language.ES],
      title: "Tus playlists",
      by: "De",
    },
    [Page.CollectionPodcasts]: {
      ...sideBarTranslations[Language.ES],
      title: "Tus podcasts",
    },
    [Page.Collection]: {
      ...sideBarTranslations[Language.ES],
      title: "Colección",
    },
  },
};

export type Translations = typeof translations[Language];

export function getTranslations<T extends Page>(
  country: string,
  page: T
): Translations[T] {
  const language = spanishCountries.includes(country)
    ? Language.ES
    : Language.EN;

  return translations[language][page];
}
