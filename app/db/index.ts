import PouchDB from 'pouchdb';

const db = new PouchDB('SCTActivity');

db.destroy((err, info) => {
  console.debug('Cleared database', { err, info });
});

export default db;
