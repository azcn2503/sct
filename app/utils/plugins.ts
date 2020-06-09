class MissingExportError extends Error {}

const compiledPlugins = {};

export function compilePlugin({ id, script }): void {
  try {
    const compiled = eval(script);
    if (!compiled.plugin) {
      throw new MissingExportError(
        'Unable to compile plugin, plugin export was not found.'
      );
    }
    compiledPlugins[id] = compiled.plugin;
  } catch (ex) {
    console.error('Plugin compile failed', ex);
  }
}

export function getCompiledPlugin(id) {
  return compiledPlugins[id];
}
