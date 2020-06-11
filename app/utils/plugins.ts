import { noop } from 'lodash';

const compiledPlugins = {};

export function compilePluginMetadata(script, context) {
  try {
    const { manifest = noop, settings = noop } = eval(script) || {};
    return { manifest: manifest(context), settings: settings(context) };
  } catch (ex) {
    console.error('Plugin metadata failed', ex);
    throw ex;
  }
}

export function compilePlugin({ id, script }) {
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
