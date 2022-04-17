export function getYear(date: string): number {
  const year = new Date(date).getFullYear();
  return year;
}
