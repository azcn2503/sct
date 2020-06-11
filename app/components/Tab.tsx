import React from 'react';
import classNames from 'classnames';

import styles from './Tab.scss';

export type TabProps = {
  isActive: boolean;
  value: string;
  children: React.ReactChildren;
  onChange(value: string): void;
};

export default function Tab(props: TabProps) {
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
