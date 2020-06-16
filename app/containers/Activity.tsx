import React from 'react';
import { connect } from 'react-redux';

import Activity from '../components/Activity';

function ActivityContainer(props: any) {
  return <Activity {...props} />;
}

export default ActivityContainer;
