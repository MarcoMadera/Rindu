export function getIdFromUri(uri: string): string {
  const id = uri.split(":")[2];
  return id;
}
