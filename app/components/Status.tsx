import React from 'react';
import { useSelector } from 'react-redux';

import styles from './Status.css';

function Status(props: any) {
  const { message } = useSelector(state => state.status);
  return <div className={styles.status}>{message || 'No activity'}</div>;
}

export default Status;
