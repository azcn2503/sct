class MissingExportError extends Error {}

const compiledPlugins = {};

export function compilePlugin({ id, script }) {
  const compiled = eval(script);
  if (!compiled.plugin) {
    throw new MissingExportError(
      'Unable to compile plugin, plugin export was not found.'
    );
  }
  compiledPlugins[id] = compiled.plugin;
  return compiled;
}

export function getCompiledPlugin(id) {
  return compiledPlugins[id];
}
