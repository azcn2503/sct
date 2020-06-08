import { uniq } from 'lodash';

import * as actions from '../actions/plugins';

export const defaultState = {
  byId: {},
  enabledIds: []
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.ADD_PLUGIN: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.manifest.id]: {
            manifest: action.manifest,
            path: action.path,
            script: action.script
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

    default:
      return state;
  }
}
