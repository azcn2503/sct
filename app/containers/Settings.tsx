import React from 'react';
import { connect } from 'react-redux';

import SettingsComponent from '../components/Settings';
import { setLogFilePath } from '../actions/settings';
import { getEnabledPlugins } from '../reducers/plugins';
import { addPlugin } from '../actions/plugins';

function mapStateToProps(state) {
  return {
    ...state.settings,
    enabledPlugins: getEnabledPlugins(state.plugins)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLogFilePath: args => dispatch(setLogFilePath(args)),
    addPlugin: args => dispatch(addPlugin(args))
  };
}

function SettingsContainer(props) {
  return <SettingsComponent {...props} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
