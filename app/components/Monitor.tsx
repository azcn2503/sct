import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tail } from 'tail';
import { throttle } from 'lodash';

import * as logActions from '../actions/log';
import { compilePlugin, getCompiledPlugin } from '../utils/plugins';
import * as activityActions from '../actions/activity';
import * as statusActions from '../actions/status';
import { Plugin } from '../types';
import { getEnabledPlugins } from '../reducers/plugins';

type MonitorProps = {
  debug?: boolean;
};

/**
 * Monitor component does not render anything visible on screen, but uses
 * React lifecycle hooks to manage file log watching when things change in the app.
 */
function Monitor({ debug }: MonitorProps) {
  const dispatch = useDispatch();
  const registerDamage = args => dispatch(activityActions.registerDamage(args));
  const endEncounter = args => dispatch(activityActions.endEncounter(args));

  // Path to the log file in state
  const logFilePath = useSelector(state => state.settings.logFilePath);

  // Enabled plugins, important to memoise since getEnabledPlugins always returns a new value
  const enabledPlugins = useSelector(state =>
    useMemo(() => getEnabledPlugins(state.plugins), [
      state.plugins.enabledIds,
      state.plugins.byId
    ])
  );

  // Throttled setStatusMessage so we don't bombard the UI with re-renders
  const setStatusMessage = throttle(
    args => dispatch(statusActions.setStatusMessage(args)),
    500
  );

  // Ref to the tail file monitor
  const tail = useRef(null);

  const onLine = (line: string): void => {
    if (!tail.current) return;
    if (!enabledPlugins.length) return;
    const pos = tail.current.queue[0];

    // Process through plugins
    enabledPlugins.forEach(plugin => {
      const compiledPlugin = getCompiledPlugin(plugin.manifest.id);
      if (!compiledPlugin) return;
      if (debug) {
        console.group(`execute plugin`, plugin.manifest.id);
      }
      setStatusMessage(
        `${plugin.manifest.id} processing ${pos.start}-${pos.end}`
      );
      compiledPlugin({
        line,
        logFilePath,
        setStatusMessage,
        plugin,
        pos,
        registerDamage,
        endEncounter
      });
      if (debug) {
        console.groupEnd();
      }
    });
  };

  /**
   * Set up a tail on the log file.
   * We want to re-run this when the log file or the enabled plugins change.
   */
  useEffect(() => {
    if (!enabledPlugins.length) return;
    // Set up a new tail
    if (logFilePath) {
      tail.current = new Tail(logFilePath);
      tail.current.on('line', onLine);
      setStatusMessage(`Monitoring log file for changes`);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      tail.current.off('line', onLine);
      tail.current.unwatch();
      tail.current = null;
    };
  }, [logFilePath, enabledPlugins]);

  // Compile enabled plugins on first mount
  useEffect(() => {
    enabledPlugins.forEach((plugin: Plugin) =>
      compilePlugin({
        id: plugin.manifest.id,
        script: plugin.script
      })
    );
  }, []);

  return null;
}

export default Monitor;
