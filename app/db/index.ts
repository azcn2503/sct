import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

let db = null;

export async function init() {
  db = new PouchDB('activity');
  await db.destroy();
  db = new PouchDB('activity'); // yep, again.
  await db.createIndex({
    index: {
      fields: ['encounterId']
    }
  });
  return db;
}

export function getDatabase() {
  return db;
}
