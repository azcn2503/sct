export const SET_LAST_LOG_LINE = 'SET_LAST_LOG_LINE';

export function setLastLogLine(line: string) {
  return {
    type: SET_LAST_LOG_LINE,
    line
  };
}
