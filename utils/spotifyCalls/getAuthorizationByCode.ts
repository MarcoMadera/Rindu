import { AuthorizationResponse } from "types/spotify";
import { getSiteUrl, handleJsonResponse } from "utils";

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

  return handleJsonResponse<AuthorizationResponse>(res);
}
