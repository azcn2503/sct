import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Tail } from 'tail';

import * as logActions from '../actions/log';
import { compilePlugin, getCompiledPlugin } from '../utils/plugins';
import * as activityActions from '../actions/activity';
import { Plugin } from '../types';

function mapStateToProps(state) {
  return {
    logFilePath: state.settings.logFilePath,
    enabledPlugins: state.plugins.enabledIds.map(id => state.plugins.byId[id])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLastLogLine: args => dispatch(logActions.setLastLogLine(args)),
    registerDamage: args => dispatch(activityActions.registerDamage(args)),
    registerActorNameRewrite: args =>
      dispatch(activityActions.registerActorNameRewrite(args))
  };
}

function Monitor({
  debug,
  enabledPlugins,
  logFilePath,
  setLastLogLine,
  registerDamage,
  registerActorNameRewrite
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
        logFilePath,
        setLastLogLine,
        registerDamage,
        registerActorNameRewrite
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

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);