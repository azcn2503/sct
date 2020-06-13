import * as pluginsActions from '../actions/plugins';

const defaultState = {
  byId: {}
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case pluginsActions.COMPILE_PLUGIN: {
      const { id, compiled } = action;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...(state.byId[id] || {}),
            ...compiled
          }
        }
      };
    }

    case pluginsActions.SET_PLUGIN_READY: {
      const { id } = action;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            ready: true
          }
        }
      };
    }

    default:
      return state;
  }
}
