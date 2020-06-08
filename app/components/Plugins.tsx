import React, { ChangeEvent } from 'react';
import fs from 'fs';
import path from 'path';

import styles from './Plugins.scss';
import { Plugin } from '../types';

type PluginsProps = {
  enabledPlugins: Plugin[];
  plugins: Plugin[];
  addPlugin(plugin: Plugin): void;
  enablePlugin({ id: string }: any): void;
  disablePlugin({ id: string }: any): void;
};

function Plugins(props: PluginsProps) {
  function isPluginEnabled(plugin: Plugin): boolean {
    return props.enabledPlugins.some(p => p.manifest.id === plugin.manifest.id);
  }

  async function onChangeFile(e: any) {
    const [file] = e.target.files || [];
    if (!file) return;
    const folderPath = path.dirname(file.path);
    try {
      const manifestData = fs.readFileSync(file.path, { encoding: 'utf8' });
      const manifest = JSON.parse(manifestData);
      const pluginPath = path.resolve(folderPath, manifest.plugin);
      const pluginData = fs.readFileSync(pluginPath, { encoding: 'utf8' });
      props.addPlugin({
        manifest,
        path: folderPath,
        script: pluginData
      });
    } catch (ex) {
      console.error('Error loading plugin', ex);
    }
  }

  function onClickTogglePlugin(e: React.MouseEvent, plugin: Plugin) {
    if (isPluginEnabled(plugin)) {
      props.disablePlugin({ id: plugin.manifest.id });
    } else {
      props.enablePlugin({ id: plugin.manifest.id });
    }
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
                onClick={e => onClickTogglePlugin(e, plugin)}
              >
                {isPluginEnabled(plugin) ? 'Disable' : 'Enable'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Plugins;
