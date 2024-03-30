import { useMemo } from "react";

import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import { useCustomContext } from "hooks";
import { getLocale, Locale } from "utils";

export interface Translations extends TranslationsContextProviderProps {
  locale: Locale;
  locales: Locale[];
}

export function useTranslations(): Translations {
  const context = useCustomContext(TranslationsContext);

  const locales = useMemo(() => Object.values(Locale), []);

  return {
    ...context,
    locale: getLocale(context.locale),
    locales: locales,
  };
}
