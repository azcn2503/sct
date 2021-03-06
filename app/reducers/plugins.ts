import { uniq, omit } from 'lodash';

import * as actions from '../actions/plugins';
import { Plugin } from '../types';

type PluginsState = {
  byId: {
    [key: string]: any;
  };
  enabledIds: string[];
  selectedPluginId: string | null;
};

export const defaultState: PluginsState = {
  byId: {},
  enabledIds: [],
  selectedPluginId: null
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.ADD_PLUGIN: {
      const { manifest, path, script, settingsSchema = [], settings } = action;
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
        },
        selectedPluginId: manifest.id
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
        enabledIds: state.enabledIds.filter(id => id !== action.id),
        selectedPluginId: (() => {
          if (
            action.id === state.selectedPluginId &&
            Object.keys(state.byId).length > 1
          ) {
            return Object.keys(state.byId)[0];
          }
          return state.selectedPluginId;
        })()
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

    case actions.SET_SELECTED_PLUGIN_ID:
      return {
        ...state,
        selectedPluginId: action.id
      };

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
