export function findIndexOrLast<T>(
  arr: T[],
  predicate: (element: T) => boolean
): number {
  const index = arr.findIndex(predicate);
  return index !== -1 ? index : arr.length - 1;
}
