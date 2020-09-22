import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { clone, throttle } from 'lodash';

import { setStatusMessage } from '../actions/status';
import { compilePlugin } from '../actions/plugins';
import { getPluginEnv } from '../utils/plugins';

/**
 * MonitorPlugin will establish a reverse file stream on the log file.
 * There will be one MonitorPlugin component per enabled plugin.
 */
export default function MonitorPlugin({ logFilePath, plugin, dispatch, tail }) {
  const setStatusMessageThrottled = useRef(
    throttle(args => dispatch(setStatusMessage(args)), 1000)
  );
  const compiled = useSelector(
    state => state.compiled.byId[plugin.manifest.id]
  );
  const isEnabled = useSelector(state =>
    state.plugins.enabledIds.includes(plugin.manifest.id)
  );

  function onLine(line) {
    if (!compiled) return;
    const pos = clone(tail.queue[0]);
    const pluginEnv = getPluginEnv(
      { logFilePath, plugin, line, pos },
      dispatch
    );
    setStatusMessageThrottled.current(
      `${plugin.manifest.id} processing ${pos.start}-${pos.end}`
    );
    compiled.plugin(pluginEnv);
  }

  useEffect(() => {
    if (tail) {
      tail.on('line', onLine);
    }
  }, [tail]);

  // Compile on first mount
  useEffect(() => {
    if (compiled) return;
    const pluginEnv = getPluginEnv({ logFilePath, plugin }, dispatch);
    dispatch(compilePlugin(plugin.manifest.id, pluginEnv));
  }, []);

  // Compile if log file changes and plugin is enabled
  useEffect(() => {
    if (!isEnabled || !logFilePath) return;
    const pluginEnv = getPluginEnv({ logFilePath, plugin }, dispatch);
    dispatch(compilePlugin(plugin.manifest.id, pluginEnv));
  }, [logFilePath]);

  return null;
}
