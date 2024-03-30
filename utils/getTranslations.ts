import { translations } from "i18n";
import { ServerApiContext } from "types/serverContext";
import { ITranslations } from "types/translations";
import {
  DEFAULT_LOCALE,
  getLocale,
  isLocale,
  Locale,
  LOCALE_COOKIE,
  takeCookie,
} from "utils";

function loadLocalization(locale: Locale): ITranslations {
  const data = translations[locale];
  return data;
}

export function getTranslations(context?: ServerApiContext): ITranslations {
  const locale = getLocale(takeCookie(LOCALE_COOKIE, context));

  if (!isLocale(locale)) {
    const defaultTranslations = loadLocalization(DEFAULT_LOCALE);
    return defaultTranslations;
  }

  const translations = loadLocalization(locale);
  return translations;
}
