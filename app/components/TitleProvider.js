import React, { useEffect, useRef } from 'react';

import { version } from '../package.json';

function TitleProvider(props) {
  const originalTitle = useRef(document.title);
  useEffect(() => {
    document.title = `SCT - Simple Combat Tracker (version ${version})`;
    return () => {
      document.title = originalTitle;
    };
  }, []);
  return null;
}

export default TitleProvider;
