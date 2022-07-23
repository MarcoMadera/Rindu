import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import useAnalytics from "hooks/useAnalytics";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

export default function Custom500(): ReactElement {
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
        <title>Rindu - 😫 500 - Servidor?</title>
      </Head>
      <Heading number={1}>500?</Heading>
      <p>Ha ocurrido un error en el servidor</p>
      <style jsx>{`
        p {
          font-size: 30px;
          text-align: center;
        }
      `}</style>
    </ContentContainer>
  );
}
