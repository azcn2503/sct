import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';

import Tabs from './Tabs';
import Tab from './Tab';
import styles from './Plugins.scss';
import { Plugin } from '../types';
import { compilePluginMetadata } from '../utils/plugins';

type PluginsProps = {
  enabledPlugins: Plugin[];
  plugins: Plugin[];
  addPlugin(plugin: Plugin): void;
  enablePlugin({ id: string }: any): void;
  disablePlugin({ id: string }: any): void;
};

function Plugins(props: PluginsProps) {
  const [activePluginTab, setActivePluginTab] = useState(null);

  useEffect(() => {
    if (props.plugins.length && !activePluginTab) {
      setActivePluginTab(props.plugins[0].manifest.id);
    }
  }, [props.plugins]);

  function isPluginEnabled(plugin: Plugin): boolean {
    return props.enabledPlugins.some(p => p.manifest.id === plugin.manifest.id);
  }

  async function onChangeFile(e: any) {
    const [file] = e.target.files || [];
    if (!file) return;
    const folderPath = path.dirname(file.path);
    try {
      const pluginData = fs.readFileSync(file.path, { encoding: 'utf8' });
      if (!pluginData) return;
      const { manifest, settings } = compilePluginMetadata(pluginData);
      props.addPlugin({
        manifest,
        settings,
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

  const activePlugin = props.plugins.find(
    p => p.manifest.id === activePluginTab
  );

  return (
    <div className={styles.plugins}>
      <h3>Load plugin</h3>
      <div>
        Load plugin: <input type="file" onChange={onChangeFile} />
      </div>
      <h3>Plugins</h3>
      {props.plugins.length > 0 && (
        <>
          <Tabs
            value={activePluginTab}
            onChange={value => setActivePluginTab(value)}
          >
            {props.plugins.map(plugin => (
              <Tab key={plugin.manifest.id} value={plugin.manifest.id}>
                {isPluginEnabled(plugin) && (
                  <span className={styles.enabledPlugin} />
                )}
                {plugin.manifest.name}
              </Tab>
            ))}
          </Tabs>
          {activePlugin && (
            <div className={styles.pluginDetails}>
              {activePlugin.manifest.id} - {activePlugin.manifest.name} (
              {activePlugin.script.length} bytes)
              <button
                type="button"
                onClick={e => onClickTogglePlugin(e, activePlugin)}
              >
                {isPluginEnabled(activePlugin) ? 'Disable' : 'Enable'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Plugins;
