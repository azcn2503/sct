import { getDatabase } from '../db';

export const REGISTER_DAMAGE = 'REGISTER_DAMAGE';
export const END_ENCOUNTER = 'END_ENCOUNTER';
export const SELECT_ENCOUNTER = 'SELECT_ENCOUNTER';

let encounterActive = false;
let encounterId = 0;
let encounterTimeout = null;

export function endEncounter() {
  return function endEncounterThunk(dispatch) {
    clearTimeout(encounterTimeout);
    dispatch({
      type: END_ENCOUNTER,
      id: encounterId
    });
    encounterId += 1;
    encounterActive = false;
  };
}

export function registerDamage(payload, plugin) {
  const db = getDatabase();
  return dispatch => {
    // Clear the existing encounter timeout if it is set
    clearTimeout(encounterTimeout);

    // End the encounter after 4 seconds
    encounterTimeout = setTimeout(() => {
      dispatch(endEncounter());
    }, plugin.settings.encounterTimeout || 4000);

    const encounterEnrichedPayload = {
      ...payload,
      encounterId
    };

    db.post(encounterEnrichedPayload, (err, response) => {
      // TODO: check this worked
    });

    // Register the damage, creating new encounter if necessary.
    // TODO: once the db stuff is in, remove this, because updating global state on every damage trigger is render overkill.
    dispatch({
      type: REGISTER_DAMAGE,
      isNew: !encounterActive,
      encounterId,
      payload: encounterEnrichedPayload
    });
    encounterActive = true;
  };
}

export function selectEncounter({ id }) {
  return {
    type: SELECT_ENCOUNTER,
    id
  };
}
