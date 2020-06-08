class MissingExportError extends Error {}

const compiledPlugins = {};

export function compilePlugin({ id, script }) {
  console.group('compile plugin', id);
  const compiled = eval(script);
  if (!compiled.plugin) {
    throw new MissingExportError(
      'Unable to compile plugin, plugin export was not found.'
    );
  }
  compiledPlugins[id] = compiled.plugin;
  console.log('compiledPlugins', compiledPlugins);
  console.groupEnd();
  return compiled;
}

export function getCompiledPlugin(id) {
  return compiledPlugins[id];
}
