import { NextApiResponse } from "next";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "utils";

export function serverRedirect(
  res: NextApiResponse,
  url: string,
  removeCookies = true
): void {
  if (removeCookies) {
    res.setHeader("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
      `${REFRESH_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
    ]);
  }

  res.writeHead(307, { Location: url });
  res.end();
}
