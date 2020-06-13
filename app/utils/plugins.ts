import fsR from 'fs-reverse';
import { noop, throttle } from 'lodash';

import * as activityActions from '../actions/activity';
import * as pluginsActions from '../actions/plugins';
import * as statusActions from '../actions/status';

import { Plugin, PluginContext } from '../types';

const streams = {};

function generateDefaultSettings(settingsSchema, context: PluginContext) {
  const contextKeys = Object.keys(context);
  const settings = {};
  if (context.plugin) {
    // Plugin is being rebuilt, so only update settings that track changed keys
    settingsSchema.forEach(field => {
      if (
        field.updateOn &&
        field.updateOn.some(key => contextKeys.includes(key))
      ) {
        settings[field.id] = field.defaultValue;
      }
    });
  } else {
    settingsSchema.forEach(field => {
      settings[field.id] = field.defaultValue;
    });
  }
  return settings;
}

/**
 * Compile plugin metadata. This gets called when adding a new plugin so we know the plugin details
 * from its manifest, load its settings schema and display the plugin configuration so the user can
 * change the settings before enabling it.
 */
export function compilePluginMetadata(
  script: string,
  context: PluginContext
): Partial<Plugin> {
  try {
    const { manifest = noop, settingsSchema = noop } = eval(script) || {};
    const compiledSettingsSchema = settingsSchema(context);
    const settings = generateDefaultSettings(compiledSettingsSchema, context);
    return {
      manifest: manifest(context),
      settingsSchema: compiledSettingsSchema,
      settings
    };
  } catch (ex) {
    console.error('Plugin metadata failed', ex);
    throw ex;
  }
}

/**
 * We compile the parts of the script we need for execution. This gets called when a plugin is enabled.
 */
export function compilePlugin(script: string) {
  try {
    const evaled = eval(script) || {};
    return evaled;
  } catch (ex) {
    console.error('Plugin compile failed', ex);
    throw ex;
  }
}

export function scanReverse(id, context) {
  streams[id] = fsR(context.logFilePath);
  streams[id].on('data', line => {
    context.compiled.scanReverse({
      ...context,
      line
    });
  });
}

export function stopScanReverse(id) {
  if (streams[id]) {
    streams[id].destroy();
    delete streams[id];
  }
}

export function getPluginContext(baseContext, dispatch) {
  const registerDamage = args => dispatch(activityActions.registerDamage(args));
  const endEncounter = args => dispatch(activityActions.endEncounter(args));
  const setZoneName = args => dispatch(pluginsActions.setZoneName(args));
  const setStatusMessage = throttle(
    args => dispatch(statusActions.setStatusMessage(args)),
    500
  );
  return {
    ...baseContext,
    registerDamage,
    endEncounter,
    setZoneName,
    setStatusMessage
  };
}
