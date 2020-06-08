import React from 'react';

import styles from './Settings.scss';

export default function Settings(props: any) {
  return (
    <div className={styles.settings}>
      Path to log file:{' '}
      <input
        type="file"
        onChange={e => {
          if (e.target.files) {
            props.setLogFilePath(e.target.files[0].path);
          }
        }}
      />
    </div>
  );
}
