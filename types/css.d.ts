import type * as CSS from "csstype";

declare module "csstype" {
  interface Properties extends CSS.Properties, CSS.PropertiesHyphen {
    "--left-panel-width"?: string;
    "--header-color"?: string;
    "--header-opacity"?: string;
    "--banner-opacity"?: string;
  }
}
