import axios from 'axios';
import config from '../config/config';

const beURL = config.backend_url;
const getBlocks = async (page) => {
  const result = await axios.get(`${beURL}/blocks/?page=${page}`);

  return result.data;
};

const mineTransactions = async () => {
  const result = await axios.get(`${beURL}/mineTransactions`);
  return result.data;
};

const getBlock = async (id) => {
  const result = await axios.get(`${beURL}/block/${id}`);

  return result.data;
};
const blockServices = {
  getBlocks,
  mineTransactions,
  getBlock,
};

export default blockServices;
