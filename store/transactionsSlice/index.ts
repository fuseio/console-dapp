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
import { fetchTransactionStatus } from "@/lib/chargeApi";

export type TransactionType = {
  id: string;
  transactionHash: Address;
  bridgeTransactionHash: Address;
  srcChainId: number;
  dstChainId: number;
  address: string;
  amount: string;
  timestamp: number;
  status: string;
  bridgeStatus: string;
};

export interface TransactionsStateType {
  isTransactionLoading: boolean;
  isError: boolean;
  transactions: MessageStatus[];
  transactionHashes: TransactionType[];
  lastTransaction: TransactionType | null;
}

const INIT_STATE: TransactionsStateType = {
  isTransactionLoading: false,
  isError: false,
  transactions: [],
  transactionHashes: [],
  lastTransaction: null,
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
            hash.transactionHash
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
      waitForMessageReceived(
        transaction.srcChainId,
        transaction.transactionHash
      ).then((message) => {
        resolve({ message: message.status, hash: transaction.transactionHash });
      });
    });
  }
);

export const checkLastTransactionStatus = createAsyncThunk(
  "TRANSACTIONS/CHECK_LAST_TRANSACTION_STATUS",
  async (id: string, thunkAPI) => {
    return new Promise<void>(async (resolve, reject) => {
      const interval = setInterval(() => {
        fetchTransactionStatus(id).then((status) => {
          thunkAPI.dispatch(updateLastTransactionStatus(status.bridgeStatus));
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
        state.transactions = action.payload.transactions;
        state.transactionHashes = action.payload.hashes;
      })
      .addCase(fetchBridgeTransactions.rejected, (state) => {
        state.isTransactionLoading = false;
        state.isError = true;
      })
      .addCase(updateTransactions.pending, (state) => {
        state.isTransactionLoading = true;
      })
      .addCase(updateTransactions.fulfilled, (state, action) => {
        state.transactionHashes = [
          action.payload.hash,
          ...state.transactionHashes,
        ];
        state.transactions = [
          action.payload.transaction,
          ...state.transactions,
        ];
        state.isTransactionLoading = false;
      })
      .addCase(updateTransactions.rejected, (state) => {
        state.isTransactionLoading = false;
        state.isError = true;
      })
      .addCase(updateTransactionStatus.pending, (state) => {
        state.isTransactionLoading = true;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.isTransactionLoading = false;
        const index = state.transactionHashes.findIndex(
          (transaction) =>
            transaction.transactionHash.toLowerCase() ===
            action.payload.hash.toLowerCase()
        );
        if (index !== -1) {
          state.transactions[index] = action.payload.message;
        }
      })
      .addCase(updateTransactionStatus.rejected, (state) => {
        state.isTransactionLoading = false;
        state.isError = true;
      })
      .addCase(setLastTransaction.fulfilled, (state, action) => {
        state.lastTransaction = {
          id: action.payload.id,
          srcChainId: action.payload.srcChainId,
          dstChainId: action.payload.dstChainId,
          amount: action.payload.amount,
        } as TransactionType;
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
