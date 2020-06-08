import * as actions from '../actions/activity';

export const defaultState = {
  encounters: []
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case actions.REGISTER_DAMAGE: {
      const { target, damage } = action;
      return {
        ...state,
        encounters: [
          ...state.encounters,
          {
            target,
            damage
          }
        ]
      };
    }
    default:
      return state;
  }
}
