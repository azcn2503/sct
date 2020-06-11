import { uniq } from 'lodash';

import * as actions from '../actions/plugins';

export const defaultState = {
  byId: {},
  enabledIds: []
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.ADD_PLUGIN: {
      const { manifest, path, script, settingsSchema } = action;
      return {
        ...state,
        byId: {
          ...state.byId,
          [manifest.id]: {
            manifest,
            path,
            script,
            settingsSchema
          }
        }
      };
    }

    case actions.ENABLE_PLUGIN: {
      return {
        ...state,
        enabledIds: uniq([...state.enabledIds, action.id])
      };
    }

    case actions.DISABLE_PLUGIN: {
      return {
        ...state,
        enabledIds: state.enabledIds.filter(id => id !== action.id)
      };
    }

    case actions.SET_PLUGIN_SETTINGS: {
      const { id, settings } = action;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            settings
          }
        }
      };
    }

    default:
      return state;
  }
}
