import type { ConfigOptions } from "./schema";
import { validateConfig } from "./schema";

export const CURRENT_VERSION = 1;

export type MigrationFunction = (
  config: Partial<ConfigOptions>
) => ConfigOptions;

export const migrations: Record<number | "default", MigrationFunction> = {
  0: (oldConfig) => validateConfig(oldConfig),
  default: (oldConfig) => validateConfig(oldConfig),
};
