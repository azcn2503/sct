import React from 'react';
import { connect } from 'react-redux';

import SettingsComponent from '../components/Settings';
import { setLogFilePath } from '../actions/settings';

function mapStateToProps(state) {
  return state.settings;
}

function mapDispatchToProps(dispatch) {
  return {
    setLogFilePath: args => dispatch(setLogFilePath(args))
  };
}

function SettingsContainer(props) {
  return <SettingsComponent {...props} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
