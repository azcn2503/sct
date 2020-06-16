import React, { useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import { setPluginSettings } from '../actions/plugins';
import Button from './Button';
import Form from './Form';

import styles from './PluginDetails.scss';

function PluginSettings({ plugin }: any) {
  const dispatch = useDispatch();
  const debouncedSetPluginSettings = useRef(
    debounce(args => dispatch(setPluginSettings(args)), 500)
  );
  const filteredSettingsSchema = useMemo(
    () => plugin.settingsSchema.filter(f => !f.hidden),
    [plugin.settingsSchema]
  );
  return (
    <>
      <h3>Plugin settings</h3>
      {filteredSettingsSchema.length > 0 ? (
        <Form
          config={filteredSettingsSchema}
          values={plugin.settings}
          onChange={settings =>
            debouncedSetPluginSettings.current({
              id: plugin.manifest.id,
              settings
            })
          }
        />
      ) : (
        <div className={styles.noSettings}>
          This plugin does not provide any configurable settings.
        </div>
      )}
    </>
  );
}

export default function PluginDetails(props: any) {
  const manifest = {
    ...props.plugin.manifest,
    size: `${props.plugin.script.length} bytes`
  };
  return (
    <div className={styles.pluginDetails}>
      <table>
        <tbody>
          {Object.entries(manifest).map(([key, value]) => (
            <tr key={key}>
              <td>{key}:</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={props.onClickTogglePlugin}>
        {props.isEnabled ? 'Disable' : 'Enable'}
      </Button>{' '}
      <Button type="button" onClick={props.onClickRemovePlugin}>
        Remove
      </Button>
      <PluginSettings plugin={props.plugin} />
    </div>
  );
}
