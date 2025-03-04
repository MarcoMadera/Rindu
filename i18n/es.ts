import { Permission } from "types/permissions";
import { ITranslations } from "types/translations";

export const es: ITranslations = {
  toastMessages: {
    addedTo: "Añadido a {0}",
    removedFrom: "Eliminado de {0}",
    typeAddedTo: "{0} añadido a tu {1}",
    typeRemovedFrom: "{0} eliminado de tu {1}",
    couldNotAddTo: "No se pudo añadir a {0}",
    couldNotRemoveFrom: "No se pudo eliminar de {0}",
    unableToPlayReconnecting:
      "No se puede reproducir, intentando reconectar, por favor espera...",
    errorPlayingThis: "Error al reproducir esta canción",
    isCorruptedAndCannotBePlayed:
      "El {0} está corrupta y no se puede reproducir",
    contentIsUnavailable: "El contenido no está disponible",
    deviceConnectedTo: "Dispositivo conectado a {deviceName}",
    premiumRequired: "Necesitas una cuenta premium para usar esta función",
    typeUpdated: "{0} actualizados",
    errorCreating: "Error al crear {0}",
    errorUpdating: "Error al actualizar {0}",
    unabledToRemove: "No se pudo eliminar {0}",
    fileIsNotAnImage: "El archivo no es una imagen",
    copiedToClipboard: "Copiado al portapapeles",
    failedToCopyToClipboard: "No se pudo copiar al portapapeles",
    noLyricsToDisplay: "No hay letras para mostrar",
    noDeviceConnected: "Dispositivo no conectado",
    nothingPlaying: "No se está reproduciendo nada",
    welcomePreparing: "Bienvenido a Rindu, preparando tu música para ti",
    welcomeReady: "Bienvenido a Rindu, prepárate para disfrutar!",
    playerReady: "Ahora estás conectado a Spotify, ¡disfruta!",
    playerNotReady: "No estás conectado a Spotify",
    playerAuthenticationError: "Hubo un error al autenticarse con Spotify",
    playerAutoPlayFailed: "Hubo un error al reproducir tu música",
    playerInitializationError: "Hubo un error al inicializar el reproductor",
    playerPlaybackError: "Hubo un error al reproducir tu música",
    playerAccountError: "Hubo un error con tu cuenta de Spotify",
    failToPasteFromClipboard: "No se pudo pegar desde el portapapeles",
  },
  shortCuts: {
    shortCutsTitle: "Atajos del teclado",
    shortCutdescription:
      "Presiona {0} o {1} para activar/desactivar este modal.",
    basic: "Básicos",
    createNewPlaylist: "Crear nueva playlist",
    createNewFolder: "Crear nueva carpeta",
    openContextMenu: "Abrir el menú contextual",
    openQuickSearch: "Abrir búsqueda rápida",
    logOut: "Cerrar sesión",
    playback: "Reproducción",
    playPause: "Reproducir/Pausar",
    like: "Me gusta",
    shuffle: "Aleatorio",
    repeat: "Repetir",
    skipToPrevious: "Volver a la anterior",
    skipToNext: "Saltar a la siguiente",
    seekBackward: "Buscar hacia atrás",
    seekForward: "Buscar hacia delante",
    raiseVolume: "Subir el volumen",
    lowerVolume: "Bajar el volumen",
    navigation: "Navegación",
    home: "Inicio",
    backInHistory: "Volver atrás en el historial",
    forwardInHistory: "Ir hacia adelante en el historial",
    currentlyPlaying: "Reproduciendo actualmente",
    search: "Buscar",
    likedSongs: "Tus me gusta",
    queue: "Cola de reproducción",
    yourPlaylists: "Tus playlists",
    yourPodcasts: "Tus podcasts",
    yourArtists: "Tus artistas",
    yourAlbums: "Tus álbumes",
    madeForYou: "Creado para ti",
    newReleases: "Nuevos Lanzamientos",
    charts: "Listas",
    layout: "Diseño",
    decreaseNavigationWidth: "Disminuir el ancho de la barra de navegación",
    increaseNavigationWidth: "Aumentar el ancho de la barra de navegación",
    decreaseActivityTabWidth: "Disminuir el ancho de la pestaña de actividad",
    increaseActivityTabWidth: "Aumentar el ancho de la pestaña de actividad",
  },
  contentType: {
    album: "álbum",
    artist: "artista",
    playlist: "playlist",
    podcast: "podcast",
    track: "track",
    items: "elementos",
    episode: "episodio",
    show: "show",
    library: "biblioteca",
    queue: "la cola de reproducción",
    image: "imagen",
    details: "detalles",
  },
  sideBar: {
    collection: "Tu Biblioteca",
    createPlaylist: "Crear Playlist",
    yourEpisodes: "Tus episodios",
    minimizeCoverImage: "Minimizar imagen de portada",
    download: "Descargar",
    help: "Ayuda",
    profile: "Perfil",
    account: "Cuenta",
    preferences: "Preferencias",
    upgradeToPremium: "Actualizar a Premium",
  },
  queue: {
    previousTracks: "Canciones anteriores",
    currentlyPlaying: "Reproduciendo",
    nextUp: "Siguiente",
  },
  pageHeader: {
    Artist: "ARTISTA",
    Album: "ÁLBUM",
    Playlist: "PLAYLIST",
    Single: "SENCILLO",
    Compilation: "COMPILACIÓN",
    Profile: "PERFIL",
    Concert: "CONCIERTO",
    Episode: "EPISODIO",
    Podcast: "PODCAST",
    Radio: "RADIO",
    Top: "TOP",
    Song: "CANCIÓN",
    followers: "seguidores",
    song: "Canción",
    songs: "Canciones",
    minutes: "minutos",
    popularity: "popularidad",
    publicPlaylist: "playlist públicas",
    listeners: "escuchas",
    plays: "reproducciones",
  },
  playlistHeader: {
    title: "TÍTULO",
    album: "ÁLBUM",
    dateAdded: "FECHA",
    disc: "Disco {number}",
  },
  removeTracksModal: {
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
  homeFeatures: [
    {
      eyeBrowText: "HERRAMIENTAS FÁCILES DE USAR",
      titleText: "Lo mejor para arreglar tus playlists",
      description:
        "Agregar canciones por cualquier método puede fallar, por lo que queda un espacio guardado sin datos. Esto es una canción corrupta.",
      imageSrc:
        "https://res.cloudinary.com/marcomadera/image/upload/v1645938505/Spotify-Cleaner-App/Mu2_viopob.jpg",
      imageAlt: "Una mujer usando audífonos",
      anchorType: "login",
      ctaText: "Descubre como",
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
      ctaText: "Descubre como",
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
      ctaText: "Descubre como",
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
      ctaText: "Descubre como",
    },
  ],
  pages: {
    home: {
      heroTitle: "Todo lo que necesitas para disfrutar de la música",
      heroInfoTitle: "Ideal para cualquier tipo de situación.",
      heroInfoDescription:
        "Ya sea si tienes un bot que añade tracks y te ha estado añadiendo repetidos, Rindu elimina esos tracks que están de más y deja solo uno.",
      concludeSectionTitle: "¿Qué esperas para descubrir Rindu?",
      concludeSectionDescription:
        "Disfruta de la música a tu ritmo, tu pones las reglas y Rindu te lo hace realidad.",
      concludeSectionCta: "Empieza ahora",
      loginButton: "ENTRA CON SPOTIFY",
      loginButtonError: "Hubo un error al iniciar sesión",
      madeBy: "Hecho por",
    },
    dashboard: {
      title: "Dashboard",
      topTracksHeading: "Las canciones que más te gustan",
      featuredPlaylistsHeading: "Disfruta de estás playlists",
      by: "De",
      recentlyListenedHeading: "Recién escuchado",
      newReleasesHeading: "Nuevos lanzamientos para ti",
      artistOfTheWeekHeading: "Los artistas más exitosos",
      tracksOfTheWeekHeading: "Las canciones más populares de la semana",
      topTracksPlaylistHeading: "Tu top de canciones",
      topTracksPlaylistLongTermTitle: "Largo plazo",
      topTracksPlaylistMediumTermTitle: "Mediano plazo",
      topTracksPlaylistShortTermTitle: "Corto plazo",
      thisPlaylistsHeading: "Esto es:",
      tracksRecommendationsHeading: "Más de lo que te gusta",
      recentListeningRecommendationsHeading: "Basado en lo que escuchaste",
      topArtistsHeading: "Disfruta de tus artistas favoritos",
      categories: "Categorias",
    },
    album: {
      title: "Álbum",
    },
    playlist: {
      title: "Playlist",
      playlistSearchHeading: "Busquemos algo para tu playlist",
      searchPlaceholder: "Busca canciones o episodios",
    },
    artist: {
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
      by: "De",
    },
    search: {
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
    concert: {
      title: "Concert",
      searchPlaceholder: "Busca canciones o episodios",
      noTracksFound: "No se encontraron canciones para este concierto",
      saveAsPlaylist: "Guardar concierto en playlist",
    },
    radio: {
      title: "Radio",
      searchPlaceholder: "Busca canciones o episodios",
      noTracksFound: "No se encontraron canciones para esta radio",
      saveAsPlaylist: "Guardar radio en playlist",
    },
    topTracks: {
      title: "Tracks",
      searchPlaceholder: "Busca canciones o episodios",
      noTracksFound: "No se encontraron canciones",
      saveAsPlaylist: "Guardar tracks en playlist",
      shortTerm: "Corto plazo",
      mediumTerm: "Mediano plazo",
      longTerm: "Largo plazo",
    },
    episode: {
      title: "Episode",
      about: "Sobre",
      allEpisodes: "Todos los episodios",
    },
    podcast: {
      title: "Podcast",
    },
    genre: {
      title: "Genre",
    },
    show: {
      title: "Show",
    },
    track: {
      title: "Track",
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
    user: {
      title: "User",
      followers: "seguidores",
      by: "De",
      topTracksPlaylistHeading: "Tu top de canciones",
      topTracksPlaylistLongTermTitle: "Largo plazo",
      topTracksPlaylistMediumTermTitle: "Mediano plazo",
      topTracksPlaylistShortTermTitle: "Corto plazo",
      yourPlaylists: "Tus playlists",
      playlists: "Playlists",
    },
    collectionTracks: {
      title: "Tus canciones",
      playlistSearchHeading: "Busquemos algo para tu playlist",
      searchPlaceholder: "Busca canciones o episodios",
    },
    collectionAlbums: {
      title: "Tus álbumes",
      album: "Álbum",
      albums: "Álbumes",
    },
    collectionArtists: {
      title: "Tus artistas",
      artist: "Artista",
      artists: "Artistas",
    },
    collectionPlaylists: {
      title: "Tus playlists",
      by: "De",
      likedSongsCardTitle: "Tus me gusta",
      likedSongsCardDescriptionPlural: "{0} canciones gustadas",
      likedSongsCardDescriptionSingular: "{0} canción gustada",
    },
    collectionPodcasts: {
      title: "Tus podcasts",
    },
    collection: {
      title: "Colección",
    },
    preferences: {
      preferences: "Preferencias",
      language: "Idioma",
      languageLabel:
        "Elige un idioma (los cambios se aplicarán cuando se reinicie la aplicación)",
      useDocumentPiP: "Ventana Flotante Mejorada (Beta)",
      disableDocumentPiPToggleReason:
        "Esta funcionalidad no está aún soportada por este navegador",
      useDocumentPiPHint:
        "Usa un sistema mejorado de ventana flotante para letras.",
      spanish: "Español",
      english: "Inglés",
      reload: "Volver a cargar",
      localLabel: { es: "Español", en: "Inglés" },
    },
  },
  common: {
    guest: "Invitado",
  },
  terminal: {
    title: "Terminal",
    welcome: "Bienvenido a la terminal",
    commandMessages: {
      help: `Comandos disponibles:
  
      1. help - Muestra este mensaje de ayuda
      2. clear - Borra el historial de comandos`,
      unrecognizedCommand:
        "Comando no reconocido. Escribe 'help' para ver la lista de comandos disponibles.",
    },
  },
  permissions: {
    [Permission.ConnectDevices]: {
      restrictedReason:
        "La función de conexión a dispositivos requiere una suscripción Premium",
    },
    [Permission.PictureInPictureLyrics]: {
      restrictedReason:
        "Las letras en modo Picture-in-Picture requieren una suscripción Premium",
    },
    [Permission.PlayAsNextInQueue]: {
      restrictedReason:
        "No puedes añadir canciones para reproducir a continuación",
    },
    [Permission.RemovingFromContextTracks]: {
      restrictedReason:
        "No puedes eliminar canciones de esta lista en este momento",
    },
    [Permission.RemovingFromNextTracks]: {
      restrictedReason:
        "No puedes eliminar las próximas canciones en este momento",
    },
    [Permission.Resuming]: {
      restrictedReason: "No puedes reanudar la música en este momento",
    },
    [Permission.Pausing]: {
      restrictedReason: "No puedes pausar la música en este momento",
    },
    [Permission.Seeking]: {
      restrictedReason: "No puedes saltar a diferentes partes de esta canción",
    },
    [Permission.PeekingPrev]: {
      restrictedReason: "No puedes previsualizar las canciones anteriores",
    },
    [Permission.PeekingNext]: {
      restrictedReason: "No puedes previsualizar las próximas canciones",
    },
    [Permission.SettingPlaybackSpeed]: {
      restrictedReason:
        "El control de velocidad no está disponible para este contenido",
    },
    [Permission.SkippingPrev]: {
      restrictedReason: "No puedes volver a las canciones anteriores",
    },
    [Permission.SkippingNext]: {
      restrictedReason: "No puedes saltar a la siguiente canción",
    },
    [Permission.UpdatingContext]: {
      restrictedReason: "No puedes modificar lo que está sonando ahora",
    },
    [Permission.TogglingRepeatContext]: {
      restrictedReason:
        "No puedes activar la repetición de lista en este momento",
    },
    [Permission.TogglingRepeatTrack]: {
      restrictedReason:
        "No puedes activar la repetición de canción en este momento",
    },
    [Permission.TogglingSuffle]: {
      restrictedReason:
        "No puedes activar la reproducción aleatoria en este momento",
    },
  },
  "404": {
    title: "😫 404 - No encontrado",
    description: "Oops! Parece que no hemos atinado a la nota correcta.",
    description2: "¿Cómo has llegado aquí?",
    button: "Volver al inicio",
  },
  "500": {
    title: "😱 500 - Error del servidor",
    description: "¡Ay no! Parece que algo salió mal en nuestro servidor.",
    description2: "Por favor, intenta nuevamente más tarde.",
    button: "Volver al inicio",
  },
};

export default es;
