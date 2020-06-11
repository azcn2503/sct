export type Plugin = {
  manifest: PluginManifest;
  script: string;
  path: string;
  settingsSchema: PluginSettingsSchemaField[];
  settings: PluginSettings;
};

export type PluginContext = {
  logFilePath: string;
  [key: string]: any;
};

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
};

export type PluginSettingsSchemaField = {
  id: string;
  label?: string;
  description?: string;
  type: string;
  defaultValue?: any;
};

export type PluginSettings = {
  [key: string]: any;
};
