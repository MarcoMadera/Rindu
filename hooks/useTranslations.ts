import { useRouter } from "next/router";

import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import { useCustomContext } from "hooks";
import { getLocale, Locale } from "utils";

export interface Translations extends TranslationsContextProviderProps {
  locale: Locale;
  locales: string[];
}

export function useTranslations(): Translations {
  const context = useCustomContext(TranslationsContext);
  const router = useRouter();
  const { locales } = router;

  return {
    ...context,
    locale: getLocale(context.locale),
    locales: locales ?? [],
  };
}
