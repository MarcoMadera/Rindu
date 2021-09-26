import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Collection(): ReactElement {
  const router = useRouter();
  useEffect(() => {
    router.push("/collection/playlists");
  }, [router]);
  return <Head>Rindu - Library</Head>;
}
