import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

import * as activityActions from '../actions/activity';
import styles from './Activity.scss';
import { DatabaseContext } from '../context/Database';

export default function Activity(props: any) {
  const db = useContext(DatabaseContext);
  const dispatch = useDispatch();
  const encounters = useSelector(state => state.activity.encounters);
  const selectedEncounter = useSelector(state =>
    useMemo(
      () =>
        state.activity.encounters.find(
          encounter => encounter.id === state.activity.selectedEncounterId
        ),
      [state.activity.selectedEncounterId]
    )
  );
  const selectEncounter = args =>
    dispatch(activityActions.selectEncounter(args));
  useEffect(() => {
    if (selectedEncounter && db) {
      db.find({
        selector: {
          encounterId: selectedEncounter.id
        }
      })
        .then(results => {
          console.log('~ results', results);
          return results;
        })
        .catch(err => {
          console.error('~ db error', err);
        });
    }
  }, [selectedEncounter]);
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.encounterList}>
        {encounters.map(encounter => (
          <li
            key={encounter.id}
            className={classNames(styles.encounter, {
              [styles.isActive]:
                selectedEncounter && encounter.id === selectedEncounter.id
            })}
          >
            <button
              type="button"
              onClick={() =>
                selectEncounter({
                  id: encounter.id
                })
              }
            >
              {moment(encounter.startTime).format('YY-MM-DD HH:mm:ss')}{' '}
              {encounter.targetName}
              {encounter.endTime &&
                ` (${Math.round(
                  encounter.endTime / 1000 - encounter.startTime / 1000
                )}s)`}
            </button>
          </li>
        ))}
      </div>
      <div className={styles.resultView}>
        {selectedEncounter &&
          selectedEncounter.activity.map((activity, activityKey) => (
            <div key={activityKey}>
              {Object.entries(activity).map(([key, value]) => (
                <div key={key}>
                  {key}: <b>{value !== undefined && value.toString()}</b>
                </div>
              ))}
              <hr />
            </div>
          ))}
      </div>
    </div>
  );
}
