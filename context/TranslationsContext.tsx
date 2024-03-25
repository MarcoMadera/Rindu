import { createContext } from "react";

const TranslationsContext = createContext<
  TranslationsContextProviderValue | undefined
>(undefined);

export interface TranslationsContextProviderProps {
  translations: Record<string, string>;
}
export interface TranslationsContextProviderValue
  extends TranslationsContextProviderProps {
  locale: string | null;
}

export default TranslationsContext;
