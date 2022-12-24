import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function search(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.SearchResponse> {
  const q = query.replaceAll(" ", "+");
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=album,track,artist,playlist,show,episode&market=from_token&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  const data = (await res.json()) as SpotifyApi.SearchResponse;
  return data;
}

export async function searchArtist(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.ArtistObjectFull[] | null> {
  const q = query.replaceAll(" ", "+");
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=artist&market=from_token&limit=1`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  const data = (await res.json()) as SpotifyApi.SearchResponse;
  return data?.artists?.items || null;
}

export async function searchTrack(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.TrackObjectFull[] | null> {
  const q = query.replaceAll(" ", "+");
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=track&market=from_token&limit=10`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  const data = (await res.json()) as SpotifyApi.SearchResponse;
  return data?.tracks?.items || null;
}

export async function searchPlaylist(
  query?: string,
  accessToken?: string
): Promise<SpotifyApi.PlaylistObjectFull[] | null> {
  if (!query) return null;
  const q = query.replaceAll(" ", "+");
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=playlist&market=from_token&limit=50`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  const data = (await res.json()) as SpotifyApi.PlaylistSearchResponse;
  return (data?.playlists?.items || null) as
    | SpotifyApi.PlaylistObjectFull[]
    | null;
}
