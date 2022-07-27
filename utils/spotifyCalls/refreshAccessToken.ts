import { getSiteUrl } from "../enviroment";

interface IRefreshAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export async function refreshAccessToken(
  refreshToken?: string
): Promise<IRefreshAccessTokenResponse | null> {
  const res = await fetch(`${getSiteUrl()}/api/spotify-refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }

  return null;
}
