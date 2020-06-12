export const SET_STATUS_MESSAGE = 'SET_STATUS_MESSAGE';

export function setStatusMessage(message) {
  return {
    type: SET_STATUS_MESSAGE,
    message
  };
}
