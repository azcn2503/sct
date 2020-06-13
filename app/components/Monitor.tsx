import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tail } from 'tail';

import { getEnabledPlugins } from '../reducers/plugins';
import MonitorPlugin from './MonitorPlugin';

/**
 * Monitor component does not render anything visible on screen, but uses
 * React lifecycle hooks to manage file log watching when things change in the app.
 * It will set up a single file stream watcher (tail) for each MonitorPlugin component.
 * The MonitorPlugin child components will be responsible for passing the log file
 * line through to their respective plugin.
 */
function Monitor(props: any) {
  const dispatch = useDispatch();

  // Path to the log file in state
  const logFilePath = useSelector(state => state.settings.logFilePath);

  // Enabled plugins, important to memoise since getEnabledPlugins always returns a new value
  const enabledPlugins = useSelector(state =>
    useMemo(() => getEnabledPlugins(state.plugins), [
      state.plugins.enabledIds,
      state.plugins.byId
    ])
  );

  const [tail, setTail] = useState(null);

  function startTail() {
    if (!tail) {
      console.debug('Starting log monitor');
      setTail(new Tail(logFilePath));
    }
  }

  function stopTail() {
    if (tail) {
      console.debug('Stopping log monitor');
      tail.unwatch();
      setTail(null);
    }
  }

  /**
   * Start logging if we have enabled plugins and a log file.
   * Stop logging if we do not have any enabled plugins, or a log file.
   */
  useEffect(() => {
    if (!enabledPlugins.length || !logFilePath) {
      stopTail();
      return;
    }

    startTail();
  }, [logFilePath, enabledPlugins]);

  return enabledPlugins.map(plugin => (
    <MonitorPlugin
      key={plugin.manifest.id}
      plugin={plugin}
      logFilePath={logFilePath}
      dispatch={dispatch}
      tail={tail}
    />
  ));
}

export default Monitor;
