export async function handleJsonResponse<T>(res: Response): Promise<T | null> {
  if (res.ok) {
    const data = (await res.json()) as T;
    return data;
  }

  console.warn(res.status, res.statusText, res.url);

  return null;
}
