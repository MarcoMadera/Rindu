import { AuthorizationResponse } from "types/spotify";
import { getSiteUrl } from "utils/environment";

export default async function getAuthorizationByCode(
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
    const data = (await res.json()) as AuthorizationResponse;
    return data;
  }
  return null;
}
