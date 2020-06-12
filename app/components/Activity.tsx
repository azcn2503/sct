import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './Activity.scss';

export default function Activity(props: any) {
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.encounterList}>
        {props.encounters.map(encounter => (
          <li
            key={encounter.id}
            className={classNames(styles.encounter, {
              [styles.isActive]:
                props.selectedEncounter &&
                encounter.id === props.selectedEncounter.id
            })}
          >
            <button
              type="button"
              onClick={() =>
                props.selectEncounter({
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
        {props.selectedEncounter &&
          props.selectedEncounter.activity.map((activity, activityKey) => (
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
