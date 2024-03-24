import { configureStore } from '@reduxjs/toolkit';

import transactionReducer from './reducers/transactionReducer';
import blockReducer from './reducers/blockReducer';
import walletReducer from './reducers/wallet';
import peerReducer from './reducers/peerReducer';
const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    blocks: blockReducer,
    wallets: walletReducer,
    peers: peerReducer,
  },
});

export default store;
