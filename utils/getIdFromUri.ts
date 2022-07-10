export function getIdFromUri(
  uri?: string,
  type?: "type" | "id"
): string | undefined {
  if (type === "id") {
    const id = uri?.split(":")[2];
    return id;
  }
  if (type === "type") {
    const type = uri?.split(":")[1];
    return type;
  }
  return "";
}
