export function getMonth(month: number, locale: string): string {
  const date = new Date();
  date.setDate(1);
  date.setMonth(month);
  return date.toLocaleString(locale, { month: "short" }).toUpperCase();
}
