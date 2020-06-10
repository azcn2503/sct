export type Plugin = {
  manifest: PluginManifest;
  script: string;
  path: string;
  settings: {
    [key: string]: any;
  };
};

export type PluginManifest = {
  id: string;
  name: string;
  version: string;
  plugin: string;
  settings?: string;
};
