import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { toggleLastTransactionToast } from "../toastSlice";
import {
  fetchTransactionHistory,
  fetchTransactionStatus,
} from "@/lib/chargeApi";

export type TransactionType = {
  _id: string;
  amount: number;
  totalAmount: number;
  token: TokenType;
  chainId: number;
  destChainId: number;
  status: string;
  bridgeStatus: string;
  tokenDecimals: number;
  createdAt: string;
  transactionHash: string;
  bridgeTransactionHash: string;
};

export type TokenType = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coinGeckoId: string;
  isNative: boolean;
  icon: string;
};

export interface TransactionsStateType {
  isTransactionLoading: boolean;
  isError: boolean;
  transactions: TransactionType[];
  lastTransaction: any;
}

const INIT_STATE: TransactionsStateType = {
  isTransactionLoading: false,
  isError: false,
  transactions: [],
  lastTransaction: null,
};

export const fetchBridgeTransactions = createAsyncThunk(
  "TRANSACTIONS/FETCH_TRANSACTIONS",
  async (address: string, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      const transactions = await fetchTransactionHistory(address);
      resolve(transactions);
    });
  }
);

export const checkLastTransactionStatus = createAsyncThunk(
  "TRANSACTIONS/CHECK_LAST_TRANSACTION_STATUS",
  async (id: string, thunkAPI) => {
    return new Promise<void>(async (resolve, reject) => {
      const interval = setInterval(() => {
        fetchTransactionStatus(id).then((status) => {
          thunkAPI.dispatch(updateLastTransactionStatus(status));
          if (status.bridgeStatus === "completed") {
            clearInterval(interval);
            resolve();
          }
        });
      }, 15000);
    });
  }
);

export const updateLastTransactionStatus = createAsyncThunk(
  "TRANSACTIONS/UPDATE_LAST_TRANSACTION_STATUS",
  async (status: any, thunkAPI) => {
    return new Promise<any>((resolve, reject) => {
      resolve(status);
    });
  }
);

export const setLastTransaction = createAsyncThunk(
  "TRANSACTIONS/SET_LAST_TRANSACTION",
  async (
    {
      id,
      srcChainId,
      dstChainId,
      amount,
    }: {
      id: string;
      srcChainId: number;
      dstChainId: number;
      amount: string;
    },
    thunkAPI
  ) => {
    thunkAPI.dispatch(toggleLastTransactionToast(true));
    thunkAPI.dispatch(checkLastTransactionStatus(id));
    return {
      id,
      srcChainId,
      dstChainId,
      amount,
    };
  }
);

const transactionsSlice = createSlice({
  name: "TRANSACTION_STATE",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBridgeTransactions.pending, (state) => {
        state.isTransactionLoading = true;
      })
      .addCase(fetchBridgeTransactions.fulfilled, (state, action) => {
        state.isTransactionLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchBridgeTransactions.rejected, (state) => {
        state.isTransactionLoading = false;
        state.isError = true;
      })
      .addCase(setLastTransaction.fulfilled, (state, action) => {
        state.lastTransaction = {
          _id: action.payload.id,
          chainId: action.payload.srcChainId,
          dstChainId: action.payload.dstChainId,
          amount: action.payload.amount,
        };
      })
      .addCase(updateLastTransactionStatus.fulfilled, (state, action) => {
        if (state.lastTransaction) {
          state.lastTransaction.bridgeStatus = action.payload.bridgeStatus;
          state.lastTransaction.status = action.payload.status;
          state.lastTransaction.transactionHash =
            action.payload.transactionHash;
          state.lastTransaction.bridgeTransactionHash =
            action.payload.bridgeTransactionHash;
        }
      });
  },
});

export const selectTransactionsSlice = (
  state: AppState
): TransactionsStateType => state.transactions;

export default transactionsSlice.reducer;
