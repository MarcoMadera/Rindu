export interface Configuration {
  isDocPipEnabled: boolean;
  theme: "light" | "dark" | "system";
  volume: number;
  colorizedLyrics: boolean;
}

export interface VersionedConfig {
  version: number;
  data: Configuration;
}

export type Validators = Record<
  keyof Configuration,
  (value: unknown) => boolean
>;

export type MigrationFunction = (
  config: Partial<Configuration>
) => Configuration;

export type Migrations = Record<number | "default", MigrationFunction>;
