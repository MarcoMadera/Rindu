export function divideArray<T>(array: T[], chunkSize: number): T[][] {
  const res: T[][] = [];
  array.forEach((_, i) => {
    const condition = i % chunkSize;
    if (!condition) {
      res.push(array.slice(i, i + chunkSize));
    }
  });
  return res;
}
