import * as actions from '../actions/log';

export const defaultState = {
  lastLogLine: null
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.SET_LAST_LOG_LINE:
      return {
        lastLogLine: action.line
      };

    default:
      return state;
  }
}
