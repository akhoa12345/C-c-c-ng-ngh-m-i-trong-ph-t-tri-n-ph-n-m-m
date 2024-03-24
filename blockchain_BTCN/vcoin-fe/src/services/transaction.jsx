import axios from 'axios';
import config from '../config/config';

const beURL = config.backend_url;
const getTransactions = async (page) => {
  const result = await axios.get(`${beURL}/transactions/?page=${page}`);

  return result.data;
};

const getTransaction = async (id) => {
  const result = await axios.get(`${beURL}/transaction/${id}`);

  return result.data;
};
const transactionServices = {
  getTransactions,
  getTransaction,
};

export default transactionServices;
