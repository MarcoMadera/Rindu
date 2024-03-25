export function getMonth(month: number, locale: string): string {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString(locale, { month: "short" }).toUpperCase();
}
