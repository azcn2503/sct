import React from 'react';

import Form from './Form';

import styles from './PluginDetails.scss';

export default function PluginDetails(props: any) {
  return (
    <div className={styles.pluginDetails}>
      {props.plugin.manifest.id} - {props.plugin.manifest.name} (
      {props.plugin.script.length} bytes)
      <button type="button" onClick={props.onClickTogglePlugin}>
        {props.isEnabled ? 'Disable' : 'Enable'}
      </button>
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