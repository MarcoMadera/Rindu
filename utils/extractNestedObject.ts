export const extractNestedObject = <
  TValue extends Record<K, unknown>,
  TKey extends PropertyKey,
  K extends keyof TValue,
>(
  record: Record<TKey, TValue>,
  key: K
): Record<TKey, TValue[K]> => {
  return (Object.entries(record) as [TKey, TValue][]).reduce(
    (acc, [topLevelKey, value]) => ({
      ...acc,
      [topLevelKey]: value[key],
    }),
    {} as Record<TKey, TValue[K]>
  );
};
