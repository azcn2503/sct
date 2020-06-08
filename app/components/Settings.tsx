import React from 'react';

import styles from './Settings.scss';

export default function Settings(props: any) {
  return (
    <div className={styles.settings}>
      <h3>Monitor log file</h3>
      <input
        type="file"
        onChange={e => {
          if (e.target.files) {
            props.setLogFilePath(e.target.files[0].path);
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
