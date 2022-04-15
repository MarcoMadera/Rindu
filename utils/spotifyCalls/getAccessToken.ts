import { SITE_URL } from "../constants";

interface IGetAccessTokenResponse {
  accessToken: string;
}

export async function getAccessToken(): Promise<IGetAccessTokenResponse | null> {
  const res = await fetch(`${SITE_URL}/api/spotify-refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const data: IGetAccessTokenResponse = await res.json();
    return data;
  }

  return null;
}
