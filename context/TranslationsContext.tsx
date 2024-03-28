import { createContext } from "react";

import { Locale } from "utils";

const TranslationsContext = createContext<
  TranslationsContextProviderValue | undefined
>(undefined);

export interface TranslationsContextProviderProps {
  translations: Record<string, string>;
}
export interface TranslationsContextProviderValue
  extends TranslationsContextProviderProps {
  locale: Locale | null;
}

export default TranslationsContext;
