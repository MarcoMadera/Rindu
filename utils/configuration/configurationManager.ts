import { CURRENT_VERSION, migrations } from "./migrations";
import type { ConfigOptions } from "./schema";
import { DEFAULT_CONFIG, isValidValue, validateConfig } from "./schema";
import { isServer } from "utils/environment";

export interface VersionedConfig {
  version: number;
  data: ConfigOptions;
}

export class ConfigurationManager {
  private static instance: ConfigurationManager | null = null;
  private config: ConfigOptions = DEFAULT_CONFIG;
  private readonly storageKey = "app_config";

  private constructor() {
    if (isServer()) return;
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  public static resetInstance(): void {
    ConfigurationManager.instance = null;
  }

  private loadConfig(): ConfigOptions {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        return DEFAULT_CONFIG;
      }

      const parsedData = JSON.parse(storedData) as
        | VersionedConfig
        | ConfigOptions;

      if (!("version" in parsedData)) {
        const migrated = migrations[0](parsedData);
        this.saveConfig(migrated);
        return migrated;
      }

      if (parsedData.version === CURRENT_VERSION) {
        return validateConfig(parsedData.data);
      }

      const migrationFunc =
        migrations[parsedData.version] || migrations["default"];

      const migrated = migrationFunc(parsedData.data);
      this.saveConfig(migrated);
      return migrated;
    } catch (error) {
      console.error("Error loading config:", error);
      return DEFAULT_CONFIG;
    }
  }

  private saveConfig(configToSave = this.config): void {
    try {
      const versionedConfig: VersionedConfig = {
        version: CURRENT_VERSION,
        data: configToSave,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(versionedConfig));
    } catch (error) {
      console.error("Error saving config:", error);
    }
  }

  public get<K extends keyof ConfigOptions>(key: K): ConfigOptions[K] {
    if (!isValidValue(key, this.config[key])) {
      console.warn(`Invalid value found for ${key}, returning default value`);
      this.config[key] = DEFAULT_CONFIG[key];
      this.saveConfig();
    }
    return this.config[key];
  }

  public set<K extends keyof ConfigOptions>(
    key: K,
    value: ConfigOptions[K]
  ): void {
    const newConfig = {
      ...this.config,
      [key]: value,
    };

    this.config = validateConfig(newConfig);
    this.saveConfig();
  }

  public reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
  }

  public getAll(): Readonly<ConfigOptions> {
    return { ...this.config };
  }

  public updateMultiple(updates: Partial<ConfigOptions>): void {
    const newConfig = {
      ...this.config,
      ...updates,
    };

    this.config = validateConfig(newConfig);
    this.saveConfig();
  }

  public static getDefaultValue<K extends keyof ConfigOptions>(
    key: K
  ): ConfigOptions[K] {
    return DEFAULT_CONFIG[key];
  }

  public getVersion(): number {
    return CURRENT_VERSION;
  }
}

export default ConfigurationManager;
