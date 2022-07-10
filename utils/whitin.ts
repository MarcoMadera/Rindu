export async function within<T>(
  promise: Promise<T | null>,
  duration: number
): Promise<{ error: string | null; data: T | null }> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      resolve({ error: "timeout", data: null });
    }, duration);

    const data = await promise;
    clearTimeout(timeout);
    resolve({ error: null, data });
  });
}
