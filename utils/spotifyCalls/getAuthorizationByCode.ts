import { AuthorizationResponse } from "types/spotify";
import {
  CODE_VERIFIER_COOKIE,
  getSiteUrl,
  handleJsonResponse,
  takeCookie,
} from "utils";

export async function getAuthorizationByCode(
  code: string,
  cookies: string
): Promise<AuthorizationResponse | null> {
  const code_verifier = takeCookie(CODE_VERIFIER_COOKIE, cookies);
  const res = await fetch(`${getSiteUrl()}/api/spotify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, code_verifier }),
  });

  return handleJsonResponse<AuthorizationResponse>(res);
}
