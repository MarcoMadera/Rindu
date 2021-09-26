import { ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Collection(): ReactElement {
  const router = useRouter();
  router.push("/collection/playlists");
  return <Head>Rindu - Library</Head>;
}
