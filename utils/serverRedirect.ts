import { NextApiResponse } from "next";
import Router from "next/router";

export function serverRedirect(res: NextApiResponse, url: string): void {
  if (res) {
    res.writeHead(307, { Location: url });
    res.end();
  } else {
    Router.replace(url);
  }
}
