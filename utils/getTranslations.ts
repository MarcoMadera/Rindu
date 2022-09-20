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
}

enum Language {
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

export function getTranslations(
  country: string,
  page: Page
): Record<string, string> {
  const translations: Record<Language, Record<Page, Record<string, string>>> = {
    [Language.EN]: {
      [Page.Home]: {
        heroTitle: "Everything you need to enjoy music",
        heroInfoTitle: "Ideal for any type of situation.",
        heroInfoDescription:
          "Whether you have a bot that adds tracks and has been adding repeated tracks, Rindu removes those extra tracks and leaves just one.",
        section1Eyebrow: "EASY TO USE TOOLS",
        section1Title: "The best to fix your playlists",
        section1Description:
          "Adding songs by any method may fail, leaving a save space with no data. This is a corrupt song.",
        cta: "Find out how",
        section2Eyebrow: "WITHOUT COMPLICATIONS",
        section2Title: "Remove invisible songs",
        section2Description:
          "If the total number of songs in a playlist does not match the last number in the playlist, your playlist is corrupted.",
        section3Eyebrow: "ELIMINATE DISTRACTIONS",
        section3Title: "No more duplicates in your playlists",
        section3Description:
          "Listen without repeating songs, Rindu removes duplicates from your playlists and favorites list.",
        section4Eyebrow: "THE FEATURES YOU LOVE",
        section4Title: "Explore and listen",
        section4Description:
          "Rindu makes it easy for you to explore and listen to songs. Add songs to your playlists and favorites lists.",
        concludeSectionTitle: "What are you waiting for to discover Rindu?",
        concludeSectionDescription:
          "Enjoy music at your own pace, you set the rules and Rindu makes it happen for you.",
        concludeSectionCta: "Start now",
        loginButton: "LOGIN WITH",
      },
      [Page.Dashboard]: {
        title: "Dashboard",
      },
      [Page.Album]: {
        title: "Album",
      },
      [Page.NotFound]: {
        title: "NotFound",
      },
      [Page.Playlist]: {
        title: "Playlist",
      },
      [Page.Artist]: {
        title: "Artist",
      },
      [Page.Search]: {
        title: "Search",
      },
      [Page.Concert]: {
        title: "Concert",
      },
      [Page.Episode]: {
        title: "Episode",
      },
      [Page.Podcast]: {
        title: "Podcast",
      },
      [Page.Genre]: {
        title: "Genre",
      },
      [Page.Show]: {
        title: "Show",
      },
      [Page.Track]: {
        title: "Track",
      },
      [Page.User]: {
        title: "User",
      },
    },
    [Language.ES]: {
      [Page.Home]: {
        heroTitle: "Todo lo que necesitas para disfrutar de la música",
        heroInfoTitle: "Ideal para cualquier tipo de situación.",
        heroInfoDescription:
          "Ya sea si tienes un bot que añade tracks y te ha estado añadiendo repetidos, Rindu elimina esos tracks que están de más y deja solo uno.",
        section1Eyebrow: "HERRAMIENTAS FÁCILES DE USAR",
        section1Title: "Lo mejor para arreglar tus playlists",
        section1Description:
          "Agregar canciones por cualquier método puede fallar, por lo que queda un espacio guardado sin datos. Esto es una canción corrupta.",
        cta: "Descubre como",
        section2Eyebrow: "SIN COMPLICACIONES",
        section2Title: "Elimina las canciones invisibles",
        section2Description:
          "Si el total de canciones de una playlist no concuerda con el último número de la lista, tu playlist está corrupta.",
        section3Eyebrow: "ELIMINA DISTRACCIONES",
        section3Title: "No más duplicados en tus playlists",
        section3Description:
          "Escucha sin repetir canciones, Rindu elimina los duplicados de tus playlists y lista de favoritos.",
        section4Eyebrow: "LAS FUNCIONALIDADES QUE AMAS",
        section4Title: "Explora y escucha",
        section4Description:
          "Rindu te permite explorar y escuchar canciones de manera sencilla. Agrega canciones a tus playlists y listas de favoritos.",
        concludeSectionTitle: "¿Qué esperas para descubrir Rindu?",
        concludeSectionDescription:
          "Disfruta de la música a tu ritmo, tu pones las reglas y Rindu te lo hace realidad.",
        concludeSectionCta: "Empieza ahora",
        loginButton: "ENTRA CON SPOTIFY",
      },
      [Page.Dashboard]: {
        title: "Dashboard",
      },
      [Page.Album]: {
        title: "Album",
      },
      [Page.NotFound]: {
        title: "NotFound",
      },
      [Page.Playlist]: {
        title: "Playlist",
      },
      [Page.Artist]: {
        title: "Artist",
      },
      [Page.Search]: {
        title: "Search",
      },
      [Page.Concert]: {
        title: "Concert",
      },
      [Page.Episode]: {
        title: "Episode",
      },
      [Page.Podcast]: {
        title: "Podcast",
      },
      [Page.Genre]: {
        title: "Genre",
      },
      [Page.Show]: {
        title: "Show",
      },
      [Page.Track]: {
        title: "Track",
      },
      [Page.User]: {
        title: "User",
      },
    },
  };

  const language = spanishCountries.includes(country)
    ? Language.ES
    : Language.EN;
  return translations[language][page];
}
