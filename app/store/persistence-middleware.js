import fs from 'fs';
import { throttle } from 'lodash';

let saving = false;

export function getSettings() {
  try {
    return JSON.parse(fs.readFileSync('settings.json', { encoding: 'utf8' }));
  } catch (ex) {
    // File may simply not exist
    return {};
  }
}

function saveSettings(str) {
  if (!saving) {
    saving = true;
    fs.writeFile('settings.json', str, { encoding: 'utf8' }, err => {
      if (err) {
        console.error('Error saving settings.json', err);
      }
      saving = false;
    });
  }
}

const throttledSaveSettings = throttle(saveSettings, 1000);

const persistenceMiddleware = store => next => action => {
  const prevState = store.getState();
  next(action);
  const nextState = store.getState();
  if (
    prevState.settings !== nextState.settings ||
    prevState.plugins !== nextState.plugins
  ) {
    throttledSaveSettings(
      JSON.stringify(
        {
          settings: nextState.settings,
          plugins: nextState.plugins
        },
        null,
        2
      )
    );
  }
};

export default persistenceMiddleware;
