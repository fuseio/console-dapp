import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface ToastStateType {
  isLastTransactionToastOpen: boolean;
  isLiquidityToastOpen: boolean;
}

const INIT_STATE: ToastStateType = {
  isLastTransactionToastOpen: false,
  isLiquidityToastOpen: false,
};

export const toggleLastTransactionToast = createAsyncThunk(
  "TRANSACTIONS/TOGGLE_LAST_TRANSACTION_TOAST",
  async (isLastTransactionToastOpen: boolean, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      resolve(isLastTransactionToastOpen);
    });
  }
);

export const toggleLiquidityToast = createAsyncThunk(
  "TRANSACTIONS/TOGGLE_LIQUIDITY_TOAST",
  async (isLiquidityToastOpen: boolean, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      resolve(isLiquidityToastOpen);
    });
  }
);

const toastSlice = createSlice({
  name: "TRANSACTION_STATE",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: {
    [toggleLastTransactionToast.fulfilled.type]: (state, action) => {
      state.isLastTransactionToastOpen = action.payload;
    },
    [toggleLiquidityToast.fulfilled.type]: (state, action) => {
      state.isLiquidityToastOpen = action.payload;
    },
  },
});

export const selectToastSlice = (state: AppState): ToastStateType =>
  state.toast;

export default toastSlice.reducer;
