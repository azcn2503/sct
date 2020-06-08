import * as actions from '../actions/settings';

export const defaultState = {
  logFilePath: null
};

export default function(state = defaultState, action: any) {
  switch (action.type) {
    case actions.SET_LOG_FILE_PATH:
      return {
        logFilePath: action.logFilePath
      };

    default:
      return state;
  }
}
