import { getSiteUrl, handleJsonResponse } from "utils";

export interface IRefreshAccessTokenResponse {
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

  return handleJsonResponse<IRefreshAccessTokenResponse>(res);
}
