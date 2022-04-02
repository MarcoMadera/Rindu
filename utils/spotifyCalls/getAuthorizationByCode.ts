import { RefreshResponse } from "types/spotify";
import { SITE_URL } from "utils/constants";

export async function getAuthorizationByCode(
  code: string
): Promise<RefreshResponse | null> {
  const res = await fetch(`${SITE_URL}/api/spotify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  if (res.ok) {
    const data: RefreshResponse = await res.json();
    return data;
  }
  return null;
}
