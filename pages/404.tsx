import ContentContainer from "components/ContentContainer";
import useAnalytics from "hooks/useAnalytics";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

export default function Custom404(): ReactElement {
  const { pathname } = useRouter();
  const { trackWithGoogleAnalitycs } = useAnalytics();

  useEffect(() => {
    trackWithGoogleAnalitycs("exception", {
      exDescription: `500 internal server error: ${pathname}`,
      exFatal: "1",
    });
  }, [pathname, trackWithGoogleAnalitycs]);

  return (
    <ContentContainer id="main">
      <Head>
        <title>Rindu - 😫 404 - No encontrado</title>
      </Head>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <style jsx>{`
        h1 {
          margin: 0;
          font-size: 100px;
          text-align: center;
        }
        p {
          font-size: 30px;
          text-align: center;
        }
      `}</style>
    </ContentContainer>
  );
}
