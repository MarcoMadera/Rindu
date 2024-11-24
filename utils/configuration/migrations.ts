import { validateConfig } from "./schema";
import type { Migrations } from "types/configuration";

export const CURRENT_VERSION = 1;

export const migrations: Migrations = {
  0: (oldConfig) => validateConfig(oldConfig),
  default: (oldConfig) => validateConfig(oldConfig),
};
