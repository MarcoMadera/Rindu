import { NextApiResponse } from "next";
import Router from "next/router";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";

export function serverRedirect(res: NextApiResponse, url: string): void {
  res.setHeader("Set-Cookie", [
    `${ACCESS_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
    `${REFRESH_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
  ]);

  if (res) {
    res.writeHead(307, { Location: url });
    res.end();
  } else {
    Router.replace(url);
  }
}
