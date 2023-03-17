import { useRef } from "react";

export function useCancellablePromises(): {
  appendPendingPromise: (promise: {
    promise: Promise<unknown>;
    cancel: () => boolean;
  }) => void;
  removePendingPromise: (promise: {
    promise: Promise<unknown>;
    cancel: () => boolean;
  }) => void;
  clearPendingPromises: () => boolean[];
} {
  const pendingPromises = useRef<
    { promise: Promise<unknown>; cancel: () => boolean }[]
  >([]);

  const appendPendingPromise = (promise: {
    promise: Promise<unknown>;
    cancel: () => boolean;
  }) => {
    pendingPromises.current = [...pendingPromises.current, promise];
  };

  const removePendingPromise = (promise: {
    promise: Promise<unknown>;
    cancel: () => boolean;
  }) => {
    pendingPromises.current = pendingPromises.current.filter(
      (p) => p !== promise
    );
  };

  const clearPendingPromises = () =>
    pendingPromises.current.map((p) => p.cancel());

  const api = {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  };

  return api;
}
