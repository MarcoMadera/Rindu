export const __prod__ = process.env.NODE_ENV === "production";
export const __isServer__ = !(typeof window != "undefined" && window.document);
export const ACCESS_TOKEN_COOKIE = "qs";
export const REFRESH_TOKEN_COOKIE = "rs";
export const EXPIRE_TOKEN_COOKIE = "ex";
export const SITE_URL = __prod__
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "http://localhost:3000";
export const MONTHS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];
