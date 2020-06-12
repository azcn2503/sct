import * as actions from '../actions/status';
import * as pluginActions from '../actions/plugins';

const defaultState = {
  message: null
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.SET_STATUS_MESSAGE:
      return {
        ...state,
        message: action.message
      };

    case pluginActions.ADD_PLUGIN: {
      return {
        ...state,
        message: `Plugin added: ${action.manifest.id}`
      };
    }

    case pluginActions.ENABLE_PLUGIN: {
      return {
        ...state,
        message: `Plugin enabled: ${action.id}`
      };
    }

    case pluginActions.DISABLE_PLUGIN: {
      return {
        ...state,
        message: `Plugin disabled: ${action.id}`
      };
    }

    case pluginActions.REMOVE_PLUGIN: {
      return {
        ...state,
        message: `Plugin removed: ${action.id}`
      };
    }

    default:
      return state;
  }
}
