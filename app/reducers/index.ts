import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import settings from './settings';
import plugins from './plugins';
import activity from './activity';
import status from './status';
import compiled from './compiled';
import triggers from './triggers';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    settings,
    plugins,
    activity,
    status,
    compiled,
    triggers
  });
}

export type RootState = ReturnType<typeof createRootReducer>;
