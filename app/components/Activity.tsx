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
        {props.selectedEncounter && (
          <ul>
            {props.selectedEncounter.activity.map((activity, key) => (
              <li key={key}>{JSON.stringify(activity)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
