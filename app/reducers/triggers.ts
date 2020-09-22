export type TriggerAction = {
  pattern: string;
  command: string;
};

const defaultState: {
  actions: TriggerAction[];
} = {
  actions: []
};

export default function triggers(state = defaultState, action: string) {
  switch (action) {
    default:
      return state;
  }
}
