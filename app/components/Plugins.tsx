import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import classNames from 'classnames';

import Tabs from './Tabs';
import Tab from './Tab';
import PluginDetails from './PluginDetails';
import styles from './Plugins.scss';
import { Plugin } from '../types';
import { compilePluginMetadata } from '../utils/plugins';

type PluginsProps = {
  enabledPlugins: Plugin[];
  plugins: Plugin[];
  addPlugin(plugin: Plugin): void;
  enablePlugin(id: string): void;
  disablePlugin(id: string): void;
  removePlugin(id: string): void;
  logFilePath: string;
  setPluginSettings(settings: any): void;
};

function Plugins(props: PluginsProps) {
  const [activePluginTab, setActivePluginTab] = useState<string | null>(null);

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
      const pluginString = fs.readFileSync(file.path, { encoding: 'utf8' });
      if (!pluginString) return;
      const { manifest, settingsSchema, settings } = compilePluginMetadata(
        pluginString,
        {
          logFilePath: props.logFilePath
        }
      );
      props.addPlugin({
        manifest,
        settingsSchema,
        settings,
        path: folderPath,
        script: pluginString
      });
    } catch (ex) {
      console.error('Error loading plugin', ex);
    }
  }

  function onClickTogglePlugin(e: React.MouseEvent, plugin: Plugin) {
    if (isPluginEnabled(plugin)) {
      props.disablePlugin(plugin.manifest.id);
    } else {
      props.compilePlugin(plugin.manifest.id, {
        setPluginReady: props.setPluginReady,
        logFilePath: props.logFilePath
      });
      props.enablePlugin(plugin.manifest.id);
    }
  }

  function onClickRemovePlugin(e: React.MouseEvent, plugin: Plugin) {
    props.removePlugin(plugin.manifest.id);
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
            {props.plugins.map(plugin => {
              const isEnabled = isPluginEnabled(plugin);
              return (
                <Tab key={plugin.manifest.id} value={plugin.manifest.id}>
                  <span
                    className={classNames(styles.indicator, {
                      [styles.isEnabled]: isEnabled,
                      [styles.isDisabled]: !isEnabled
                    })}
                  />
                  <i className="fa-icon" /> {plugin.manifest.name}
                </Tab>
              );
            })}
          </Tabs>
          {activePlugin && (
            <PluginDetails
              plugin={activePlugin}
              isEnabled={isPluginEnabled(activePlugin)}
              onClickTogglePlugin={e => onClickTogglePlugin(e, activePlugin)}
              onClickRemovePlugin={e => onClickRemovePlugin(e, activePlugin)}
              setPluginSettings={props.setPluginSettings}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Plugins;
