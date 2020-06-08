import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Settings from './containers/Settings';
import Plugins from './containers/Plugins';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.HOME.path} exact component={HomePage} />
        <Route path={routes.SETTINGS.path} exact component={Settings} />
        <Route path={routes.PLUGINS.path} exact component={Plugins} />
      </Switch>
    </App>
  );
}
