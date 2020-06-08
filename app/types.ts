export type Plugin = {
  manifest: PluginManifest;
  script: string;
  path: string;
};

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
  plugin: string;
  settings?: string;
};
