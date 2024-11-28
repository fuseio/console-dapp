import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import {
  fetchSupportedBridgeTokensByChain,
  fetchSupportedWithdrawTokensByChain,
  initiateBridge,
  initiateWithdraw,
} from "@/lib/chargeApi";
import { sendNative, transferToken } from "@/lib/erc20";
import { setLastTransaction } from "../transactionsSlice";

export interface TokensStateType {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  coinGeckoId: string;
  isNative: boolean;
  icon: string;
  recieveTokens: RecieveTokensStateType[];
}

export interface RecieveTokensStateType {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coinGeckoId: string;
  isNative: boolean;
  icon: string;
}

export interface ChargeStateType {
  tokens: TokensStateType[];
  gasFee: number;
  bridgeFee: number;
  totalFee: number;
  totalFeeUSD: number;
  isLoading: boolean;
  isBridgeLoading: boolean;
}

const INIT_STATE: ChargeStateType = {
  tokens: [],
  gasFee: 0,
  bridgeFee: 0,
  totalFee: 0,
  totalFeeUSD: 0,
  isLoading: true,
  isBridgeLoading: false,
};

export const fetchChargeBridgeTokens = createAsyncThunk(
  "CHARGE_STATE/FETCH_BRIDGE_TOKENS",
  async (chainId: number) => {
    return new Promise<any>((resolve, reject) => {
      fetchSupportedBridgeTokensByChain(chainId)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
);

export const fetchChargeWithdrawTokens = createAsyncThunk(
  "CHARGE_STATE/FETCH_WITHDRAW_TOKENS",
  async (chainId: number) => {
    return new Promise<any>((resolve, reject) => {
      fetchSupportedWithdrawTokensByChain(chainId)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
);

export const initiateBridgeTransaction = createAsyncThunk(
  "CHARGE_STATE/INITIATE_BRIDGE",
  async (
    {
      chainId,
      token,
      amount,
      destinationWallet,
      isNative,
    }: {
      chainId: number;
      token: string;
      amount: string;
      destinationWallet: string;
      isNative?: boolean;
    },
    thunkAPI
  ) => {
    return new Promise<any>((resolve, reject) => {
      initiateBridge(chainId.toString(), token, amount, destinationWallet)
        .then((data) => {
          if (isNative) {
            sendNative(data.walletAddress, amount, chainId).then((txHash) => {
              thunkAPI
                .dispatch(
                  setLastTransaction({
                    id: data.paymentId,
                    srcChainId: 122,
                    dstChainId: Number(data.chainId),
                    amount: `${amount} ${token}`,
                  })
                )
                .catch((error) => {
                  reject(error);
                });
              resolve(txHash);
            });
          } else {
            transferToken(
              data.tokenAddress,
              data.walletAddress,
              amount,
              data.tokenDecimals,
              chainId
            )
              .then((txHash) => {
                thunkAPI.dispatch(
                  setLastTransaction({
                    id: data.paymentId,
                    srcChainId: Number(data.chainId),
                    dstChainId: 122,
                    amount: `${amount} ${token}`,
                  })
                );
                resolve(txHash);
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
);

export const initiateWithdrawTransaction = createAsyncThunk(
  "CHARGE_STATE/INITIATE_WITHDRAW",
  async (
    {
      chainId,
      token,
      amount,
      destinationWallet,
      isNative,
    }: {
      chainId: number;
      token: string;
      amount: string;
      destinationWallet: string;
      isNative?: boolean;
    },
    thunkAPI
  ) => {
    return new Promise<any>((resolve, reject) => {
      initiateWithdraw(chainId.toString(), token, amount, destinationWallet)
        .then((data) => {
          if (isNative) {
            sendNative(data.walletAddress, amount, chainId).then((txHash) => {
              thunkAPI
                .dispatch(
                  setLastTransaction({
                    id: data.paymentId,
                    srcChainId: 122,
                    dstChainId: Number(chainId),
                    amount: `${amount} ${token}`,
                  })
                )
                .catch((error) => {
                  reject(error);
                });
              resolve(txHash);
            });
          } else {
            transferToken(
              data.tokenAddress,
              data.walletAddress,
              amount,
              data.tokenDecimals,
              122
            )
              .then((txHash) => {
                thunkAPI.dispatch(
                  setLastTransaction({
                    id: data.paymentId,
                    srcChainId: 122,
                    dstChainId: Number(chainId),
                    amount: `${amount} ${token}`,
                  })
                );
                resolve(txHash);
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
);

const chargeSlice = createSlice({
  name: "CHARGE_STATE",
  initialState: INIT_STATE,
  extraReducers: (builder) => {
    builder.addCase(fetchChargeBridgeTokens.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChargeBridgeTokens.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tokens = action.payload.tokens;
      state.gasFee = action.payload.gasFee;
      state.bridgeFee = action.payload.bridgeFee;
      state.totalFee = action.payload.totalFee;
      state.totalFeeUSD = action.payload.totalFeeUSD;
    });
    builder.addCase(fetchChargeBridgeTokens.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(initiateBridgeTransaction.pending, (state) => {
      state.isBridgeLoading = true;
    });
    builder.addCase(initiateBridgeTransaction.fulfilled, (state) => {
      state.isBridgeLoading = false;
    });
    builder.addCase(initiateBridgeTransaction.rejected, (state) => {
      state.isBridgeLoading = false;
    });
    builder.addCase(fetchChargeWithdrawTokens.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChargeWithdrawTokens.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tokens = action.payload.tokens;
    });
    builder.addCase(fetchChargeWithdrawTokens.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(initiateWithdrawTransaction.pending, (state) => {
      state.isBridgeLoading = true;
    });
    builder.addCase(initiateWithdrawTransaction.fulfilled, (state) => {
      state.isBridgeLoading = false;
    });
    builder.addCase(initiateWithdrawTransaction.rejected, (state) => {
      state.isBridgeLoading = false;
    });
  },
  reducers: {},
});

export const selectChargeSlice = (state: AppState): ChargeStateType =>
  state.charge;

export default chargeSlice.reducer;
