import db from '../db/configureDatabase';

export const REGISTER_DAMAGE = 'REGISTER_DAMAGE';
export const END_ENCOUNTER = 'END_ENCOUNTER';
export const SELECT_ENCOUNTER = 'SELECT_ENCOUNTER';

let encounterActive = false;
let encounterId = 0;
let encounterTimeout = null;

export function endEncounter() {
  return function endEncounterThunk(dispatch) {
    dispatch({
      type: END_ENCOUNTER,
      id: encounterId
    });
    encounterId += 1;
    encounterActive = false;
  };
}

export function registerDamage(payload) {
  return function registerDamageThunk(dispatch) {
    // Clear the existing encounter timeout if it is set
    clearTimeout(encounterTimeout);

    // End the encounter after 4 seconds
    encounterTimeout = setTimeout(() => {
      dispatch(endEncounter());
    }, 4000);

    // Register the damage, creating new encounter if necessary
    dispatch({
      type: REGISTER_DAMAGE,
      isNew: !encounterActive,
      id: encounterId,
      payload
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
