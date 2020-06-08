import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';

import Activity from '../components/Activity';
import Monitor from '../components/Monitor';
import TitleProvider from '../components/TitleProvider';
import TopNav from '../components/TopNav';
import Routes from '../Routes';
import styles from './Root.css';

type Props = {
  store: any;
  history: History;
};

const Root = ({ store, history }: Props) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <TitleProvider />
        <Monitor />
        <div className={styles.container}>
          <TopNav />
          <main className={styles.routes}>
            <Routes />
          </main>
          <Activity />
        </div>
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);
