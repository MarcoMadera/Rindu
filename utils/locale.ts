export enum Locale {
  EN = "en",
  ES = "es",
}

export function isLocale(value: string): value is Locale {
  return Object.values(Locale).includes(value as Locale);
}

export function getLocale(value?: string | null): Locale {
  if (!value || !isLocale(value)) return Locale.EN;

  return value;
}
