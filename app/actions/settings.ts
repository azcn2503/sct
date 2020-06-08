export const SET_LOG_FILE_PATH = 'SET_LOG_FILE_PATH';

export function setLogFilePath(logFilePath) {
  return {
    type: SET_LOG_FILE_PATH,
    logFilePath
  };
}
