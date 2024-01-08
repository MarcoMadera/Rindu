import { NextApiResponse } from "next";

export function getServerCookies(res: NextApiResponse): string {
  const setCookies = res.getHeader("Set-Cookie");
  const cookies = Array.isArray(setCookies)
    ? setCookies.join(" ")
    : setCookies?.toString();

  return cookies ?? "";
}
