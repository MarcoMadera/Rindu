import { GetServerSidePropsContext } from "next";

import { removeTokensFromCookieServer } from "utils";

export function serverRedirect(
  res: GetServerSidePropsContext["res"],
  url: string,
  removeCookies = true
): void {
  if (removeCookies) {
    removeTokensFromCookieServer(res);
  }

  res.writeHead(307, { Location: url });
  res.end();
}
