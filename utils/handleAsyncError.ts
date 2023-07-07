export function handleAsyncError<
  T extends (...args: Parameters<T>) => Promise<void>,
>(asyncFunction: T) {
  return (...args: Parameters<T>): void => {
    (async (): Promise<void> => {
      try {
        await asyncFunction(...args);
      } catch (error) {
        const functionName = asyncFunction.name;
        const isExpectedError = error instanceof Error;
        const errorMessage = `Error in ${functionName}:\n${
          isExpectedError ? error.message : "Unexpected error"
        }`;
        console.error(errorMessage);
      }
    })();
  };
}
