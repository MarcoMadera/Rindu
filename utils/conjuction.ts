export function conjuction(items: (string | undefined)[]): string {
  const list: string[] = [];
  items.forEach((item) => {
    if (item) {
      list.push(item);
    }
  });
  return new Intl.ListFormat("en-US", { type: "unit" }).format(list);
}
