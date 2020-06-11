import React from 'react';
import classNames from 'classnames';

import styles from './Tab.scss';

export default function Tab(props) {
  return (
    <button
      type="button"
      className={classNames(styles.tab, {
        [styles.isActive]: props.isActive
      })}
      onClick={() => props.onChange(props.value)}
    >
      {props.children}
    </button>
  );
}
