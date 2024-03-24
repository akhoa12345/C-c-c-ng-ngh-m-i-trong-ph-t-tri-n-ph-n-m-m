import { createSlice } from '@reduxjs/toolkit';
import peerServices from '../../services/peer';

const peerSlice = createSlice({
  name: 'wallet',
  initialState: {
    connected: [],
  },
  reducers: {
    setPeers(state, action) {
      return action.payload;
    },
  },
});

export const { setPeers } = peerSlice.actions;

export const connectPeer = (peerAddress) => {
  return async (dispatch) => {
    const connectPeer = await peerServices.connectToAPeer(peerAddress);
    const curPeers = await peerServices.getConnectedPeers();
    return {
      status: connectPeer.status,
      curPeers,
    };
  };
};

export default peerSlice.reducer;
