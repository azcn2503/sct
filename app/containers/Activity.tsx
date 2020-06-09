import React from 'react';
import { connect } from 'react-redux';

import Activity from '../components/Activity';
import { selectEncounter } from '../actions/activity';

function mapStateToProps(state: any) {
  return {
    encounters: state.activity.encounters,
    selectedEncounter: state.activity.encounters.find(
      encounter => encounter.id === state.activity.selectedEncounterId
    )
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectEncounter: args => dispatch(selectEncounter(args))
  };
}

function ActivityContainer(props: any) {
  return <Activity {...props} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityContainer);
