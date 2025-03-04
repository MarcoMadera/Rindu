import { baseUrl } from "./environment";
import { generateHMACSHA256Token } from "./hmacToken";

export enum GeneratedImageAPI {
  TopTracksCover = "/api/top-tracks-cover",
  ConcertCover = "/api/concert-cover",
  RadioCover = "/api/radio-cover",
}

export const getGeneratedImageUrl = async (
  api: GeneratedImageAPI,
  params: Record<string, string>
): Promise<string> => {
  const url = new URL(`${baseUrl}${api}`);
  const token = await generateHMACSHA256Token(params);

  url.search = new URLSearchParams({ ...params, token }).toString();

  return url.toString();
};
