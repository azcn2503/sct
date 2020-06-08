import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Tail } from 'tail';

import * as logActions from '../actions/log';
import { getCompiledPlugin } from '../utils/plugins';
import * as activityActions from '../actions/activity';

function mapStateToProps(state) {
  return {
    logFilePath: state.settings.logFilePath,
    enabledPlugins: state.plugins.enabledIds.map(id => state.plugins.byId[id])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLastLogLine: args => dispatch(logActions.setLastLogLine(args)),
    registerDamage: args => dispatch(activityActions.registerDamage(args))
  };
}

function Monitor({
  debug,
  enabledPlugins,
  logFilePath,
  setLastLogLine,
  registerDamage
}: any) {
  const tail = useRef(null);

  function onLine(line: string) {
    // Process through plugins
    enabledPlugins.forEach(plugin => {
      const compiledPlugin = getCompiledPlugin(plugin.manifest.id);
      if (!compiledPlugin) return;
      if (debug) {
        console.group(`execute plugin`, plugin.manifest.id);
      }
      compiledPlugin({
        line,
        setLastLogLine,
        registerDamage
      });
      if (debug) {
        console.groupEnd();
      }
    });

    // And set the last log line for activity tracking
    // props.setLastLogLine(line);
  }

  useEffect(() => {
    // Stop watching if we have an active tail
    if (tail.current) {
      tail.current.unwatch();
    }

    // Set up a new tail
    if (logFilePath) {
      tail.current = new Tail(logFilePath);
      tail.current.on('line', onLine);
    }
  }, [logFilePath, enabledPlugins]);

  return null;
}

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
