import type { ServerApiContext } from "types/serverContext";
import { AuthorizationResponse } from "types/spotify";
import {
  baseUrl,
  CODE_VERIFIER_COOKIE,
  handleJsonResponse,
  takeCookie,
} from "utils";

export async function getAuthorizationByCode(
  code: string,
  context?: ServerApiContext
): Promise<AuthorizationResponse | null> {
  const code_verifier = takeCookie(CODE_VERIFIER_COOKIE, context);
  const res = await fetch(`${baseUrl}/api/spotify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, code_verifier }),
  });

  return handleJsonResponse<AuthorizationResponse>(res);
}
