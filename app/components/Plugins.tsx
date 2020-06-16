import React, { useState, useEffect, useMemo, useRef } from 'react';
import fs from 'fs';
import path from 'path';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import Tabs from './Tabs';
import Tab from './Tab';
import PluginDetails from './PluginDetails';
import styles from './Plugins.scss';
import { Plugin } from '../types';
import { compilePluginMetadata } from '../utils/plugins';
import {
  addPlugin,
  enablePlugin,
  disablePlugin,
  removePlugin,
  setPluginSettings,
  compilePlugin,
  setPluginReady
} from '../actions/plugins';
import { getEnabledPlugins } from '../reducers/plugins';

function Plugins(props: any) {
  const [activePluginTab, setActivePluginTab] = useState<string | null>(null);
  const dispatch = useDispatch();
  const plugins: Plugin[] = useSelector(state =>
    useMemo(() => Object.values(state.plugins.byId), [state.plugins.byId])
  );
  const enabledPlugins: Plugin[] = useSelector(state =>
    useMemo(() => getEnabledPlugins(state.plugins), [state.plugins.enabledIds])
  );
  const logFilePath: string = useSelector(state => state.settings.logFilePath);

  useEffect(() => {
    if (plugins.length && !activePluginTab) {
      setActivePluginTab(plugins[0].manifest.id);
    }
  }, [plugins]);

  function isPluginEnabled(plugin: Plugin): boolean {
    return enabledPlugins.some(p => p.manifest.id === plugin.manifest.id);
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
          logFilePath
        }
      );
      dispatch(
        addPlugin({
          manifest,
          settingsSchema,
          settings,
          path: folderPath,
          script: pluginString
        })
      );
    } catch (ex) {
      console.error('Error loading plugin', ex);
    }
  }

  function onClickTogglePlugin(e: React.MouseEvent, plugin: Plugin) {
    if (isPluginEnabled(plugin)) {
      dispatch(disablePlugin(plugin.manifest.id));
    } else {
      dispatch(
        compilePlugin(plugin.manifest.id, {
          setPluginReady: args => dispatch(setPluginReady(args)),
          logFilePath
        })
      );
      dispatch(enablePlugin(plugin.manifest.id));
    }
  }

  function onClickRemovePlugin(e: React.MouseEvent, plugin: Plugin) {
    dispatch(removePlugin(plugin.manifest.id));
  }

  const activePlugin = plugins.find(p => p.manifest.id === activePluginTab);

  return (
    <div className={styles.plugins}>
      <h3>Load plugin</h3>
      <div>
        Load plugin: <input type="file" onChange={onChangeFile} />
      </div>
      <h3>Plugins</h3>
      {plugins.length > 0 && (
        <>
          <Tabs
            value={activePluginTab}
            onChange={value => setActivePluginTab(value)}
          >
            {plugins.map(plugin => {
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
            />
          )}
        </>
      )}
    </div>
  );
}

export default Plugins;
