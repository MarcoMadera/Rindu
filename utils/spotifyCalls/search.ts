import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function search(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.SearchResponse | null> {
  const q = query.replaceAll(" ", "+");
  const res = await callSpotifyApi({
    endpoint: `/search?q=${q}&type=album,track,artist,playlist,show,episode&market=from_token&limit=10`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.SearchResponse>(res);
}

export async function searchArtist(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.ArtistObjectFull[] | null> {
  const q = query.replaceAll(" ", "+");
  const res = await callSpotifyApi({
    endpoint: `/search?q=${q}&type=artist&market=from_token&limit=1`,
    method: "GET",
    accessToken,
  });

  const data = await handleJsonResponse<SpotifyApi.SearchResponse>(res);
  if (data) {
    return data?.artists?.items ?? null;
  }

  return null;
}

export async function searchTrack(
  query: string,
  accessToken?: string
): Promise<SpotifyApi.TrackObjectFull[] | null> {
  const q = query.replaceAll(" ", "+");
  const res = await callSpotifyApi({
    endpoint: `/search?q=${q}&type=track&market=from_token&limit=10`,
    method: "GET",
    accessToken,
  });
  const data = await handleJsonResponse<SpotifyApi.SearchResponse>(res);

  if (data) {
    return data?.tracks?.items ?? null;
  }

  return null;
}

export async function searchPlaylist(
  query?: string,
  accessToken?: string
): Promise<SpotifyApi.PlaylistObjectFull[] | null> {
  if (!query) return null;
  const q = query.replaceAll(" ", "+");
  const res = await callSpotifyApi({
    endpoint: `/search?q=${q}&type=playlist&market=from_token&limit=50`,
    method: "GET",
    accessToken,
  });
  const data = await handleJsonResponse<SpotifyApi.PlaylistSearchResponse>(res);

  if (data) {
    return (data?.playlists?.items ?? null) as
      | SpotifyApi.PlaylistObjectFull[]
      | null;
  }

  return null;
}
