import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import settings from './settings';
import log from './log';
import plugins from './plugins';
import activity from './activity';
import status from './status';
import compiled from './compiled';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    settings,
    log,
    plugins,
    activity,
    status,
    compiled
  });
}

export type RootState = ReturnType<typeof createRootReducer>;
