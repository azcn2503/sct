import React from 'react';
import { connect } from 'react-redux';

import Plugins from '../components/Plugins';
import {
  addPlugin,
  enablePlugin,
  disablePlugin,
  removePlugin
} from '../actions/plugins';

function mapStateToProps(state) {
  return {
    plugins: Object.values(state.plugins.byId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addPlugin: args => dispatch(addPlugin(args)),
    enablePlugin: args => dispatch(enablePlugin(args)),
    disablePlugin: args => dispatch(disablePlugin(args)),
    removePlugin: args => dispatch(removePlugin(args))
  };
}

function PluginsContainer(props) {
  return <Plugins {...props} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(PluginsContainer);
