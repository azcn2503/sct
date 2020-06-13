import * as actions from '../actions/log';

export const defaultState = {
  line: null,
  pos: {}
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.SET_LAST_LOG_LINE: {
      const { line, pos } = action;
      return {
        line,
        pos
      };
    }

    default:
      return state;
  }
}
