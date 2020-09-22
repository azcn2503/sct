import React from 'react';
import { useSelector } from 'react-redux';

import { TriggerAction } from '../reducers/triggers';
import Form from './Form';
import styles from './Triggers.scss';

export default function TriggersComponent(props: any) {
  const actions: TriggerAction[] = useSelector(
    (state: any) => state.triggers.actions
  );
  return (
    <div className={styles.triggers}>
      <h3>Triggers</h3>
      <table className={styles.triggersTable}>
        <tr>
          <td>
            <fieldset>
              <legend>New trigger</legend>
              <Form
                config={[
                  {
                    id: 'pattern',
                    label: 'Pattern'
                  },
                  {
                    id: 'command',
                    label: 'Command'
                  }
                ]}
                onChange={e => console.log(e)}
              />
            </fieldset>
          </td>
        </tr>
        {actions.map((action, key) => (
          <tr key={key}>
            <td>
              <fieldset>
                <legend>Trigger {key}</legend>
                Pattern: <input type="text" value={action.pattern} />
                Command: <input type="text" value={action.command} />
              </fieldset>
            </td>
            <td>
              <button type="button">Delete</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
