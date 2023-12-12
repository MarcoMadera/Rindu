type hitTypes =
  | "pageview"
  | "screenview"
  | "event"
  | "transaction"
  | "item"
  | "social"
  | "exception"
  | "timing";

interface Event {
  eventCategory: dataToSendType["ec"];
  eventAction: dataToSendType["ea"];
  eventLabel: dataToSendType["el"];
  eventValue: dataToSendType["ev"];
}

interface Screenview {
  screenName: dataToSendType["cd"];
}

interface Timing {
  timingCategory: dataToSendType["utc"];
  timingVar: dataToSendType["utv"];
  timingValue: dataToSendType["utt"];
  timingLabel: dataToSendType["utl"];
}

interface Exception {
  exDescription: dataToSendType["exd"];
  exFatal: dataToSendType["exf"];
}

interface Social {
  socialNetwork: dataToSendType["sn"];
  socialAction: dataToSendType["sa"];
  socialTarget: dataToSendType["st"];
}

export type dataToSendType = {
  v: string;
  tid: string;
  cid: string;
  aip: "1" | "0";
  ds: string;
  qt: string;
  uid: string;
  dr: string;
  cn: string;
  cs: string;
  cm: string;
  ck: string;
  cc: string;
  ci: string;
  sr: string;
  vp: string;
  de: string;
  sd: string;
  ul: string;
  je: "1" | "0";
  fl: string;
  ni: "1" | "0";
  dl: string;
  dh: string;
  dp: string;
  dt: string;
  cd: string;
  linkid: string;
  an: string;
  aid: string;
  av: string;
  aiid: string;
  cu: string;
  sc: string;
  t: string;
  ec: string;
  ea: string;
  el: string;
  ev: string;
  sn: string;
  sa: string;
  st: string;
  utc: string;
  utv: string;
  utt: string;
  utl: string;
  exd: string;
  exf: "1" | "0";
};

export type Fields =
  | Event
  | Screenview
  | Timing
  | Exception
  | Social
  | undefined;

export interface UseAnalyticsParams {
  trackWithGoogleAnalytics<T extends hitTypes>(
    hitType: hitTypes | T,
    fields: T extends "event"
      ? Event
      : T extends "screenview"
        ? Screenview
        : T extends "social"
          ? Social
          : T extends "exception"
            ? Exception
            : T extends "timing"
              ? Timing
              : undefined
  ): void;
  trackWithGoogleAnalytics(
    hitType?: "pageview" | "item" | "transaction",
    fields?: undefined
  ): void;
}
