import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface ToastStateType {
  isLastTransactionToastOpen: boolean;
  isLiquidityToastOpen: boolean;
  isAddTokenToastOpen: boolean;
  token: string | null;
}

const INIT_STATE: ToastStateType = {
  isLastTransactionToastOpen: false,
  isLiquidityToastOpen: false,
  isAddTokenToastOpen: false,
  token: null,
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

export const toggleAddTokenToast = createAsyncThunk(
  "TRANSACTIONS/TOGGLE_ADD_TOKEN_TOAST",
  async (isAddTokenToastOpen: boolean, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      resolve(isAddTokenToastOpen);
    });
  }
);

export const checkandToggleAddTokenToast = createAsyncThunk(
  "TRANSACTIONS/CHECK_ADD_TOKEN_TOAST",
  async (token: string, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      const tokens = localStorage.getItem("tokensAdded");
      if (tokens) {
        const tokensAdded = JSON.parse(tokens);
        if (!tokensAdded.includes(token)) {
          thunkAPI.dispatch(toggleAddTokenToast(true));
          resolve(token);
        }
        else {
          resolve(null);
        }
      }
      else {
        thunkAPI.dispatch(toggleAddTokenToast(true));
        resolve(token);
      }
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
    [toggleAddTokenToast.fulfilled.type]: (state, action) => {
      state.isAddTokenToastOpen = action.payload;
    },
    [checkandToggleAddTokenToast.fulfilled.type]: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const selectToastSlice = (state: AppState): ToastStateType =>
  state.toast;

export default toastSlice.reducer;
