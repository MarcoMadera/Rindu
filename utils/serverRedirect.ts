import { GetServerSidePropsContext } from "next";

export function serverRedirect(
  res: GetServerSidePropsContext["res"],
  url: string
): void {
  res.writeHead(307, { Location: url });
  res.end();
}
