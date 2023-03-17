import { useCancellablePromises } from "hooks";
import { wait } from "utils";

interface IRejectedPromiseInfo {
  error: Error;
  isCanceled: boolean;
}

export const cancellablePromise = (
  promise: Promise<unknown>
): { promise: Promise<unknown>; cancel: () => boolean } => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
      (error) => reject({ isCanceled, error: error as Error })
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => (isCanceled = true),
  };
};

export const useClickPreventionOnDoubleClick = (
  onClick: () => void,
  onDoubleClick: () => void
): (() => void)[] => {
  const api = useCancellablePromises();

  const handleClick = () => {
    api.clearPendingPromises();
    const waitForClick = cancellablePromise(wait(300));
    api.appendPendingPromise(waitForClick);

    return waitForClick.promise
      .then(() => {
        api.removePendingPromise(waitForClick);
        onClick();
      })
      .catch((errorInfo: IRejectedPromiseInfo) => {
        api.removePendingPromise(waitForClick);
        if (!errorInfo.isCanceled) {
          throw errorInfo.error;
        }
      });
  };

  const handleDoubleClick = () => {
    api.clearPendingPromises();
    onDoubleClick();
  };

  return [handleClick, handleDoubleClick];
};
