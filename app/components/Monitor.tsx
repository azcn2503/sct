import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tail } from 'tail';
import { clone } from 'lodash';

import * as logActions from '../actions/log';
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

  // Ref to the tail file monitor
  const tail = useRef(null);

  function onLine(line: string): void {
    if (!tail.current) return;
    const pos = clone(tail.current.queue[0]);
    dispatch(logActions.setLastLogLine({ line, pos }));
  }

  function startTail() {
    console.debug('Starting log monitor');
    tail.current = new Tail(logFilePath);
    tail.current.on('line', onLine);
  }

  function stopTail() {
    if (tail.current) {
      console.debug('Stopping log monitor');
      tail.current.off('line', onLine);
      tail.current.unwatch();
      tail.current = null;
    }
  }

  /**
   * Set up a tail on the log file.
   * We want to re-run this when the log file or the enabled plugins change.
   */
  useEffect(() => {
    if (!enabledPlugins.length || !logFilePath) {
      stopTail();
      return;
    }

    startTail();

    // eslint-disable-next-line consistent-return
    return () => {
      stopTail();
    };
  }, [logFilePath, enabledPlugins]);

  return enabledPlugins.map(plugin => (
    <MonitorPlugin
      key={plugin.manifest.id}
      plugin={plugin}
      logFilePath={logFilePath}
      dispatch={dispatch}
    />
  ));
}

export default Monitor;
