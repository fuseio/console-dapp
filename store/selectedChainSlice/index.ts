import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface SelectedChainStateType {
  depositSelectedChainItem: number;
  withdrawSelectedChainItem: number;
}

const INIT_STATE: SelectedChainStateType = {
  depositSelectedChainItem: 0,
  withdrawSelectedChainItem: 0,
};

export const setDepositChainItem = createAsyncThunk(
  "SELECTED_CHAIN/SET_DEPOSIT_SELECTED_CHAIN_ITEM",
  async (index: number, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      resolve(index);
    });
  }
);

export const setWithdrawChainItem = createAsyncThunk(
  "SELECTED_CHAIN/SET_WITHDRAW_SELECTED_CHAIN_ITEM",
  async (index: number, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      resolve(index);
    });
  }
);

const selectedChainSlice = createSlice({
  name: "SELECTED_CHAIN",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: {
    [setDepositChainItem.fulfilled.type]: (state, action) => {
      state.depositSelectedChainItem = action.payload;
    },
    [setWithdrawChainItem.fulfilled.type]: (state, action) => {
      state.withdrawSelectedChainItem = action.payload;
    },
  },
});

export const selectSelectedChainSlice = (state: AppState): SelectedChainStateType => state.selectedChain;

export default selectedChainSlice.reducer;
