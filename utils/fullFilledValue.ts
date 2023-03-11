import { deserialize } from "utils";

export function fullFilledValue<T>(promise: PromiseSettledResult<T>): T | null {
  if (promise.status === "fulfilled") {
    if (promise.value) {
      return deserialize(promise.value);
    }
  }
  return null;
}
