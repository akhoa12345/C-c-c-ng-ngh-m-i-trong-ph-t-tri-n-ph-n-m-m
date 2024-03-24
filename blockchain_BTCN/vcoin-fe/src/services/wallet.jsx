import axios from 'axios';
import config from '../config/config';
const beURL = config.backend_url;
const walletBeURL = config.backend_wallet_url;

const initWallet = async (password) => {
  const initResult = await axios.post(`${beURL}/wallet/init`, {
    password,
  });
  return initResult.data;
};

const getBalance = async () => {
  const result = await axios.get(`${beURL}/walletInfo`);
  return result.data;
};
const getWallets = async () => {
  const result = await axios.get(`${beURL}/wallets`);

  return result.data;
};

const importWallets = async (passphrase) => {
  const result = await axios.get(
    `${walletBeURL}/passphrase/import/${passphrase}`
  );

  return result.data;
};

const sendCoin = async (from, to, amount) => {
  const result = await axios.post(`${beURL}/sendcoin`, {
    from,
    to,
    amount,
  });
  return result.data;
};

const walletServices = {
  initWallet,
  importWallets,
  getWallets,
  getBalance,
  sendCoin,
};

export default walletServices;
