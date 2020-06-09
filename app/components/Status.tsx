import React from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import styles from './Status.css';

type StatusProps = {
  lastLogLine: string;
};

function Status({ lastLogLine }: StatusProps) {
  return <div className={styles.status}>{lastLogLine || 'No activity'}</div>;
}

function mapStateToProps(state) {
  return {
    lastLogLine: state.log.lastLogLine
  };
}

const throttledMapStateToProps = throttle(mapStateToProps, 1000);

export default connect(throttledMapStateToProps)(Status);
