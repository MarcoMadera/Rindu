import type { Configuration, Validators } from "types/configuration";
import { isServer } from "utils/environment";

export const DEFAULT_CONFIG: Configuration = {
  isDocPipEnabled: false,
  theme: "system",
  volume: 1,
  colorizedLyrics: true,
};

export const CONFIGURATION_STORAGE_KEY = "app_config";

export const validators: Validators = {
  isDocPipEnabled: (
    value: unknown
  ): value is Configuration["isDocPipEnabled"] => {
    const isBool = typeof value === "boolean";
    const isSupported = !isServer()
      ? !!window?.documentPictureInPicture
      : false;

    return isBool && isSupported;
  },
  colorizedLyrics: (
    value: unknown
  ): value is Configuration["colorizedLyrics"] => {
    const isBool = typeof value === "boolean";
    return isBool;
  },
  theme: (value: unknown): value is Configuration["theme"] =>
    typeof value === "string" && ["light", "dark", "system"].includes(value),

  volume: (value: unknown): value is Configuration["volume"] =>
    typeof value === "number" && value >= 0 && value <= 1,
};

export function isValidValue<K extends keyof Configuration>(
  key: K,
  value: unknown
): value is Configuration[K] {
  return validators[key](value);
}

function isValidConfigEntry([key, value]: [string, unknown]): boolean {
  return key in validators && isValidValue(key as keyof Configuration, value);
}

export function validateConfig(config: Partial<Configuration>): Configuration {
  const validatedEntries = Object.entries(config).filter(isValidConfigEntry);

  return {
    ...DEFAULT_CONFIG,
    ...Object.fromEntries(validatedEntries),
  };
}
