import { useRouter } from "next/router";

import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import { useCustomContext } from "hooks";
import { DEFAULT_LOCALE } from "utils";

export interface Translations extends TranslationsContextProviderProps {
  locale: string;
  locales: string[];
}

export function useTranslations(): Translations {
  const context = useCustomContext(TranslationsContext);
  const router = useRouter();
  const { defaultLocale, locales } = router;

  return {
    ...context,
    locale: context.locale ?? defaultLocale ?? DEFAULT_LOCALE,
    locales: locales ?? [],
  };
}
