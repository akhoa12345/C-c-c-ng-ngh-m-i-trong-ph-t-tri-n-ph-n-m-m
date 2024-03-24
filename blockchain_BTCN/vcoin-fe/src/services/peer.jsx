import axios from 'axios';
import config from '../config/config';
const beUrl = config.backend_url;

const getConnectedPeers = async () => {
  const result = await axios.get(`${beUrl}/peers`);
  return result.data;
};

const connectToAPeer = async (peer) => {
  const result = await axios.post(`${beUrl}/addPeer`, {
    peer,
  });

  return result.data;
};
const peerService = { getConnectedPeers, connectToAPeer };

export default peerService;
