import en from "./en";
import es from "./es";
import { ITranslations } from "types/translations";
import { Locale } from "utils/locale";

export const translations: Record<Locale, ITranslations> = {
  [Locale.EN]: en,
  [Locale.ES]: es,
};

export default translations;
