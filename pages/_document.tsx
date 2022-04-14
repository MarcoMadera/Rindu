import Document, { Head, Main, NextScript, Html } from "next/document";
import { ReactElement } from "react";

export default class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html lang="es-MX">
        <Head />
        <body>
          <Main />
          <div id="tracksModal" />
          <div id="toast" />
          <div>
            <NextScript />
          </div>
        </body>
      </Html>
    );
  }
}
