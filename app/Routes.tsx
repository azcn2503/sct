import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import Activity from './containers/Activity';
import Settings from './containers/Settings';
import Plugins from './containers/Plugins';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Redirect exact from="/" to={routes.ACTIVITY.path} />
        <Route path={routes.ACTIVITY.path} exact component={Activity} />
        <Route path={routes.SETTINGS.path} exact component={Settings} />
        <Route path={routes.PLUGINS.path} exact component={Plugins} />
      </Switch>
    </App>
  );
}
