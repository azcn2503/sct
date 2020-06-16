import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';

import Status from '../components/Status';
import Monitor from '../components/Monitor';
import TitleProvider from '../components/TitleProvider';
import TopNav from '../components/TopNav';
import Routes from '../Routes';
import styles from './Root.css';
import DatabaseContextWrapper from '../context/Database';

type Props = {
  store: any;
  history: History;
};

const Root = ({ store, history }: Props) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DatabaseContextWrapper>
          <TitleProvider />
          <Monitor />
          <div className={styles.container}>
            <TopNav />
            <main className={styles.routes}>
              <Routes />
            </main>
            <Status />
          </div>
        </DatabaseContextWrapper>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);
