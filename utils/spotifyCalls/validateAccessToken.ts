import { SITE_URL } from "../constants";

export async function validateAccessToken(
  accessToken: string | null
): Promise<SpotifyApi.UserObjectPrivate | null> {
  if (!accessToken) {
    return null;
  }

  const validateAccessTokenResponse = await fetch(
    `${SITE_URL}/api/spotify-login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    }
  );

  if (validateAccessTokenResponse.ok) {
    const data: SpotifyApi.UserObjectPrivate =
      await validateAccessTokenResponse.json();
    return data;
  }

  return null;
}
