import * as actions from '../actions/activity';

export const defaultState = {
  selectedEncounterId: null,
  encounters: []
};

export default function reducer(state = defaultState, action: any) {
  switch (action.type) {
    case actions.REGISTER_DAMAGE: {
      const { payload, id, isNew } = action;
      if (isNew) {
        return {
          ...state,
          encounters: [
            ...state.encounters,
            {
              id,
              startTime: Date.now(),
              targetName: payload.targetName,
              activity: [payload],
              actorsByName: {}
            }
          ]
        };
      }
      return {
        ...state,
        encounters: state.encounters.map((encounter: any) => {
          if (encounter.id === id) {
            return {
              ...encounter,
              activity: [...encounter.activity, payload]
            };
          }
          return encounter;
        })
      };
    }

    case actions.END_ENCOUNTER: {
      const { id } = action;
      return {
        ...state,
        encounters: state.encounters.map((encounter: any) => {
          if (encounter.id === id) {
            return {
              ...encounter,
              endTime: Date.now()
            };
          }
          return encounter;
        })
      };
    }

    case actions.SELECT_ENCOUNTER:
      return {
        ...state,
        selectedEncounterId: action.id
      };

    default:
      return state;
  }
}