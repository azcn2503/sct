import React from 'react';

import { compilePluginMetadata } from '../utils/plugins';
import styles from './Settings.scss';
import { Plugin } from '../types';

type SettingsProps = {
  enabledPlugins: Plugin[];
  addPlugin(plugin: Plugin): void;
};

export default function Settings(props: SettingsProps) {
  function reinitialiseEnabledPlugins(logFilePath: string) {
    props.enabledPlugins.forEach(plugin => {
      const { settingsSchema, settings } = compilePluginMetadata(
        plugin.script,
        {
          logFilePath
        }
      );
      props.addPlugin({
        ...plugin,
        settingsSchema,
        settings
      });
    });
  }

  return (
    <div className={styles.settings}>
      <h3>Monitor log file</h3>
      <input
        type="file"
        onChange={e => {
          if (e.target.files) {
            props.setLogFilePath(e.target.files[0].path);
            reinitialiseEnabledPlugins(e.target.files[0].path);
          }
        }}
      />
      <br />
      {props.logFilePath ? (
        <div>Currently monitoring: {props.logFilePath}</div>
      ) : (
        <div>No log file is currently being monitored.</div>
      )}
    </div>
  );
}
