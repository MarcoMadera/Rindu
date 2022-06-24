export async function within<T>(
  promise: Promise<T | null>,
  duration: number
): Promise<T | null> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      resolve(null);
    }, duration);

    const data = await promise;
    clearTimeout(timeout);
    resolve(data);
  });
}
