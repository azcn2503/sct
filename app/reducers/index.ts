import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import settings from './settings';
import log from './log';
import plugins from './plugins';
import activity from './activity';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    settings,
    log,
    plugins,
    activity
  });
}
