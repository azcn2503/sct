import React, { Children, useState } from 'react';
import classNames from 'classnames';

import Tab from './Tab';
import styles from './Tabs.scss';

export default function Tabs(props) {
  function onChange(value) {
    props.onChange(value);
  }

  return (
    <nav className={styles.tabs}>
      {Children.map(props.children, child => (
        <Tab
          {...child.props}
          isActive={props.value === child.props.value}
          onChange={onChange}
        />
      ))}
    </nav>
  );
}
