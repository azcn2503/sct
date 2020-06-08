import React from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import styles from './Activity.css';

type ActivityProps = {
  lastLogLine: string;
};

function Activity({ lastLogLine }: ActivityProps) {
  return <div className={styles.activity}>{lastLogLine || 'No activity'}</div>;
}

function mapStateToProps(state) {
  return {
    lastLogLine: state.log.lastLogLine
  };
}

const throttledMapStateToProps = throttle(mapStateToProps, 1000);

export default connect(throttledMapStateToProps)(Activity);
