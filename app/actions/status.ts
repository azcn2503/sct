import { throttle } from 'lodash';

export const SET_STATUS_MESSAGE = 'SET_STATUS_MESSAGE';

export function setStatusMessage(message: string) {
  return {
    type: SET_STATUS_MESSAGE,
    message
  };
}
