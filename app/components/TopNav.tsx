import React from 'react';
import classNames from 'classnames';
import { Link, matchPath, useLocation } from 'react-router-dom';

import routes from '../constants/routes.json';
import styles from './TopNav.scss';

export default function TopNav() {
  const location = useLocation();
  return (
    <nav className={styles.nav}>
      {Object.entries(routes).map(([key, { path, icon, label }]) => {
        const isActive = Boolean(
          matchPath(location.pathname, {
            path,
            exact: true
          })
        );

        return (
          <Link
            key={key}
            to={path}
            className={classNames(styles.tab, {
              [styles.isActive]: isActive
            })}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
