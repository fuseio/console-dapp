import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { fetchSupportedTokensByChain, initiateBridge } from "@/lib/chargeApi";
import { transferToken } from "@/lib/erc20";
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

export const fetchChargeTokens = createAsyncThunk(
  "CHARGE_STATE/FETCH_TOKENS",
  async (chainId: number) => {
    return new Promise<any>((resolve, reject) => {
      fetchSupportedTokensByChain(chainId)
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
    }: {
      chainId: number;
      token: string;
      amount: string;
      destinationWallet: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>((resolve, reject) => {
      initiateBridge(chainId.toString(), token, amount, destinationWallet)
        .then((data) => {
          transferToken(
            data.tokenAddress,
            data.walletAddress,
            amount,
            data.tokenDecimals,
            chainId
          ).then((txHash) => {
            thunkAPI.dispatch(
              setLastTransaction({
                id: data.paymentId,
                srcChainId: 122,
                dstChainId: Number(data.chainId),
                amount: `${amount} ${token}`,
              })
            );
            resolve(txHash);
          });
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
    builder.addCase(fetchChargeTokens.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChargeTokens.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tokens = action.payload.tokens;
      state.gasFee = action.payload.gasFee;
      state.bridgeFee = action.payload.bridgeFee;
      state.totalFee = action.payload.totalFee;
      state.totalFeeUSD = action.payload.totalFeeUSD;
    });
    builder.addCase(fetchChargeTokens.rejected, (state) => {
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
  },
  reducers: {},
});

export const selectChargeSlice = (state: AppState): ChargeStateType =>
  state.charge;

export default chargeSlice.reducer;
