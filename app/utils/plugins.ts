import { noop } from 'lodash';

import { Plugin, PluginContext } from '../types';

const compiledPlugins = {};

function generateDefaultSettings(settingsSchema) {
  const settings = {};
  settingsSchema.forEach(field => {
    settings[field.id] = field.defaultValue;
  });
  return settings;
}

export function compilePluginMetadata(
  script: string,
  context: PluginContext
): Pick<Plugin, 'manifest' | 'settings' | 'settingsSchema'> {
  try {
    const { manifest = noop, settingsSchema = noop } = eval(script) || {};
    const compiledSettingsSchema = settingsSchema(context);
    const settings = generateDefaultSettings(compiledSettingsSchema);
    return {
      manifest: manifest(context),
      settingsSchema: compiledSettingsSchema,
      settings
    };
  } catch (ex) {
    console.error('Plugin metadata failed', ex);
    throw ex;
  }
}

export function compilePlugin({
  id,
  script
}: {
  id: string;
  script: string;
}): Function {
  try {
    const { plugin } = eval(script) || {};
    compiledPlugins[id] = plugin;
    return plugin;
  } catch (ex) {
    console.error('Plugin compile failed', ex);
    throw ex;
  }
}

export function getCompiledPlugin(id) {
  return compiledPlugins[id];
}
