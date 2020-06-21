import * as utils from '../utils/plugins';
import { Plugin } from '../types';

export const ADD_PLUGIN = 'ADD_PLUGIN';
export const COMPILE_PLUGIN = 'COMPILE_PLUGIN';
export const ENABLE_PLUGIN = 'ENABLE_PLUGIN';
export const DISABLE_PLUGIN = 'DISABLE_PLUGIN';
export const REMOVE_PLUGIN = 'REMOVE_PLUGIN';
export const SET_PLUGIN_SETTINGS = 'SET_PLUGIN_SETTINGS';
export const SET_PLUGIN_READY = 'SET_PLUGIN_READY';
export const SET_SELECTED_PLUGIN_ID = 'SET_SELECTED_PLUGIN_ID';

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

export function setPluginReady(id: string) {
  utils.stopScanReverse(id);
  return {
    type: SET_PLUGIN_READY,
    id
  };
}

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

export function compilePlugin(id, context) {
  return function compilePluginThunk(dispatch, getState) {
    const { script } = getState().plugins.byId[id];
    const compiled = utils.compilePlugin(script);
    dispatch({
      type: COMPILE_PLUGIN,
      id,
      compiled
    });

    if (typeof compiled.init === 'function') {
      const initContext = {
        ...context,
        compiled
      };
      initContext.setZoneName = zoneName =>
        dispatch(setZoneName({ id, zoneName }));
      initContext.initScanReverse = () => utils.scanReverse(id, initContext);
      initContext.setPluginReady = () => dispatch(setPluginReady(id));
      compiled.init(initContext);
    }
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

export function setSelectedPluginId(id) {
  return {
    type: SET_SELECTED_PLUGIN_ID,
    id
  };
}
