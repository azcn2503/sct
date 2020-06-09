import Dexie from 'dexie';

if (process.env.NODE_ENV === 'development') {
  Dexie.debug = true;
}
const db = new Dexie('SCT');

// TODO: Get db indices set up
db.version(1).stores({
  encounters: '++id, targetName',
  activity: 'encounterId, sourceName, targetName, amount, type, special'
});

export default db;
