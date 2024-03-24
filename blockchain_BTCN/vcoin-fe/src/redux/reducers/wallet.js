import { createSlice } from '@reduxjs/toolkit';
import walletServices from '../../services/wallet';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    passphrase: '',
    addresses: [],
    selected: 0,
    firstGen: true,
    balance: 0,
    token: '',
  },
  reducers: {
    setWallet(state, action) {
      return action.payload;
    },

    setSelectedWallet(state, action) {
      return { ...state, selected: action.payload };
    },
    setBalance(state, action) {
      return { ...state, balance: action.payload };
    },
    setFirstGen(state, action) {
      return { ...state, firstGen: action.payload };
    },
  },
});

export const { setWallet, setSelectedWallet, setBalance, setFirstGen } =
  walletSlice.actions;
export const getBalance = () => {
  return async (dispatch) => {
    try {
      const result = await walletServices.getBalance();

      dispatch(setBalance(result.balance));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getWalletInfo = (passphrase) => {
  return async (dispatch) => {
    try {
      const result = await walletServices.getWallets(passphrase);
      console.log(result);
      if (result.addresses.length !== 0) {
        dispatch(
          setWallet({
            passphrase: result.passphrase,
            addresses: result.addresses,
            selected: result.selected,
            firstGen: result.firstGen,
            balance: 0,
            token: '',
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default walletSlice.reducer;
