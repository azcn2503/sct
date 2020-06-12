import React from 'react';

import Button from './Button';
import Form from './Form';

import styles from './PluginDetails.scss';

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
      {props.plugin.settingsSchema.length > 0 && (
        <>
          <h3>Plugin settings</h3>
          <Form
            config={props.plugin.settingsSchema}
            values={props.plugin.settings}
            onChange={settings =>
              props.setPluginSettings({
                id: props.plugin.manifest.id,
                settings
              })
            }
          />
        </>
      )}
    </div>
  );
}
