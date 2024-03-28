import { TimeOutError } from "./errors";

export type WithinResult<T> = {
  error: Error | null;
  data: T | null;
  id?: string;
};

export async function within<T>(
  promise: Promise<T | null>,
  duration: number,
  id?: string
): Promise<WithinResult<T>> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ error: new TimeOutError(), data: null, id });
    }, duration);

    promise
      .then((data) => {
        clearTimeout(timeout);
        resolve({ error: null, data, id });
      })
      .catch((error: Error) => {
        clearTimeout(timeout);
        resolve({ error: error, data: null, id });
      });
  });
}
