import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

interface IgetRecommendations {
  seed_tracks: string[];
  limit?: number;
  market?: string;
  accessToken?: string | null;
}

export async function getRecommendations({
  seed_tracks,
  limit,
  market,
  accessToken,
}: IgetRecommendations): Promise<SpotifyApi.TrackObjectFull[] | null> {
  const res = await callSpotifyApi({
    endpoint: `/recommendations?seed_tracks=${seed_tracks.join()}&market=${
      market ?? "from_token"
    }&limit=${
      limit ?? 20
    }&fields=items(added_at,is_local,track(id,album(name,images,id),artists(name,id,type,uri),name,duration_ms,uri,explicit,is_playable,preview_url,type)),total`,
    method: "GET",
    accessToken,
  });

  const data = await handleJsonResponse<{
    tracks: SpotifyApi.TrackObjectFull[];
  }>(res);

  if (data) {
    return data?.tracks;
  }
  return null;
}
