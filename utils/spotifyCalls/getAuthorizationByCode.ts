import { AuthorizationResponse } from "types/spotify";
import { getSiteUrl } from "utils/environment";

export async function getAuthorizationByCode(
  code: string
): Promise<AuthorizationResponse | null> {
  const res = await fetch(`${getSiteUrl()}/api/spotify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  if (res.ok) {
    const data: AuthorizationResponse = await res.json();
    return data;
  }
  return null;
}
