import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import useAnalytics from "hooks/useAnalytics";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

export default function Custom404(): ReactElement {
  const { pathname } = useRouter();
  const { trackWithGoogleAnalytics } = useAnalytics();

  useEffect(() => {
    trackWithGoogleAnalytics("exception", {
      exDescription: `500 internal server error: ${pathname}`,
      exFatal: "1",
    });
  }, [pathname, trackWithGoogleAnalytics]);

  return (
    <ContentContainer id="main">
      <Head>
        <title>Rindu - 😫 404 - No encontrado</title>
      </Head>
      <Heading number={1}>404</Heading>
      <p>Página no encontrada</p>
      <style jsx>{`
        p {
          font-size: 30px;
          text-align: center;
        }
      `}</style>
    </ContentContainer>
  );
}
