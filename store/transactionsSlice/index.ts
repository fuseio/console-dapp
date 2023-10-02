import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import {
  getMessagesBySrcTxHash,
  MessageStatus,
  waitForMessageReceived,
} from "@layerzerolabs/scan-client";
import { fetchTransactionsFromLocalStorage } from "@/lib/helpers";
import { toggleLastTransactionToast } from "../toastSlice";
import { Address } from "abitype";

export type TransactionType = {
  hash: Address;
  srcChainId: number;
  dstChainId: number;
  address: string;
  amount: string;
  timestamp: number;
};
export interface TransactionsStateType {
  isTransactionLoading: boolean;
  isError: boolean;
  transactions: MessageStatus[];
  transactionHashes: TransactionType[];
}

const INIT_STATE: TransactionsStateType = {
  isTransactionLoading: false,
  isError: false,
  transactions: [],
  transactionHashes: [],
};

export const fetchBridgeTransactions = createAsyncThunk(
  "TRANSACTIONS/FETCH_TRANSACTIONS",
  async (address: string, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      let transactions: MessageStatus[] = [];
      const hashes = fetchTransactionsFromLocalStorage(address);
      Promise.all(
        hashes.map(async (hash, i) => {
          const { messages } = await getMessagesBySrcTxHash(
            hash.srcChainId,
            hash.hash
          );
          transactions[i] = messages[0].status;
        })
      )
        .then(() => {
          resolve({ transactions, hashes });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
);

export const updateTransactions = createAsyncThunk(
  "TRANSACTIONS/UPDATE_TRANSACTIONS",
  async (transaction: TransactionType, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      thunkAPI.dispatch(updateTransactionStatus(transaction));
      thunkAPI.dispatch(toggleLastTransactionToast(true));
      resolve({
        transaction: MessageStatus.INFLIGHT,
        hash: transaction,
      });
    });
  }
);

export const updateTransactionStatus = createAsyncThunk(
  "TRANSACTIONS/UPDATE_TRANSACTION_STATUS",
  async (transaction: TransactionType, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      waitForMessageReceived(transaction.srcChainId, transaction.hash).then(
        (message) => {
          resolve({ message: message.status, hash: transaction.hash });
        }
      );
    });
  }
);

const transactionsSlice = createSlice({
  name: "TRANSACTION_STATE",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: {
    [fetchBridgeTransactions.pending.type]: (state) => {
      state.isTransactionLoading = true;
    },
    [fetchBridgeTransactions.fulfilled.type]: (state, action) => {
      state.isTransactionLoading = false;
      state.transactions = action.payload.transactions;
      state.transactionHashes = action.payload.hashes;
    },
    [fetchBridgeTransactions.rejected.type]: (state) => {
      state.isTransactionLoading = false;
      state.isError = true;
    },
    [updateTransactions.pending.type]: (state) => {
      state.isTransactionLoading = true;
    },
    [updateTransactions.fulfilled.type]: (state, action) => {
      state.transactionHashes = [
        action.payload.hash,
        ...state.transactionHashes,
      ];
      state.transactions = [action.payload.transaction, ...state.transactions];
      state.isTransactionLoading = false;
    },
    [updateTransactions.rejected.type]: (state) => {
      state.isTransactionLoading = false;
      state.isError = true;
    },
    [updateTransactionStatus.pending.type]: (state) => {
      state.isTransactionLoading = true;
    },
    [updateTransactionStatus.fulfilled.type]: (state, action) => {
      state.isTransactionLoading = false;
      let transactions = state.transactions;
      const hashes = state.transactionHashes;
      hashes.forEach((transaction, index) => {
        if (
          transaction.hash.toLowerCase() === action.payload.hash.toLowerCase()
        ) {
          transactions[index] = action.payload.message;
        }
      });
      state.transactions = transactions;
    },
    [updateTransactionStatus.rejected.type]: (state) => {
      state.isTransactionLoading = false;
      state.isError = true;
    },
  },
});

export const selectTransactionsSlice = (
  state: AppState
): TransactionsStateType => state.transactions;

export default transactionsSlice.reducer;
