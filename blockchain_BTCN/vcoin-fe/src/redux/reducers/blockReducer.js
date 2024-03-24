import { createSlice } from '@reduxjs/toolkit';
import blockServices from '../../services/block';

const blockSlice = createSlice({
  name: 'block',
  initialState: { blocks: [], page: 1 },
  reducers: {
    setBlocks(state, action) {
      return action.payload;
    },
  },
});

export const { setBlocks } = blockSlice.actions;

export const getBlocks = (page) => {
  return async (dispatch) => {
    try {
      const blocks = await blockServices.getBlocks(page);
      if (blocks) {
        dispatch(
          setBlocks({
            blocks: blocks,
            page,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default blockSlice.reducer;
