import React, { ChangeEvent } from 'react';
import fs from 'fs';
import path from 'path';

import styles from './Plugins.scss';
import { Plugin } from '../types';

type PluginsProps = {
  enabledPlugins: Plugin[];
  plugins: Plugin[];
  addPlugin(plugin: Plugin): void;
};

function Plugins(props: PluginsProps) {
  function onChangeFile(e: any) {
    const [file] = e.target.files || [];
    if (!file) return;
    const folderPath = path.dirname(file.path);
    fs.readFile(
      file.path,
      { encoding: 'utf8' },
      (manifestErr, manifestData) => {
        if (manifestErr) return;
        const manifest = JSON.parse(manifestData);
        const pluginPath = path.resolve(folderPath, manifest.plugin);
        fs.readFile(
          pluginPath,
          { encoding: 'utf8' },
          (pluginErr, pluginData) => {
            if (pluginErr) return;
            props.addPlugin({
              manifest,
              path: folderPath,
              script: pluginData
            });
          }
        );
      }
    );
  }

  return (
    <div className={styles.plugins}>
      <h3>Load plugin</h3>
      <div>
        Load plugin: <input type="file" onChange={onChangeFile} />
      </div>
      <h3>Plugins</h3>
      {props.plugins.length > 0 && (
        <ul>
          {props.plugins.map(plugin => (
            <li key={plugin.manifest.id}>
              {plugin.manifest.id} - {plugin.manifest.name} (
              {plugin.script.length} bytes)
              <button
                type="button"
                onClick={() => props.enablePlugin({ id: plugin.manifest.id })}
              >
                Enable
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Plugins;
