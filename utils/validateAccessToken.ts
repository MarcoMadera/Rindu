import { SpotifyUserResponse } from "../lib/types";
import { SITE_URL } from "./constants";

export async function validateAccessToken(
  accessToken: string | undefined
): Promise<SpotifyUserResponse | undefined> {
  if (accessToken) {
    const user = await fetch(`${SITE_URL}/api/spotify-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    }).then((res) => {
      if (!res.ok) {
        throw Error(JSON.stringify(res));
      }
      return res.json();
    });
    return user;
  }
  return;
}
