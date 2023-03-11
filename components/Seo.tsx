import { ReactElement } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { getSiteUrl } from "utils";

export default function Seo(): ReactElement {
  const router = useRouter();
  const twitter = "@madera_marco";
  const title = "Rindu: limpiador de playlists de spotify";
  const des = `Ya sea si tienes un bot que añade tracks y te ha estado añadiendo
 repetidos, Rindu elimina esos tracks que están de más y deja solo uno.`;
  const description = des.replace(/\n/g, "");
  const cover = `${getSiteUrl()}/logo.png`;

  return (
    <Head key={1}>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="preconnect dns-prefetch"
        href="https://www.google-analytics.com"
      />
      <link rel="preconnect dns-prefetch" href="https://res.cloudinary.com" />
      <link
        rel="icon"
        type="image/png"
        href={`${getSiteUrl()}/favicon-32x32.png`}
      />
      <link rel="apple-touch-icon" href={`${getSiteUrl()}/favicon-32x32.png`} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <link
        rel="canonical"
        href={
          router.pathname === "/"
            ? getSiteUrl()
            : `${getSiteUrl()}/${router.asPath}`
        }
      />
      <meta property="og:locale" content="es-MX" />
      <meta name="robots" content="index,follow" />
      <meta name="monetization" content="$ilp.uphold.com/wjQdnNyGYBgW" />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image" content={cover} />
      <meta property="twitter:image" content={cover} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:site" content={twitter} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Head>
  );
}
