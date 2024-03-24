import { getSiteUrl } from "./environment";
import { generateHMACSHA256Token } from "./hmacToken";

export enum GeneratedImageAPI {
  TopTracksCover = "/api/top-tracks-cover",
  ConcertCover = "/api/concert-cover",
  RadioCover = "/api/radio-cover",
}

export const getGeneratedImageUrl = (
  api: GeneratedImageAPI,
  params: Record<string, string>
): string => {
  const url = new URL(`${getSiteUrl()}${api}`);
  const token = generateHMACSHA256Token(params);

  url.search = new URLSearchParams({ ...params, token }).toString();

  return url.toString();
};
