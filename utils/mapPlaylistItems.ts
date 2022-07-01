import { normalTrackTypes } from "types/spotify";

export function mapPlaylistItems(
  items: SpotifyApi.PlaylistTrackObject[] | undefined,
  startIndex: number
): normalTrackTypes[] {
  if (!items) return [];
  return items?.map(({ track, added_at, is_local }, i) => {
    const isCorrupted =
      !track?.name && !track?.artists?.[0]?.name && track?.duration_ms === 0;
    return {
      name: track?.name,
      images: track?.album.images,
      uri: track?.uri,
      href: track?.external_urls.spotify,
      artists: track?.artists,
      id: track?.id,
      explicit: track?.explicit,
      duration: track?.duration_ms,
      audio: track?.preview_url,
      corruptedTrack: isCorrupted,
      position: startIndex + i,
      album: track?.album,
      added_at,
      type: track?.type,
      media_type: "audio",
      is_playable: track?.is_playable,
      is_local,
    };
  });
}
