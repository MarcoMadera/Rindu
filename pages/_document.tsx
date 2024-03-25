import { ReactElement } from "react";

import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { ServerApiContext } from "types/serverContext";
import { DEFAULT_LOCALE, LOCALE_COOKIE, takeCookie } from "utils";

export default function MyDocument({ locale }: DocumentProps): ReactElement {
  return (
    <Html lang={locale ?? DEFAULT_LOCALE}>
      <Head>
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh7USSwaPGR_p.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh7USSwiPGQ.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjxAwXjeu.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXg.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh6UVSwaPGR_p.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh6UVSwiPGQ.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh50XSwaPGR_p.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh50XSwiPGQ.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 300;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh7USSwaPGR_p.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }           
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 300;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh7USSwiPGQ.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }         
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjxAwXjeu.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }          
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXg.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }         
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 700;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh6UVSwaPGR_p.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }           
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 700;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh6UVSwiPGQ.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }            
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 900;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh50XSwaPGR_p.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }            
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 900;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh50XSwiPGQ.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }`,
          }}
        ></style>
      </Head>
      <body>
        <Main />
        <div id="globalModal" />
        <div id="toast" />
        <div id="contextMenu" />
        <div>
          <NextScript />
        </div>
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (context: DocumentContext) => {
  const initialProps = await Document.getInitialProps(context);

  if (context.req && "cookies" in context.req) {
    const locale = takeCookie(
      LOCALE_COOKIE,
      context as unknown as ServerApiContext
    );
    return { ...initialProps, locale };
  }

  return { ...initialProps };
};
