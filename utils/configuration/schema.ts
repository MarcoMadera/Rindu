export interface ConfigOptions {
  isDocPipEnabled: boolean;
  theme: "light" | "dark" | "system";
  volume: number;
}

export const DEFAULT_CONFIG: ConfigOptions = {
  isDocPipEnabled: true,
  theme: "system",
  volume: 1,
};

export const configValidators = {
  isDocPipEnabled: (value: unknown): value is boolean =>
    typeof value === "boolean",

  theme: (value: unknown): value is ConfigOptions["theme"] =>
    typeof value === "string" && ["light", "dark", "system"].includes(value),

  volume: (value: unknown): value is number =>
    typeof value === "number" && value >= 0 && value <= 1,
};

export function isValidValue<K extends keyof ConfigOptions>(
  key: K,
  value: unknown
): value is ConfigOptions[K] {
  return configValidators[key](value);
}

export function validateConfig(config: Partial<ConfigOptions>): ConfigOptions {
  return {
    ...DEFAULT_CONFIG,
    ...Object.fromEntries(
      Object.entries(config).filter(
        ([key, value]) =>
          key in configValidators &&
          isValidValue(key as keyof ConfigOptions, value)
      )
    ),
  };
}
