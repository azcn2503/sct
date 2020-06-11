import { noop, get } from 'lodash';

import { Plugin, PluginContext } from '../types';

const compiledPlugins = {};

function generateDefaultSettings(settingsSchema, context: PluginContext) {
  const contextKeys = Object.keys(context);
  const settings = {};
  if (context.plugin) {
    // Plugin is being rebuilt, so only update settings that track changed keys
    settingsSchema.forEach(field => {
      if (
        field.updateOn &&
        field.updateOn.some(key => contextKeys.includes(key))
      ) {
        settings[field.id] = field.defaultValue;
      }
    });
  } else {
    settingsSchema.forEach(field => {
      settings[field.id] = field.defaultValue;
    });
  }
  return settings;
}

export function compilePluginMetadata(
  script: string,
  context: PluginContext
): Pick<Plugin, 'manifest' | 'settings' | 'settingsSchema'> {
  try {
    const { manifest = noop, settingsSchema = noop } = eval(script) || {};
    const compiledSettingsSchema = settingsSchema(context);
    const settings = generateDefaultSettings(compiledSettingsSchema, context);
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
