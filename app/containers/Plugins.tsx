import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import Plugins from '../components/Plugins';
import {
  addPlugin,
  enablePlugin,
  disablePlugin,
  removePlugin,
  setPluginSettings
} from '../actions/plugins';

function mapStateToProps(state) {
  return {
    plugins: Object.values(state.plugins.byId),
    enabledPlugins: state.plugins.enabledIds.map(id => state.plugins.byId[id]),
    logFilePath: state.settings.logFilePath
  };
}

function mapDispatchToProps(dispatch) {
  const debouncedSetPluginSettings = debounce(
    args => dispatch(setPluginSettings(args)),
    500
  );
  return {
    addPlugin: args => dispatch(addPlugin(args)),
    enablePlugin: args => dispatch(enablePlugin(args)),
    disablePlugin: args => dispatch(disablePlugin(args)),
    removePlugin: args => dispatch(removePlugin(args)),
    setPluginSettings: debouncedSetPluginSettings
  };
}

function PluginsContainer(props) {
  return <Plugins {...props} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(PluginsContainer);
