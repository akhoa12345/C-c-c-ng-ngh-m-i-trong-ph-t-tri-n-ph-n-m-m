import { createSlice } from '@reduxjs/toolkit';
import transactionServices from '../../services/transaction';

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: { transactions: [], page: 1 },
  reducers: {
    setTransactions(state, action) {
      return action.payload;
    },
  },
});

export const { setTransactions } = transactionSlice.actions;

export const getTransactions = (page) => {
  return async (dispatch) => {
    try {
      const transactions = await transactionServices.getTransactions(page);
      if (transactions) {
        dispatch(
          setTransactions({
            transactions,
            page,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default transactionSlice.reducer;
