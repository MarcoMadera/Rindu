import { createContext } from "react";

import { ITranslations } from "types/translations";
import { Locale } from "utils";

const TranslationsContext = createContext<
  TranslationsContextProviderValue | undefined
>(undefined);

TranslationsContext.displayName = "TranslationsContext";

export interface TranslationsContextProviderProps {
  translations: ITranslations;
}
export interface TranslationsContextProviderValue
  extends TranslationsContextProviderProps {
  locale: Locale | null;
}

export default TranslationsContext;
