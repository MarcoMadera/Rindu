import { createContext } from "react";

const TranslationsContext = createContext<
  TranslationsContextProviderProps | undefined
>(undefined);

export interface TranslationsContextProviderProps {
  translations: Record<string, string>;
}

export default TranslationsContext;
