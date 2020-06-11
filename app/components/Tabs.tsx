import React, { Children, useState } from 'react';
import classNames from 'classnames';

import Tab, { TabProps } from './Tab';
import styles from './Tabs.scss';

type TabsProps = {
  value?: string;
  children: React.Component & {
    props: TabProps;
  };
  onChange(value: string): void;
};

export default function Tabs(props: TabsProps) {
  function onChange(value: string) {
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
