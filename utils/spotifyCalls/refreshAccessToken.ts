import { SITE_URL } from "../constants";

interface IRefreshAccessTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<IRefreshAccessTokenResponse | null> {
  const res = await fetch(`${SITE_URL}/api/spotify-refresh`, {
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
