import fs from 'fs';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import { getSettings } from './persistence-middleware';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

let initialState = getSettings();

try {
  const settings = fs.readFileSync('settings.json', { encoding: 'utf8' });
  initialState = JSON.parse(settings);
} catch (ex) {
  console.error('Could not parse settings.json', ex);
}

function configureStore(): Store {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
