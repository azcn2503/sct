import React from 'react';
import classNames from 'classnames';

import styles from './Button.scss';

export default function Button(props: any) {
  return (
    <button
      type="button"
      {...props}
      className={classNames(styles.button, props.className)}
    />
  );
}
