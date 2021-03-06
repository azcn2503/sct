import React, { useRef } from 'react';
import fsR from 'fs-reverse';
import { noop, throttle } from 'lodash';

import * as activityActions from '../actions/activity';
import * as pluginsActions from '../actions/plugins';
import * as statusActions from '../actions/status';

import { Plugin, PluginContext } from '../types';

const streams = {};

function generateDefaultSettings(settingsSchema = [], context: PluginContext) {
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

export function stopScanReverse(id) {
  if (streams[id]) {
    console.debug('Stopping reverse scan');
    streams[id].destroy();
    delete streams[id];
  }
}

export function scanReverse(id, context) {
  if (!context.logFilePath) return;

  console.debug('Starting reverse scan');
  streams[id] = fsR(context.logFilePath);
  streams[id].on('data', line => {
    if (!streams[id]) return;

    context.compiled.scanReverse({
      ...context,
      line
    });
  });
  streams[id].on('end', () => {
    stopScanReverse(id);
  });
}

export function getPluginEnv(baseContext, dispatch) {
  const registerDamage = args =>
    dispatch(activityActions.registerDamage(args, baseContext.plugin));
  const endEncounter = args => dispatch(activityActions.endEncounter(args));
  const setZoneName = zoneName =>
    dispatch(
      pluginsActions.setZoneName({
        id: baseContext.plugin.manifest.id,
        zoneName
      })
    );
  const setStatusMessage = args =>
    dispatch(statusActions.setStatusMessage(args));
  const setPluginReady = () =>
    dispatch(pluginsActions.setPluginReady(baseContext.plugin.manifest.id));
  return {
    ...baseContext,
    registerDamage,
    endEncounter,
    setZoneName,
    setStatusMessage,
    setPluginReady
  };
}
