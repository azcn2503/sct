export type Plugin = {
  manifest: PluginManifest;
  script: string;
  path: string;
  settingsSchema: any;
  settings: any;
};

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
};
