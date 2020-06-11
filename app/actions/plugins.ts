import * as utils from '../utils/plugins';

export const ADD_PLUGIN = 'ADD_PLUGIN';
export const ENABLE_PLUGIN = 'ENABLE_PLUGIN';
export const DISABLE_PLUGIN = 'DISABLE_PLUGIN';
export const REMOVE_PLUGIN = 'REMOVE_PLUGIN';
export const SET_PLUGIN_SETTINGS = 'SET_PLUGIN_SETTINGS';

export function addPlugin({ manifest, path, script, settingsSchema }) {
  return {
    type: ADD_PLUGIN,
    manifest,
    path,
    script,
    settingsSchema
  };
}

export function enablePlugin({ id }) {
  return function enablePluginThunk(dispatch, getState) {
    const { script } = getState().plugins.byId[id];
    utils.compilePlugin({ id, script });
    return dispatch({
      type: ENABLE_PLUGIN,
      id
    });
  };
}

export function disablePlugin({ id }) {
  return {
    type: DISABLE_PLUGIN,
    id
  };
}

export function removePlugin({ id }) {
  return {
    type: REMOVE_PLUGIN,
    id
  };
}

export function setPluginSettings({ id, settings }) {
  return {
    type: SET_PLUGIN_SETTINGS,
    id,
    settings
  };
}
