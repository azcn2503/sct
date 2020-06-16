import React, { useEffect, useState } from 'react';

import * as db from '../db';

export const DatabaseContext = React.createContext(null);

export default function DatabaseContextWrapper({ children }: any) {
  const [database, setDatabase] = useState(null);
  useEffect(() => {
    async function setupDatabase() {
      const initialisedDatabase = await db.init();
      setDatabase(initialisedDatabase);
    }
    setupDatabase();
  }, []);
  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
}
