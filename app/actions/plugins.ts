import * as utils from '../utils/plugins';
import { Plugin } from '../types';

export const ADD_PLUGIN = 'ADD_PLUGIN';
export const ENABLE_PLUGIN = 'ENABLE_PLUGIN';
export const DISABLE_PLUGIN = 'DISABLE_PLUGIN';
export const REMOVE_PLUGIN = 'REMOVE_PLUGIN';
export const SET_PLUGIN_SETTINGS = 'SET_PLUGIN_SETTINGS';

export function addPlugin({
  manifest,
  path,
  script,
  settingsSchema,
  settings
}: Plugin) {
  return {
    type: ADD_PLUGIN,
    manifest,
    path,
    script,
    settingsSchema,
    settings
  };
}

export function enablePlugin(id) {
  return function enablePluginThunk(dispatch, getState) {
    const { script } = getState().plugins.byId[id];
    const compiled = utils.compilePlugin(script);
    return dispatch({
      type: ENABLE_PLUGIN,
      id,
      compiled
    });
  };
}

export function disablePlugin(id) {
  return {
    type: DISABLE_PLUGIN,
    id
  };
}

export function removePlugin(id) {
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

export function setZoneName({ id, zoneName }) {
  return (dispatch, getState) => {
    const { settings } = getState().plugins.byId[id];
    return dispatch(
      setPluginSettings({
        id,
        settings: {
          ...settings,
          zoneName
        }
      })
    );
  };
}
