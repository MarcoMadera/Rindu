import { ReactElement } from "react";

import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument(): ReactElement {
  return (
    <Html lang="es-MX">
      <Head />
      <body>
        <Main />
        <div id="tracksModal" />
        <div id="toast" />
        <div id="contextMenu" />
        <div>
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
