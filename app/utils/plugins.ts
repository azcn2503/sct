import { noop } from 'lodash';

import { Plugin, PluginContext } from '../types';

const compiledPlugins = {};

export function compilePluginMetadata(
  script: string,
  context: PluginContext
): Partial<Plugin> {
  try {
    const { manifest = noop, settingsSchema = noop } = eval(script) || {};
    return {
      manifest: manifest(context),
      settingsSchema: settingsSchema(context)
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
