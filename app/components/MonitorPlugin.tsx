import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { compilePlugin } from '../actions/plugins';
import { getPluginContext } from '../utils/plugins';

/**
 * MonitorPlugin will establish a reverse file stream on the log file.
 * There will be one MonitorPlugin component per enabled plugin.
 */
export default function MonitorPlugin({ logFilePath, plugin, dispatch }) {
  const { line, pos } = useSelector(state => state.log);
  const compiled = useSelector(
    state => state.compiled.byId[plugin.manifest.id]
  );

  useEffect(() => {
    if (!compiled || !line) return;
    const pluginContext = getPluginContext(
      { logFilePath, plugin, line, pos },
      dispatch
    );
    pluginContext.setStatusMessage(
      `${plugin.manifest.id} processing ${pos.start}-${pos.end}`
    );
    compiled.plugin(pluginContext);
  }, [pos]);

  // Compile on first mount
  useEffect(() => {
    const pluginContext = getPluginContext({ logFilePath, plugin }, dispatch);
    dispatch(compilePlugin(plugin.manifest.id, pluginContext));
  }, []);

  return null;
}
