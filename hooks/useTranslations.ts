import TranslationsContext, {
  TranslationsContextProviderProps,
} from "context/TranslationsContext";
import { useCustomContext } from "hooks";

export function useTranslations(): TranslationsContextProviderProps {
  return useCustomContext(TranslationsContext);
}
