import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tail } from 'tail';
import { throttle } from 'lodash';

import * as logActions from '../actions/log';
import * as activityActions from '../actions/activity';
import * as statusActions from '../actions/status';
import * as pluginsActions from '../actions/plugins';
import { Plugin } from '../types';
import { getEnabledPlugins } from '../reducers/plugins';
import MonitorPlugin from './MonitorPlugin';
import { getPluginContext } from '../utils/plugins';

type MonitorProps = {
  debug?: boolean;
};

/**
 * Monitor component does not render anything visible on screen, but uses
 * React lifecycle hooks to manage file log watching when things change in the app.
 * It will set up a single file stream watcher (tail) and pass every line received
 * through every enabled plugin.
 * As such, this should be considered the "main" monitor and is crucial for the
 * pseudo-realtime data visualisation.
 * Plugins may also establish their own monitors as part of MonitorPlugin, rendered
 * by this component.
 */
function Monitor({ debug }: MonitorProps) {
  const dispatch = useDispatch();

  // Path to the log file in state
  const logFilePath = useSelector(state => state.settings.logFilePath);

  // The current zone name
  const zoneName = useSelector(state => state.activity.zoneName);

  // Enabled plugins, important to memoise since getEnabledPlugins always returns a new value
  const enabledPlugins = useSelector(state =>
    useMemo(() => getEnabledPlugins(state.plugins), [
      state.plugins.enabledIds,
      state.plugins.byId
    ])
  );

  const compiledPlugins = useSelector(state => state.compiled.byId);

  // Ref to the tail file monitor
  const tail = useRef(null);

  const onLine = (line: string, reverse): void => {
    if (reverse) {
      // scan in reverse
    } else {
      if (!tail.current) return;
      if (!enabledPlugins.length) return;
      const pos = tail.current.queue[0];

      // Process through plugins
      enabledPlugins.forEach(plugin => {
        const compiled = compiledPlugins[plugin.manifest.id];
        if (!compiled || !compiled.plugin) return;
        if (debug) {
          console.group(`execute plugin`, plugin.manifest.id);
        }
        const pluginContext = getPluginContext(
          { logFilePath, plugin, line, pos },
          dispatch
        );
        pluginContext.setStatusMessage(
          `${plugin.manifest.id} processing ${pos.start}-${pos.end}`
        );
        compiled.plugin(pluginContext);
        if (debug) {
          console.groupEnd();
        }
      });
    }
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
      tail.current.on('line', line => onLine(line, false));
    }

    // eslint-disable-next-line consistent-return
    return () => {
      if (tail.current) {
        tail.current.off('line', onLine);
        tail.current.unwatch();
        tail.current = null;
      }
    };
  }, [logFilePath, enabledPlugins, zoneName]);

  // Compile enabled plugins on first mount
  useEffect(() => {
    enabledPlugins.forEach((plugin: Plugin) => {
      const pluginContext = getPluginContext({ logFilePath, plugin }, dispatch);
      dispatch(pluginsActions.compilePlugin(plugin.manifest.id, pluginContext));
    });
  }, []);

  return enabledPlugins.map(plugin => (
    <MonitorPlugin
      key={plugin.manifest.id}
      pluginId={plugin.manifest.id}
      logFilePath={logFilePath}
    />
  ));
}

export default Monitor;
