import { uniq, omit } from 'lodash';

import * as actions from '../actions/plugins';
import { Plugin } from '../types';

type PluginsState = {
  byId: {
    [key: string]: any;
  };
  enabledIds: string[];
};

export const defaultState: PluginsState = {
  byId: {},
  enabledIds: []
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.ADD_PLUGIN: {
      const { manifest, path, script, settingsSchema, settings } = action;
      return {
        ...state,
        byId: {
          ...state.byId,
          [manifest.id]: {
            manifest,
            path,
            script,
            settingsSchema,
            settings
          }
        }
      };
    }

    case actions.ENABLE_PLUGIN: {
      const { id } = action;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id]
          }
        },
        enabledIds: uniq([...state.enabledIds, id])
      };
    }

    case actions.DISABLE_PLUGIN: {
      return {
        ...state,
        enabledIds: state.enabledIds.filter(id => id !== action.id)
      };
    }

    case actions.REMOVE_PLUGIN: {
      return {
        ...state,
        byId: omit(state.byId, [action.id]),
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

export function getEnabledPlugins(state: PluginsState): Plugin[] {
  return state.enabledIds.map(id => state.byId[id]);
}

export function getPlugins(state: PluginsState): Plugin[] {
  return Object.values(state.byId);
}
