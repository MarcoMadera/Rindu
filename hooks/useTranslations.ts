import { useContext } from "react";
import TranslationsContext, {
  TranslationsContextProviderProps,
} from "../context/TranslationsContext";

export default function useTranslations(): TranslationsContextProviderProps {
  const context = useContext(TranslationsContext);

  if (!context) {
    throw new Error(
      "useTranslations must be used within a TranslationsContextProvider"
    );
  }
  return context;
}
